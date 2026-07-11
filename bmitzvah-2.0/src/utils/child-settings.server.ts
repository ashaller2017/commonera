import type { SupabaseClient } from '@supabase/supabase-js'
import type { ComfortKey, TimelineKey } from '@/lib/content/types'
import { err, ok, type Result } from '@/lib/result'
import type { Database } from '@/types/database'
import { getCurrentUser } from '@/utils/auth.server'

type Supabase = SupabaseClient<Database>

// The parent-answered facts about a child: when the celebration is and how
// Jewish-traditional it should feel. A child_settings row is the live source;
// journeys made before this table existed carry the answers the kid gave in
// the old quiz setup step, so reads fall back to that snapshot. `answered`
// is true only when a parent has actually saved a row — the fallback still
// nudges the parent to make the answer theirs.
export type ChildSettings = {
  readonly timeline: TimelineKey | null
  readonly comfort: ComfortKey | null
  readonly answered: boolean
}

export const EMPTY_CHILD_SETTINGS: ChildSettings = {
  timeline: null,
  comfort: null,
  answered: false,
}

export async function getChildSettings(
  supabase: Supabase,
  childId: string,
): Promise<ChildSettings> {
  const { data: row } = await supabase
    .from('child_settings')
    .select('timeline, comfort_level')
    .eq('child_id', childId)
    .maybeSingle()
  if (row) {
    return {
      timeline: (row.timeline || null) as TimelineKey | null,
      comfort: (row.comfort_level || null) as ComfortKey | null,
      answered: true,
    }
  }

  const { data: journey } = await supabase
    .from('journeys')
    .select('timeline, comfort_level')
    .eq('child_id', childId)
    .maybeSingle()
  if (!journey) return EMPTY_CHILD_SETTINGS
  return {
    timeline: (journey.timeline || null) as TimelineKey | null,
    comfort: (journey.comfort_level || null) as ComfortKey | null,
    answered: false,
  }
}

export type UpsertChildSettingsInput = {
  readonly childId: string
  readonly timeline: TimelineKey | null
  readonly comfort: ComfortKey | null
}

export type UpsertChildSettingsError = 'not-a-parent' | 'not-your-child' | 'write-failed'

// A parent answering (or re-answering) the questions about their own child.
// The ownership check mirrors resetChildPassword for a clean typed error; RLS
// (child_settings_insert_parent / _update_parent) is the real boundary.
export async function upsertChildSettings(
  supabase: Supabase,
  input: UpsertChildSettingsInput,
): Promise<Result<null, UpsertChildSettingsError>> {
  const parent = await getCurrentUser(supabase)
  if (parent?.role !== 'parent') return err('not-a-parent')

  const { data: child } = await supabase
    .from('profiles')
    .select('id, role, parent_id')
    .eq('id', input.childId)
    .maybeSingle()
  if (child?.role !== 'child' || child.parent_id !== parent.id) {
    return err('not-your-child')
  }

  const { error } = await supabase.from('child_settings').upsert({
    child_id: input.childId,
    timeline: input.timeline,
    comfort_level: input.comfort,
    updated_at: new Date().toISOString(),
  })
  if (error) {
    console.error('upsertChildSettings failed', error)
    return err('write-failed')
  }
  return ok(null)
}
