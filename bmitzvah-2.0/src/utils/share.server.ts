import { createClient } from '@supabase/supabase-js'
import type { TemplateKey } from '@/lib/content/types'
import type { Database } from '@/types/database'
import { env } from '@/utils/env.server'
import { getSupabaseAdminClient } from '@/utils/supabase-admin.server'

// Anon client for the public catalog (templates are anon-readable; the
// service-role client is intentionally NOT granted select on reference tables).
function getSupabasePublicClient() {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// The public share card. Read by an unguessable share_slug via the service-role
// client (journeys are authenticated-only under RLS, and the slug is the
// authorization). Only card-safe fields are returned: NEVER username, child_id,
// email, or the celebration who/where free-text.

export type SharedCard = {
  readonly slug: string
  readonly firstName: string
  readonly journeyName: string
  readonly template: TemplateKey
  readonly templateName: string
  readonly templateTagline: string
  readonly themes: readonly string[]
  readonly milestonesDone: number
  readonly milestonesTotal: number
  readonly activities: readonly { readonly title: string; readonly done: boolean }[]
  readonly celebration: string | null
}

export async function getSharedCard(slug: string): Promise<SharedCard | null> {
  const admin = getSupabaseAdminClient()

  const { data: journey } = await admin
    .from('journeys')
    .select('id, template, name, child_id')
    .eq('share_slug', slug)
    .maybeSingle()
  if (!journey) return null

  const [
    { data: profile },
    { data: template },
    { data: milestones },
    { data: activities },
    { data: celebration },
  ] = await Promise.all([
    admin.from('profiles').select('display_name').eq('id', journey.child_id).maybeSingle(),
    getSupabasePublicClient()
      .from('templates')
      .select('name, tagline, themes')
      .eq('key', journey.template)
      .maybeSingle(),
    admin.from('milestones').select('status').eq('journey_id', journey.id),
    admin
      .from('journey_activities')
      .select('title, status')
      .eq('journey_id', journey.id)
      .order('created_at'),
    admin.from('celebration_plans').select('what').eq('journey_id', journey.id).maybeSingle(),
  ])

  const ms = milestones ?? []
  return {
    slug,
    firstName: (profile?.display_name ?? '').split(' ')[0] || 'Someone',
    journeyName: journey.name,
    template: journey.template as TemplateKey,
    templateName: template?.name ?? '',
    templateTagline: template?.tagline ?? '',
    themes: template?.themes ?? [],
    milestonesDone: ms.filter((m) => m.status === 'done').length,
    milestonesTotal: ms.length,
    activities: (activities ?? []).map((a) => ({ title: a.title, done: a.status === 'done' })),
    celebration: celebration?.what || null,
  }
}
