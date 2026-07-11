import { createServerFn } from '@tanstack/react-start'
import { getCurrentUser } from '@/utils/auth.server'
import {
  getActivityPrompts,
  getComfortOptions,
  getProviders,
  getQuizQuestions,
  getStories,
  getTemplates,
  getTimelineOptions,
} from '@/utils/content.server'
import { getSupabaseServerClient } from '@/utils/supabase'

// The RPC surface for the reference catalog. Each wrapper is a thin GET that
// delegates to content.server. Called from route loaders; the catalog is
// public, so these work for anon and authenticated visitors alike.

export const fetchTemplatesFn = createServerFn({ method: 'GET' }).handler(async () =>
  getTemplates(getSupabaseServerClient()),
)

export const fetchActivityPromptsFn = createServerFn({ method: 'GET' }).handler(async () =>
  getActivityPrompts(getSupabaseServerClient()),
)

// Provider pricing is a parent concern: kids and logged-out visitors never
// receive the price range (stripped server-side so it isn't in their bundle).
// Parents and admins get the full record.
export const fetchProvidersFn = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const providers = await getProviders(supabase)
  const me = await getCurrentUser(supabase)
  const canSeePricing = me?.role === 'parent' || me?.role === 'admin'
  return canSeePricing ? providers : providers.map((p) => ({ ...p, priceRange: '' }))
})

export const fetchStoriesFn = createServerFn({ method: 'GET' }).handler(async () =>
  getStories(getSupabaseServerClient()),
)

export const fetchQuizContentFn = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const [questions, timeline, comfort] = await Promise.all([
    getQuizQuestions(supabase),
    getTimelineOptions(supabase),
    getComfortOptions(supabase),
  ])
  return { questions, timeline, comfort }
})

export const fetchTimelineOptionsFn = createServerFn({ method: 'GET' }).handler(async () =>
  getTimelineOptions(getSupabaseServerClient()),
)

// The two "about your kid" option lists (timeline + observance), for the
// parent-facing setup questions — the quiz questions stay out of the payload.
export const fetchSetupOptionsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const [timeline, comfort] = await Promise.all([
    getTimelineOptions(supabase),
    getComfortOptions(supabase),
  ])
  return { timeline, comfort }
})
