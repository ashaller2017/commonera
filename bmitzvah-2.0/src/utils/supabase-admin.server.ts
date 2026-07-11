import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { env } from '@/utils/env.server'

// Service-role client. Bypasses RLS. Only for the parent-registers-child admin
// path; must never be imported outside *.server.ts modules.
export function getSupabaseAdminClient() {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
