import type { SupabaseClient } from '@supabase/supabase-js'
import { kidEmailFor } from '@/lib/auth/kid-credentials'
import type { AppRole, AuthUser } from '@/lib/auth/types'
import { asUserId } from '@/lib/ids'
import { err, ok, type Result } from '@/lib/result'
import type { Database } from '@/types/database'
import { sendPasswordResetEmail, sendWelcomeEmail } from '@/utils/email.server'
import { env } from '@/utils/env.server'
import { getSupabaseAdminClient } from '@/utils/supabase-admin.server'

type Supabase = SupabaseClient<Database>

const PG_UNIQUE_VIOLATION = '23505'

export async function getCurrentUser(supabase: Supabase): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, display_name, username')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile) return null

  return {
    id: asUserId(profile.id),
    role: profile.role as AppRole,
    displayName: profile.display_name,
    username: profile.username,
  }
}

export type SignupParentInput = {
  readonly email: string
  readonly password: string
  readonly displayName: string
}

export type SignupParentError = 'email-taken' | 'signup-failed'

export async function signupParent(
  supabase: Supabase,
  input: SignupParentInput,
): Promise<Result<AuthUser, SignupParentError>> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  })
  if (error) {
    return err(error.code === 'user_already_exists' ? 'email-taken' : 'signup-failed')
  }
  if (!data.user) return err('signup-failed')

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    role: 'parent',
    display_name: input.displayName,
  })
  // A unique violation means the profile already exists from an earlier
  // attempt with this account, which is fine.
  if (profileError && profileError.code !== PG_UNIQUE_VIOLATION) {
    console.error('signupParent: profile insert failed', profileError)
    return err('signup-failed')
  }

  // Welcome email is best-effort: it must not fail the signup (sendWelcomeEmail never throws).
  await sendWelcomeEmail(input.email, input.displayName)

  return ok({
    id: asUserId(data.user.id),
    role: 'parent',
    displayName: input.displayName,
    username: null,
  })
}

export type LoginError = 'invalid-credentials'

export async function loginWithPassword(
  supabase: Supabase,
  email: string,
  password: string,
): Promise<Result<AuthUser, LoginError>> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return err('invalid-credentials')
  const user = await getCurrentUser(supabase)
  if (!user) return err('invalid-credentials')
  return ok(user)
}

export type RegisterKidInput = {
  readonly username: string
  readonly displayName: string
  readonly password: string
}

export type RegisterKidError = 'not-a-parent' | 'username-taken' | 'registration-failed'

export type RegisteredKid = {
  readonly id: string
  readonly username: string
  readonly displayName: string
}

// The one deliberate service-role path in the app: a parent creating their
// kid's login. The caller is verified as a parent before the admin client is
// touched, and the admin client never leaves this module's callees.
export async function registerKid(
  supabase: Supabase,
  input: RegisterKidInput,
): Promise<Result<RegisteredKid, RegisterKidError>> {
  const parent = await getCurrentUser(supabase)
  if (parent?.role !== 'parent') return err('not-a-parent')

  const admin = getSupabaseAdminClient()

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: kidEmailFor(input.username),
    password: input.password,
    email_confirm: true,
  })
  if (createError) {
    return err(createError.code === 'email_exists' ? 'username-taken' : 'registration-failed')
  }
  if (!created.user) return err('registration-failed')

  const { error: profileError } = await admin.from('profiles').insert({
    id: created.user.id,
    role: 'child',
    display_name: input.displayName,
    username: input.username,
    parent_id: parent.id,
  })
  if (profileError) {
    // Roll the auth user back so the username is not stranded half-created.
    await admin.auth.admin.deleteUser(created.user.id)
    if (profileError.code === PG_UNIQUE_VIOLATION) return err('username-taken')
    console.error('registerKid: profile insert failed', profileError)
    return err('registration-failed')
  }

  return ok({ id: created.user.id, username: input.username, displayName: input.displayName })
}

export type ResetChildPasswordError = 'not-a-parent' | 'not-your-child' | 'reset-failed'

// A parent setting a new password for their own child. The child is verified to belong to the
// caller via the RLS-scoped client first; only then does the service-role client touch
// auth.users (the same gated pattern as registerKid). Kids cannot reset their own password, so
// this parent path is the only way a child's password changes short of an admin.
export async function resetChildPassword(
  supabase: Supabase,
  childId: string,
  newPassword: string,
): Promise<Result<null, ResetChildPasswordError>> {
  const parent = await getCurrentUser(supabase)
  if (parent?.role !== 'parent') return err('not-a-parent')

  const { data: child } = await supabase
    .from('profiles')
    .select('id, role, parent_id')
    .eq('id', childId)
    .maybeSingle()
  if (child?.role !== 'child' || child.parent_id !== parent.id) {
    return err('not-your-child')
  }

  const admin = getSupabaseAdminClient()
  const { error } = await admin.auth.admin.updateUserById(childId, { password: newPassword })
  if (error) {
    console.error('resetChildPassword failed', error)
    return err('reset-failed')
  }
  return ok(null)
}

export async function logout(supabase: Supabase): Promise<void> {
  await supabase.auth.signOut()
}

// --- Password reset (parent self-service) --------------------------------

// Request a reset link for a parent's own account. Generates a recovery link out-of-band
// (admin), then sends a branded email via Resend. Always resolves without signal so the caller
// cannot use it to probe which emails are registered. Kids never get a link: they use synthetic
// emails and cannot reset their own password.
export async function requestPasswordReset(email: string): Promise<void> {
  const admin = getSupabaseAdminClient()
  const { data, error } = await admin.auth.admin.generateLink({ type: 'recovery', email })
  if (error || !data.user) return

  const { data: profile } = await admin
    .from('profiles')
    .select('role, display_name')
    .eq('id', data.user.id)
    .maybeSingle()
  if (!profile || profile.role === 'child') return

  const resetUrl = `${env.SITE_URL}/reset-password?token_hash=${data.properties.hashed_token}&type=recovery`
  await sendPasswordResetEmail(email, resetUrl, profile.display_name)
}

export type ResetPasswordError =
  | 'invalid-or-expired'
  | 'same-password'
  | 'weak-password'
  | 'update-failed'

// Complete a reset: verify the one-time recovery token (which establishes a recovery session on
// the RLS-scoped client), then set the new password as that user. No service role: the user is
// changing their own password.
//
// The recovery token is single-use, so if the first submit verified it but the new password was
// rejected (too weak, same as the old one), a naive re-verify would fail with "invalid link".
// Instead we reuse the recovery session established on that first submit, so the user can fix the
// password and retry without requesting a fresh link.
export async function resetPasswordWithToken(
  supabase: Supabase,
  tokenHash: string,
  password: string,
): Promise<Result<null, ResetPasswordError>> {
  const {
    data: { user: recovering },
  } = await supabase.auth.getUser()
  if (!recovering) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'recovery',
    })
    if (verifyError) return err('invalid-or-expired')
  }

  const { error: updateError } = await supabase.auth.updateUser({ password })
  if (updateError) {
    console.error('resetPasswordWithToken: update failed', updateError)
    const message = updateError.message?.toLowerCase() ?? ''
    if (updateError.code === 'same_password' || message.includes('different from the old')) {
      return err('same-password')
    }
    if (
      updateError.code === 'weak_password' ||
      message.includes('weak') ||
      message.includes('should be at least')
    ) {
      return err('weak-password')
    }
    return err('update-failed')
  }
  return ok(null)
}
