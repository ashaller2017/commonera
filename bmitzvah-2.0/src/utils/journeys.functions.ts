import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import {
  addActivity,
  createJourney,
  expressInterest,
  getJourneyView,
  listFavorites,
  listKids,
  removeActivity,
  setActivityStatus,
  setFavorite,
  setMilestoneStatus,
  upsertCelebration,
} from '@/utils/journeys.server'
import { getSupabaseServerClient } from '@/utils/supabase'

const QuizAnswersSchema = z
  .record(z.string(), z.array(z.string()).max(12))
  .refine((answers) => Object.keys(answers).length <= 24, 'Too many answers')

const CreateJourneySchema = z.object({
  template: z.enum(TEMPLATE_KEYS),
  name: z.string().trim().min(1).max(80),
  answers: QuizAnswersSchema,
})

const MilestoneStatusSchema = z.object({
  milestoneId: z.uuid(),
  status: z.enum(['todo', 'in_progress', 'done']),
})

const AddActivitySchema = z.object({
  promptId: z.string().max(80).nullable(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(''),
})

const ActivityStatusSchema = z.object({
  activityId: z.uuid(),
  status: z.enum(['planned', 'done']),
})

const RemoveActivitySchema = z.object({ activityId: z.uuid() })

const CelebrationSchema = z.object({
  what: z.string().trim().max(500).default(''),
  whoWith: z.string().trim().max(500).default(''),
  whereAt: z.string().trim().max(500).default(''),
})

const ExpressInterestSchema = z.object({
  // Provider validity is enforced by the provider_interest.provider_key foreign
  // key, so the catalog no longer needs to be bundled into this validator.
  providerKey: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(80),
  email: z.email(),
  note: z.string().trim().max(500).default(''),
})

const ChildIdSchema = z.object({ childId: z.uuid() })

const SetFavoriteSchema = z.object({
  // Provider validity is enforced by the provider_favorite.provider_key foreign
  // key, so the catalog does not need bundling here (as with ExpressInterest).
  providerKey: z.string().trim().min(1).max(80),
  favorited: z.boolean(),
})

export const fetchOwnJourneyFn = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  return getJourneyView(supabase, user.id)
})

export const fetchKidJourneyFn = createServerFn({ method: 'GET' })
  .validator(ChildIdSchema)
  .handler(async ({ data }) => getJourneyView(getSupabaseServerClient(), data.childId))

export const createJourneyFn = createServerFn({ method: 'POST' })
  .validator(CreateJourneySchema)
  .handler(async ({ data }) => createJourney(getSupabaseServerClient(), data))

export const setMilestoneStatusFn = createServerFn({ method: 'POST' })
  .validator(MilestoneStatusSchema)
  .handler(async ({ data }) =>
    setMilestoneStatus(getSupabaseServerClient(), data.milestoneId, data.status),
  )

export const addActivityFn = createServerFn({ method: 'POST' })
  .validator(AddActivitySchema)
  .handler(async ({ data }) => addActivity(getSupabaseServerClient(), data))

export const setActivityStatusFn = createServerFn({ method: 'POST' })
  .validator(ActivityStatusSchema)
  .handler(async ({ data }) =>
    setActivityStatus(getSupabaseServerClient(), data.activityId, data.status),
  )

export const removeActivityFn = createServerFn({ method: 'POST' })
  .validator(RemoveActivitySchema)
  .handler(async ({ data }) => removeActivity(getSupabaseServerClient(), data.activityId))

export const upsertCelebrationFn = createServerFn({ method: 'POST' })
  .validator(CelebrationSchema)
  .handler(async ({ data }) => upsertCelebration(getSupabaseServerClient(), data))

export const fetchKidsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []
  return listKids(supabase, user.id)
})

export const expressInterestFn = createServerFn({ method: 'POST' })
  .validator(ExpressInterestSchema)
  .handler(async ({ data }) => expressInterest(getSupabaseServerClient(), data))

export const setFavoriteFn = createServerFn({ method: 'POST' })
  .validator(SetFavoriteSchema)
  .handler(async ({ data }) => setFavorite(getSupabaseServerClient(), data))

export const fetchFavoritesFn = createServerFn({ method: 'GET' }).handler(async () =>
  listFavorites(getSupabaseServerClient()),
)
