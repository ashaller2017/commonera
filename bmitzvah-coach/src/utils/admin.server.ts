import type { SupabaseClient } from '@supabase/supabase-js'
import type { TemplateKey } from '@/lib/content/types'
import { err, ok, type Result } from '@/lib/result'
import type { Database } from '@/types/database'
import { getCurrentUser } from '@/utils/auth.server'
import { getSupabaseAdminClient } from '@/utils/supabase-admin.server'

// The CommonEra operator surface. Reads run on the RLS-scoped cookie client
// (the admin *_admin_read policies open cross-family access); auth operations
// that touch auth.users (reset password, delete account, create admin) run on
// the service-role client, always after an is-admin check on the cookie client
// (the registerKid pattern). is_admin() at the database is the real boundary.

type Supabase = SupabaseClient<Database>

export async function currentAdmin(supabase: Supabase) {
  const me = await getCurrentUser(supabase)
  return me?.role === 'admin' ? me : null
}

export type AdminError = 'not-admin'

// --- Accounts ------------------------------------------------------------

export type AdminJourneySummary = {
  readonly name: string
  readonly template: TemplateKey
  readonly milestonesDone: number
  readonly milestonesTotal: number
  readonly activitiesPlanned: number
  readonly activitiesDone: number
}

export type AdminKid = {
  readonly id: string
  readonly displayName: string
  readonly username: string | null
  readonly journey: AdminJourneySummary | null
}

export type AdminFamily = {
  readonly id: string
  readonly displayName: string
  readonly createdAt: string
  readonly kids: readonly AdminKid[]
}

type MilestoneRow = { readonly status: Database['public']['Enums']['milestone_status'] }
type ActivityRow = { readonly status: Database['public']['Enums']['activity_status'] }

function summarizeJourney(journey: {
  name: string
  template: string
  milestones: readonly MilestoneRow[]
  journey_activities: readonly ActivityRow[]
}): AdminJourneySummary {
  return {
    name: journey.name,
    template: journey.template as TemplateKey,
    milestonesDone: journey.milestones.filter((m) => m.status === 'done').length,
    milestonesTotal: journey.milestones.length,
    activitiesPlanned: journey.journey_activities.filter((a) => a.status === 'planned').length,
    activitiesDone: journey.journey_activities.filter((a) => a.status === 'done').length,
  }
}

const FAMILY_SELECT =
  'id, display_name, created_at, kids:profiles!parent_id(id, display_name, username, journeys(name, template, milestones(status), journey_activities(status)))'

// journeys embeds as a single object (child_id is unique) or null.
type FamilyRow = {
  id: string
  display_name: string
  created_at: string
  kids: {
    id: string
    display_name: string
    username: string | null
    journeys: {
      name: string
      template: string
      milestones: MilestoneRow[]
      journey_activities: ActivityRow[]
    } | null
  }[]
}

function toFamily(row: FamilyRow): AdminFamily {
  return {
    id: row.id,
    displayName: row.display_name,
    createdAt: row.created_at,
    kids: row.kids.map((k) => ({
      id: k.id,
      displayName: k.display_name,
      username: k.username,
      journey: k.journeys ? summarizeJourney(k.journeys) : null,
    })),
  }
}

export async function listAllAccounts(
  supabase: Supabase,
): Promise<Result<readonly AdminFamily[], AdminError>> {
  const admin = await currentAdmin(supabase)
  if (!admin) return err('not-admin')

  const { data, error } = await supabase
    .from('profiles')
    .select(FAMILY_SELECT)
    .eq('role', 'parent')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('listAllAccounts failed', error)
    return err('not-admin')
  }
  // supabase-js mis-infers the self-referential parent_id embed as to-one;
  // PostgREST returns kids as an array at runtime, so bridge via unknown.
  return ok((data as unknown as FamilyRow[]).map(toFamily))
}

export async function getFamilyDetail(
  supabase: Supabase,
  parentId: string,
): Promise<Result<AdminFamily | null, AdminError>> {
  const admin = await currentAdmin(supabase)
  if (!admin) return err('not-admin')

  const { data, error } = await supabase
    .from('profiles')
    .select(FAMILY_SELECT)
    .eq('id', parentId)
    .eq('role', 'parent')
    .maybeSingle()
  if (error) {
    console.error('getFamilyDetail failed', error)
    return err('not-admin')
  }
  return ok(data ? toFamily(data as unknown as FamilyRow) : null)
}

// --- Dashboard stats -----------------------------------------------------

export type AdminStats = {
  readonly families: number
  readonly kids: number
  readonly journeys: number
  readonly completedJourneys: number
  readonly interestLeads: number
  readonly templatePopularity: readonly { readonly template: TemplateKey; readonly count: number }[]
}

export async function getAdminStats(supabase: Supabase): Promise<Result<AdminStats, AdminError>> {
  const admin = await currentAdmin(supabase)
  if (!admin) return err('not-admin')

  const countOf = async (
    table: 'profiles' | 'provider_interest',
    apply?: (q: ReturnType<Supabase['from']>) => unknown,
  ): Promise<number> => {
    let query = supabase.from(table).select('*', { count: 'exact', head: true })
    if (apply) query = apply(query) as typeof query
    const { count } = await query
    return count ?? 0
  }

  const [families, kids, interestLeads] = await Promise.all([
    countOf('profiles', (q) => q.eq('role', 'parent')),
    countOf('profiles', (q) => q.eq('role', 'child')),
    countOf('provider_interest'),
  ])

  // Template popularity + completion are derived from the journeys + milestones,
  // which are small enough to roll up in memory.
  const { data: journeys } = await supabase.from('journeys').select('template, milestones(status)')
  const rows = journeys ?? []
  const popularity = new Map<TemplateKey, number>()
  let completed = 0
  for (const j of rows) {
    const key = j.template as TemplateKey
    popularity.set(key, (popularity.get(key) ?? 0) + 1)
    const ms = j.milestones as MilestoneRow[]
    if (ms.length > 0 && ms.every((m) => m.status === 'done')) completed += 1
  }

  return ok({
    families,
    kids,
    journeys: rows.length,
    completedJourneys: completed,
    interestLeads,
    templatePopularity: [...popularity.entries()]
      .map(([template, count]) => ({ template, count }))
      .sort((a, b) => b.count - a.count),
  })
}

// --- Provider interest leads ---------------------------------------------

export type AdminInterestLead = {
  readonly id: string
  readonly providerKey: string
  readonly name: string
  readonly email: string
  readonly note: string
  readonly createdAt: string
}

export async function listInterestLeads(
  supabase: Supabase,
): Promise<Result<readonly AdminInterestLead[], AdminError>> {
  const admin = await currentAdmin(supabase)
  if (!admin) return err('not-admin')

  const { data, error } = await supabase
    .from('provider_interest')
    .select('id, provider_key, name, email, note, created_at')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('listInterestLeads failed', error)
    return err('not-admin')
  }
  return ok(
    data.map((r) => ({
      id: r.id,
      providerKey: r.provider_key,
      name: r.name,
      email: r.email,
      note: r.note,
      createdAt: r.created_at,
    })),
  )
}

// --- Admin users ---------------------------------------------------------

export type AdminUser = {
  readonly id: string
  readonly displayName: string
  readonly isSelf: boolean
}

export async function listAdmins(
  supabase: Supabase,
): Promise<Result<readonly AdminUser[], AdminError>> {
  const admin = await currentAdmin(supabase)
  if (!admin) return err('not-admin')

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, created_at')
    .eq('role', 'admin')
    .order('created_at')
  if (error) {
    console.error('listAdmins failed', error)
    return err('not-admin')
  }
  return ok(data.map((r) => ({ id: r.id, displayName: r.display_name, isSelf: r.id === admin.id })))
}

export type CreateAdminInput = {
  readonly email: string
  readonly password: string
  readonly displayName: string
}
export type CreateAdminError = AdminError | 'email-taken' | 'create-failed'

export async function createAdmin(
  supabase: Supabase,
  input: CreateAdminInput,
): Promise<Result<AdminUser, CreateAdminError>> {
  const me = await currentAdmin(supabase)
  if (!me) return err('not-admin')

  const admin = getSupabaseAdminClient()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  })
  if (createError || !created.user) {
    return err(createError?.code === 'email_exists' ? 'email-taken' : 'create-failed')
  }

  const { error: profileError } = await admin.from('profiles').insert({
    id: created.user.id,
    role: 'admin',
    display_name: input.displayName,
  })
  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id)
    console.error('createAdmin: profile insert failed', profileError)
    return err('create-failed')
  }
  return ok({ id: created.user.id, displayName: input.displayName, isSelf: false })
}

export type DeleteAdminError = AdminError | 'cannot-delete-self' | 'last-admin' | 'delete-failed'

export async function deleteAdmin(
  supabase: Supabase,
  adminId: string,
): Promise<Result<null, DeleteAdminError>> {
  const me = await currentAdmin(supabase)
  if (!me) return err('not-admin')
  if (adminId === me.id) return err('cannot-delete-self')

  const admin = getSupabaseAdminClient()
  const { count } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin')
  if ((count ?? 0) <= 1) return err('last-admin')

  // Verify the target is actually an admin before deleting the auth user.
  const { data: target } = await admin
    .from('profiles')
    .select('role')
    .eq('id', adminId)
    .maybeSingle()
  if (target?.role !== 'admin') return err('delete-failed')

  const { error } = await admin.auth.admin.deleteUser(adminId)
  if (error) {
    console.error('deleteAdmin failed', error)
    return err('delete-failed')
  }
  return ok(null)
}

// --- Account management (auth.users mutations, service-role) --------------

export type AccountActionError = AdminError | 'not-found' | 'action-failed'

async function assertRole(
  admin: ReturnType<typeof getSupabaseAdminClient>,
  id: string,
  role: 'parent' | 'child',
): Promise<boolean> {
  const { data } = await admin.from('profiles').select('role').eq('id', id).maybeSingle()
  return data?.role === role
}

export async function resetKidPassword(
  supabase: Supabase,
  kidId: string,
  newPassword: string,
): Promise<Result<null, AccountActionError>> {
  const me = await currentAdmin(supabase)
  if (!me) return err('not-admin')

  const admin = getSupabaseAdminClient()
  if (!(await assertRole(admin, kidId, 'child'))) return err('not-found')

  const { error } = await admin.auth.admin.updateUserById(kidId, { password: newPassword })
  if (error) {
    console.error('resetKidPassword failed', error)
    return err('action-failed')
  }
  return ok(null)
}

export async function deleteKid(
  supabase: Supabase,
  kidId: string,
): Promise<Result<null, AccountActionError>> {
  const me = await currentAdmin(supabase)
  if (!me) return err('not-admin')

  const admin = getSupabaseAdminClient()
  if (!(await assertRole(admin, kidId, 'child'))) return err('not-found')

  // Deleting the auth user cascades the profile, journey, milestones, etc.
  const { error } = await admin.auth.admin.deleteUser(kidId)
  if (error) {
    console.error('deleteKid failed', error)
    return err('action-failed')
  }
  return ok(null)
}

export async function deleteParent(
  supabase: Supabase,
  parentId: string,
): Promise<Result<null, AccountActionError>> {
  const me = await currentAdmin(supabase)
  if (!me) return err('not-admin')

  const admin = getSupabaseAdminClient()
  if (!(await assertRole(admin, parentId, 'parent'))) return err('not-found')

  // profiles.parent_id cascades child profiles when the parent profile goes, but
  // each child still owns an auth.users row. Delete the kids' auth users first
  // (cascading their profiles), then the parent's, so nothing is left orphaned.
  const { data: kids } = await admin.from('profiles').select('id').eq('parent_id', parentId)
  for (const kid of kids ?? []) {
    const { error } = await admin.auth.admin.deleteUser(kid.id)
    if (error) {
      console.error('deleteParent: kid delete failed', error)
      return err('action-failed')
    }
  }
  const { error } = await admin.auth.admin.deleteUser(parentId)
  if (error) {
    console.error('deleteParent failed', error)
    return err('action-failed')
  }
  return ok(null)
}
