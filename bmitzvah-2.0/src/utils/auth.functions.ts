import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { kidEmailFor, USERNAME_PATTERN } from '@/lib/auth/kid-credentials'
import {
  getCurrentUser,
  loginWithPassword,
  logout,
  registerKid,
  requestPasswordReset,
  resetChildPassword,
  resetPasswordWithToken,
  signupParent,
} from '@/utils/auth.server'
import { getSupabaseServerClient } from '@/utils/supabase'

const UsernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(USERNAME_PATTERN, 'Usernames are 3 to 20 lowercase letters, numbers or underscores')

const SignupParentSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  displayName: z.string().trim().min(1).max(60),
})

const LoginParentSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

const LoginKidSchema = z.object({
  username: UsernameSchema,
  password: z.string().min(1),
})

const RegisterKidSchema = z.object({
  username: UsernameSchema,
  displayName: z.string().trim().min(1).max(60),
  password: z.string().min(6),
})

export const fetchUserFn = createServerFn({ method: 'GET' }).handler(async () =>
  getCurrentUser(getSupabaseServerClient()),
)

export const signupParentFn = createServerFn({ method: 'POST' })
  .validator(SignupParentSchema)
  .handler(async ({ data }) => signupParent(getSupabaseServerClient(), data))

export const loginParentFn = createServerFn({ method: 'POST' })
  .validator(LoginParentSchema)
  .handler(async ({ data }) =>
    loginWithPassword(getSupabaseServerClient(), data.email, data.password),
  )

export const loginKidFn = createServerFn({ method: 'POST' })
  .validator(LoginKidSchema)
  .handler(async ({ data }) =>
    loginWithPassword(getSupabaseServerClient(), kidEmailFor(data.username), data.password),
  )

export const registerKidFn = createServerFn({ method: 'POST' })
  .validator(RegisterKidSchema)
  .handler(async ({ data }) => registerKid(getSupabaseServerClient(), data))

const ResetChildPasswordSchema = z.object({
  childId: z.uuid(),
  password: z.string().min(6).max(72),
})

export const resetChildPasswordFn = createServerFn({ method: 'POST' })
  .validator(ResetChildPasswordSchema)
  .handler(async ({ data }) =>
    resetChildPassword(getSupabaseServerClient(), data.childId, data.password),
  )

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  await logout(getSupabaseServerClient())
  return null
})

const RequestPasswordResetSchema = z.object({ email: z.email() })

export const requestPasswordResetFn = createServerFn({ method: 'POST' })
  .validator(RequestPasswordResetSchema)
  .handler(async ({ data }) => {
    await requestPasswordReset(data.email)
    return null
  })

const ResetPasswordSchema = z.object({
  tokenHash: z.string().min(1),
  password: z.string().min(8).max(72),
})

export const resetPasswordFn = createServerFn({ method: 'POST' })
  .validator(ResetPasswordSchema)
  .handler(async ({ data }) =>
    resetPasswordWithToken(getSupabaseServerClient(), data.tokenHash, data.password),
  )
