import { randomBytes } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ComfortKey, TemplateKey, TimelineKey } from '@/lib/content/types'
import { type QuizAnswers, scoreQuiz } from '@/lib/quiz/scoring'
import { err, ok, type Result } from '@/lib/result'
import type { Database } from '@/types/database'
import { getCurrentUser } from '@/utils/auth.server'
import { getQuizQuestions, getTemplateMilestones } from '@/utils/content.server'

type Supabase = SupabaseClient<Database>

export type MilestoneStatus = Database['public']['Enums']['milestone_status']

export type ActivityStatus = Database['public']['Enums']['activity_status']

export type MilestoneView = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly position: number
  readonly status: MilestoneStatus
}

export type ActivityView = {
  readonly id: string
  readonly promptId: string | null
  readonly title: string
  readonly description: string
  readonly status: ActivityStatus
}

export type CelebrationView = {
  readonly what: string
  readonly whoWith: string
  readonly whereAt: string
}

export type JourneyView = {
  readonly id: string
  readonly childId: string
  readonly template: TemplateKey
  readonly name: string
  readonly timeline: TimelineKey | null
  readonly comfort: ComfortKey | null
  readonly shareSlug: string | null
  readonly milestones: readonly MilestoneView[]
  readonly activities: readonly ActivityView[]
  readonly celebration: CelebrationView | null
}

// An unguessable, URL-safe id for the public share link (72 bits of entropy).
export function makeShareSlug(): string {
  return randomBytes(9).toString('base64url')
}

async function requireOwnJourneyId(supabase: Supabase): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('journeys')
    .select('id')
    .eq('child_id', user.id)
    .maybeSingle()
  return data?.id ?? null
}

export async function getJourneyView(
  supabase: Supabase,
  childId: string,
): Promise<JourneyView | null> {
  const { data: journey } = await supabase
    .from('journeys')
    .select('id, child_id, template, name, timeline, comfort_level, share_slug')
    .eq('child_id', childId)
    .maybeSingle()
  if (!journey) return null

  const [{ data: milestones }, { data: activities }, { data: celebration }] = await Promise.all([
    supabase
      .from('milestones')
      .select('id, title, description, position, status')
      .eq('journey_id', journey.id)
      .order('position'),
    supabase
      .from('journey_activities')
      .select('id, prompt_id, title, description, status')
      .eq('journey_id', journey.id)
      .order('created_at'),
    supabase
      .from('celebration_plans')
      .select('what, who_with, where_at')
      .eq('journey_id', journey.id)
      .maybeSingle(),
  ])

  return {
    id: journey.id,
    childId: journey.child_id,
    template: journey.template as TemplateKey,
    name: journey.name,
    timeline: (journey.timeline || null) as TimelineKey | null,
    comfort: (journey.comfort_level || null) as ComfortKey | null,
    shareSlug: journey.share_slug,
    milestones: (milestones ?? []).map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      position: m.position,
      status: m.status,
    })),
    activities: (activities ?? []).map((a) => ({
      id: a.id,
      promptId: a.prompt_id,
      title: a.title,
      description: a.description,
      status: a.status,
    })),
    celebration: celebration
      ? { what: celebration.what, whoWith: celebration.who_with, whereAt: celebration.where_at }
      : null,
  }
}

export type CreateJourneyInput = {
  readonly template: TemplateKey
  readonly name: string
  readonly timeline: TimelineKey
  readonly comfort: ComfortKey
  readonly answers: QuizAnswers
}

export type CreateJourneyError = 'not-signed-in' | 'already-has-journey' | 'create-failed'

export async function createJourney(
  supabase: Supabase,
  input: CreateJourneyInput,
): Promise<Result<JourneyView, CreateJourneyError>> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return err('not-signed-in')

  // A chosen path is permanent: one journey per kid, no switching. The
  // database enforces this too (unique child_id, no update/delete policies).
  const { data: existing } = await supabase
    .from('journeys')
    .select('id')
    .eq('child_id', user.id)
    .maybeSingle()
  if (existing) return err('already-has-journey')

  // Scores are recomputed here so the stored record reflects the real quiz,
  // not whatever the client claims. Questions (and their weights) come from the
  // database, the same source the client scored against.
  const questions = await getQuizQuestions(supabase)
  const scores = scoreQuiz(questions, input.answers, input.comfort)

  const { data: journey, error: insertError } = await supabase
    .from('journeys')
    .insert({
      child_id: user.id,
      template: input.template,
      name: input.name,
      timeline: input.timeline,
      comfort_level: input.comfort,
      quiz_answers: input.answers as Record<string, string[]>,
      quiz_scores: scores,
      share_slug: makeShareSlug(),
    })
    .select('id')
    .single()
  if (insertError || !journey) {
    console.error('createJourney: insert failed', insertError)
    return err('create-failed')
  }

  const templateMilestones = await getTemplateMilestones(supabase, input.template)
  const milestoneRows = templateMilestones.map((m, index) => ({
    journey_id: journey.id,
    title: m.title,
    description: m.description,
    position: index + 1,
  }))
  const { error: milestoneError } = await supabase.from('milestones').insert(milestoneRows)
  if (milestoneError) {
    console.error('createJourney: milestones insert failed', milestoneError)
    return err('create-failed')
  }

  const view = await getJourneyView(supabase, user.id)
  return view ? ok(view) : err('create-failed')
}

export type MutationError = 'not-found' | 'write-failed'

export async function setMilestoneStatus(
  supabase: Supabase,
  milestoneId: string,
  status: MilestoneStatus,
): Promise<Result<null, MutationError>> {
  const { data, error } = await supabase
    .from('milestones')
    .update({ status })
    .eq('id', milestoneId)
    .select('id')
  if (error) {
    console.error('setMilestoneStatus failed', error)
    return err('write-failed')
  }
  return data.length === 0 ? err('not-found') : ok(null)
}

export type AddActivityInput = {
  readonly promptId: string | null
  readonly title: string
  readonly description: string
}

export async function addActivity(
  supabase: Supabase,
  input: AddActivityInput,
): Promise<Result<ActivityView, MutationError>> {
  const journeyId = await requireOwnJourneyId(supabase)
  if (!journeyId) return err('not-found')

  const { data, error } = await supabase
    .from('journey_activities')
    .insert({
      journey_id: journeyId,
      prompt_id: input.promptId,
      title: input.title,
      description: input.description,
    })
    .select('id, prompt_id, title, description, status')
    .single()
  if (error || !data) {
    console.error('addActivity failed', error)
    return err('write-failed')
  }
  return ok({
    id: data.id,
    promptId: data.prompt_id,
    title: data.title,
    description: data.description,
    status: data.status,
  })
}

export async function setActivityStatus(
  supabase: Supabase,
  activityId: string,
  status: ActivityStatus,
): Promise<Result<null, MutationError>> {
  const { data, error } = await supabase
    .from('journey_activities')
    .update({ status })
    .eq('id', activityId)
    .select('id')
  if (error) {
    console.error('setActivityStatus failed', error)
    return err('write-failed')
  }
  return data.length === 0 ? err('not-found') : ok(null)
}

export async function removeActivity(
  supabase: Supabase,
  activityId: string,
): Promise<Result<null, MutationError>> {
  const { error } = await supabase.from('journey_activities').delete().eq('id', activityId)
  if (error) {
    console.error('removeActivity failed', error)
    return err('write-failed')
  }
  return ok(null)
}

export type CelebrationInput = CelebrationView

export async function upsertCelebration(
  supabase: Supabase,
  input: CelebrationInput,
): Promise<Result<null, MutationError>> {
  const journeyId = await requireOwnJourneyId(supabase)
  if (!journeyId) return err('not-found')

  const { error } = await supabase.from('celebration_plans').upsert({
    journey_id: journeyId,
    what: input.what,
    who_with: input.whoWith,
    where_at: input.whereAt,
    updated_at: new Date().toISOString(),
  })
  if (error) {
    console.error('upsertCelebration failed', error)
    return err('write-failed')
  }
  return ok(null)
}

export type KidSummary = {
  readonly id: string
  readonly displayName: string
  readonly username: string
  readonly journey: {
    readonly template: TemplateKey
    readonly name: string
    readonly milestonesDone: number
    readonly milestonesTotal: number
    readonly activitiesPlanned: number
    readonly activitiesDone: number
  } | null
}

export async function listKids(supabase: Supabase, parentId: string): Promise<KidSummary[]> {
  const { data: kids } = await supabase
    .from('profiles')
    .select('id, display_name, username')
    .eq('parent_id', parentId)
    .order('created_at')
  if (!kids || kids.length === 0) return []

  const summaries: KidSummary[] = []
  for (const kid of kids) {
    const view = await getJourneyView(supabase, kid.id)
    summaries.push({
      id: kid.id,
      displayName: kid.display_name,
      username: kid.username ?? '',
      journey: view
        ? {
            template: view.template,
            name: view.name,
            milestonesDone: view.milestones.filter((m) => m.status === 'done').length,
            milestonesTotal: view.milestones.length,
            activitiesPlanned: view.activities.filter((a) => a.status === 'planned').length,
            activitiesDone: view.activities.filter((a) => a.status === 'done').length,
          }
        : null,
    })
  }
  return summaries
}

// The guide directory is the reward at the end of the loop: it unlocks for a
// kid when every milestone of their journey is done, and for a parent when at
// least one of their kids has finished.
export type DirectoryAccess = {
  readonly unlocked: boolean
  readonly done: number
  readonly total: number
  readonly journeyName: string | null
  readonly kidName: string | null
}

const LOCKED_ACCESS: DirectoryAccess = {
  unlocked: false,
  done: 0,
  total: 0,
  journeyName: null,
  kidName: null,
}

const isComplete = (done: number, total: number) => total > 0 && done === total

export async function getDirectoryAccess(supabase: Supabase): Promise<DirectoryAccess> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return LOCKED_ACCESS

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile) return LOCKED_ACCESS

  if (profile.role === 'child') {
    const view = await getJourneyView(supabase, user.id)
    if (!view) return LOCKED_ACCESS
    const done = view.milestones.filter((m) => m.status === 'done').length
    const total = view.milestones.length
    return {
      unlocked: isComplete(done, total),
      done,
      total,
      journeyName: view.name,
      kidName: null,
    }
  }

  // Parent: unlocked by the furthest-along kid; progress shown is theirs.
  const kids = await listKids(supabase, user.id)
  let best: DirectoryAccess = LOCKED_ACCESS
  for (const kid of kids) {
    if (!kid.journey) continue
    const { milestonesDone: done, milestonesTotal: total } = kid.journey
    const candidate: DirectoryAccess = {
      unlocked: isComplete(done, total),
      done,
      total,
      journeyName: kid.journey.name,
      kidName: kid.displayName,
    }
    if (candidate.unlocked) return candidate
    const bestRatio = best.total === 0 ? -1 : best.done / best.total
    if (total > 0 && done / total > bestRatio) best = candidate
  }
  return best
}

export type ExpressInterestInput = {
  readonly providerKey: string
  readonly name: string
  readonly email: string
  readonly note: string
}

export type ExpressInterestError = 'not-signed-in' | 'not-parent' | 'locked' | 'write-failed'

export async function expressInterest(
  supabase: Supabase,
  input: ExpressInterestInput,
): Promise<Result<null, ExpressInterestError>> {
  const me = await getCurrentUser(supabase)
  if (!me) return err('not-signed-in')
  // The lead is the parent's to send, not the kid's: a kid only favorites. RLS
  // enforces this too (interest_insert_own requires is_parent()); checking here
  // turns that into a clean typed error instead of a write failure.
  if (me.role !== 'parent') return err('not-parent')

  // The directory gate is authorization, not decoration: re-check it here so a
  // locked user cannot submit interest by calling the function directly.
  const access = await getDirectoryAccess(supabase)
  if (!access.unlocked) return err('locked')

  const { error } = await supabase.from('provider_interest').insert({
    provider_key: input.providerKey,
    name: input.name,
    email: input.email,
    note: input.note,
    created_by: me.id,
  })
  if (error) {
    console.error('expressInterest failed', error)
    return err('write-failed')
  }
  return ok(null)
}

export type SetFavoriteInput = {
  readonly providerKey: string
  readonly favorited: boolean
}

export type SetFavoriteError = 'not-signed-in' | 'not-child' | 'locked' | 'write-failed'

// A kid's lightweight "I'm interested" on a guide. Favoriting is gated on a
// completed journey (the same reward gate as the lead), but UN-favoriting is
// always allowed: milestones can regress, and a kid must always be able to
// withdraw a signal they set. RLS scopes both writes to the kid's own rows.
export async function setFavorite(
  supabase: Supabase,
  input: SetFavoriteInput,
): Promise<Result<null, SetFavoriteError>> {
  const me = await getCurrentUser(supabase)
  if (!me) return err('not-signed-in')
  if (me.role !== 'child') return err('not-child')

  if (!input.favorited) {
    const { error } = await supabase
      .from('provider_favorite')
      .delete()
      .eq('child_id', me.id)
      .eq('provider_key', input.providerKey)
    if (error) {
      console.error('setFavorite (remove) failed', error)
      return err('write-failed')
    }
    return ok(null)
  }

  const access = await getDirectoryAccess(supabase)
  if (!access.unlocked) return err('locked')

  // Idempotent: re-tapping an already-favorited guide is a no-op, not an error.
  const { error } = await supabase
    .from('provider_favorite')
    .upsert({ child_id: me.id, provider_key: input.providerKey }, { ignoreDuplicates: true })
  if (error) {
    console.error('setFavorite (add) failed', error)
    return err('write-failed')
  }
  return ok(null)
}

export type ProviderFavorite = {
  readonly childId: string
  readonly providerKey: string
}

// Favorites visible to the caller: a kid sees their own, a parent sees all of
// their children's. RLS (favorite_select_own_or_parent) does the scoping, so
// this is one query for both roles.
export async function listFavorites(supabase: Supabase): Promise<readonly ProviderFavorite[]> {
  const { data, error } = await supabase
    .from('provider_favorite')
    .select('child_id, provider_key')
    .order('created_at')
  if (error || !data) return []
  return data.map((row) => ({ childId: row.child_id, providerKey: row.provider_key }))
}
