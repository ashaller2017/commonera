import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  createAdmin,
  deleteAdmin,
  deleteKid,
  deleteParent,
  getAdminStats,
  getFamilyDetail,
  listAdmins,
  listAllAccounts,
  listInterestLeads,
  resetKidPassword,
} from '@/utils/admin.server'
import { getSupabaseServerClient } from '@/utils/supabase'

const ParentIdSchema = z.object({ parentId: z.uuid() })
const KidIdSchema = z.object({ kidId: z.uuid() })
const AdminIdSchema = z.object({ adminId: z.uuid() })

const CreateAdminSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  displayName: z.string().trim().min(1).max(60),
})

const ResetPasswordSchema = z.object({
  kidId: z.uuid(),
  password: z.string().min(6).max(72),
})

// --- Reads (unwrap to plain values for loaders; the route is admin-gated) --

export const fetchAdminStatsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const r = await getAdminStats(getSupabaseServerClient())
  return r.ok ? r.value : null
})

export const fetchAllAccountsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const r = await listAllAccounts(getSupabaseServerClient())
  return r.ok ? r.value : []
})

export const fetchFamilyDetailFn = createServerFn({ method: 'GET' })
  .validator(ParentIdSchema)
  .handler(async ({ data }) => {
    const r = await getFamilyDetail(getSupabaseServerClient(), data.parentId)
    return r.ok ? r.value : null
  })

export const fetchInterestLeadsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const r = await listInterestLeads(getSupabaseServerClient())
  return r.ok ? r.value : []
})

export const fetchAdminsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const r = await listAdmins(getSupabaseServerClient())
  return r.ok ? r.value : []
})

// --- Account & admin mutations (return Result) ---------------------------

export const createAdminFn = createServerFn({ method: 'POST' })
  .validator(CreateAdminSchema)
  .handler(async ({ data }) => createAdmin(getSupabaseServerClient(), data))

export const deleteAdminFn = createServerFn({ method: 'POST' })
  .validator(AdminIdSchema)
  .handler(async ({ data }) => deleteAdmin(getSupabaseServerClient(), data.adminId))

export const resetKidPasswordFn = createServerFn({ method: 'POST' })
  .validator(ResetPasswordSchema)
  .handler(async ({ data }) =>
    resetKidPassword(getSupabaseServerClient(), data.kidId, data.password),
  )

export const deleteKidFn = createServerFn({ method: 'POST' })
  .validator(KidIdSchema)
  .handler(async ({ data }) => deleteKid(getSupabaseServerClient(), data.kidId))

export const deleteParentFn = createServerFn({ method: 'POST' })
  .validator(ParentIdSchema)
  .handler(async ({ data }) => deleteParent(getSupabaseServerClient(), data.parentId))
