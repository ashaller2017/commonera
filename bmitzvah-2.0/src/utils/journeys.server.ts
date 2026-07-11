import { randomBytes } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ComfortKey, TemplateKey, TimelineKey } from '@/lib/content/types'
import { type QuizAnswers, scoreQuiz } from '@/lib/quiz/scoring'
import { err, ok, type Result } from '@/lib/result'
import type { Database } from '@/types/database'
import { getCurrentUser } from '@/utils/auth.server'
import { getChildSettings } from '@/utils/child-settings.server'
import { getQuizQuestions, getTemplateMilestones } from '@/utils/content.server'
import { sendChildFinishedEmail, sendChildMilestoneEmail } from '@/utils/email.server'

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
  // database, the same source the client scored against. Timeline and
  // observance are the parent's answers about this kid (child_settings),
  // snapshotted onto the journey at creation.
  const settings = await getChildSettings(supabase, user.id)
  const questions = await getQuizQuestions(supabase)
  const scores = scoreQuiz(questions, input.answers, settings.comfort)

  const { data: journey, error: insertError } = await supabase
    .from('journeys')
    .insert({
      child_id: user.id,
      template: input.template,
      name: input.name,
      timeline: settings.timeline ?? '',
      comfort_level: settings.comfort ?? '',
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
  // Prior status so we only email the parent on a genuine transition into "done", not on a
  // re-save of an already-done milestone.
  const { data: prior } = await supabase
    .from('milestones')
    .select('status')
    .eq('id', milestoneId)
    .maybeSingle()

  const { data, error } = await supabase
    .from('milestones')
    .update({ status })
    .eq('id', milestoneId)
    .select('id')
  if (error) {
    console.error('setMilestoneStatus failed', error)
    return err('write-failed')
  }
  if (data.length === 0) return err('not-found')

  if (status === 'done' && prior?.status !== 'done') {
    await notifyMilestoneDone(supabase, milestoneId)
  }
  return ok(null)
}

// Best-effort parent notification when a child marks a milestone done, with a bigger note when
// that completes the whole journey. Never throws: a failed email must not fail the kid's action.
// The parent's email is read via the parent_notification_email() SECURITY DEFINER RPC (the child
// has no direct access to auth.users), so no service role is involved.
async function notifyMilestoneDone(supabase: Supabase, milestoneId: string): Promise<void> {
  try {
    const { data: milestone } = await supabase
      .from('milestones')
      .select('title, journey_id')
      .eq('id', milestoneId)
      .maybeSingle()
    if (!milestone) return

    const { data: journey } = await supabase
      .from('journeys')
      .select('id, name, child_id')
      .eq('id', milestone.journey_id)
      .maybeSingle()
    if (!journey) return

    const [{ data: siblings }, { data: child }, { data: parentEmail }] = await Promise.all([
      supabase.from('milestones').select('status').eq('journey_id', journey.id),
      supabase.from('profiles').select('display_name').eq('id', journey.child_id).maybeSingle(),
      supabase.rpc('parent_notification_email'),
    ])
    if (!parentEmail) return

    const statuses = (siblings ?? []).map((m) => m.status)
    const total = statuses.length
    const done = statuses.filter((s) => s === 'done').length
    const childName = child?.display_name ?? 'Your kid'
    const shared = { childName, journeyName: journey.name, childId: journey.child_id }

    if (total > 0 && done === total) {
      await sendChildFinishedEmail(parentEmail, shared)
    } else {
      await sendChildMilestoneEmail(parentEmail, {
        ...shared,
        milestoneTitle: milestone.title,
        done,
        total,
      })
    }
  } catch (err) {
    console.error('notifyMilestoneDone failed', err)
  }
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
  // Whether the parent has saved the about-your-kid answers (timeline,
  // observance) — drives the dashboard nudge.
  readonly settingsAnswered: boolean
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

  const { data: settingsRows } = await supabase
    .from('child_settings')
    .select('child_id')
    .in(
      'child_id',
      kids.map((kid) => kid.id),
    )
  const answered = new Set((settingsRows ?? []).map((row) => row.child_id))

  const summaries: KidSummary[] = []
  for (const kid of kids) {
    const view = await getJourneyView(supabase, kid.id)
    summaries.push({
      id: kid.id,
      displayName: kid.display_name,
      username: kid.username ?? '',
      settingsAnswered: answered.has(kid.id),
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

export type ExpressInterestInput = {
  readonly providerKey: string
  readonly name: string
  readonly email: string
  readonly note: string
}

export type ExpressInterestError = 'not-signed-in' | 'not-parent' | 'write-failed'

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

export type SetFavoriteError = 'not-signed-in' | 'not-child' | 'write-failed'

// A kid's lightweight "I'm interested" on a guide, available from day one —
// guides are companions through the journey, not a finish-line reward. RLS
// scopes both writes to the kid's own rows.
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
