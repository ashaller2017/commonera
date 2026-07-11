import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { COMFORT_KEYS, TIMELINE_KEYS } from '@/lib/content/types'
import { getChildSettings, upsertChildSettings } from '@/utils/child-settings.server'
import { getSupabaseServerClient } from '@/utils/supabase'

const FetchChildSettingsSchema = z.object({ childId: z.uuid() })

const UpsertChildSettingsSchema = z.object({
  childId: z.uuid(),
  timeline: z.enum(TIMELINE_KEYS).nullable(),
  comfort: z.enum(COMFORT_KEYS).nullable(),
})

export const fetchChildSettingsFn = createServerFn({ method: 'GET' })
  .validator(FetchChildSettingsSchema)
  .handler(async ({ data }) => getChildSettings(getSupabaseServerClient(), data.childId))

// The kid's own settings, for the quiz: scoring wants the parent's observance
// answer without the kid needing to know their own profile id client-side.
export const fetchOwnSettingsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { timeline: null, comfort: null, answered: false }
  return getChildSettings(supabase, user.id)
})

export const upsertChildSettingsFn = createServerFn({ method: 'POST' })
  .validator(UpsertChildSettingsSchema)
  .handler(async ({ data }) => upsertChildSettings(getSupabaseServerClient(), data))
