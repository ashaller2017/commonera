import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActivityPrompt, ProviderFormat, QuizWeights, TemplateKey } from '@/lib/content/types'
import { err, ok, type Result } from '@/lib/result'
import type { Database } from '@/types/database'
import { currentAdmin } from '@/utils/admin.server'

// Content CRUD for the admin CMS. Writes run on the RLS-scoped cookie client;
// the *_admin_write policies (is_admin()) are the real boundary, and each
// function also app-checks for a clean error. Reads for the editors reuse the
// public content.functions.ts loaders. The DB is authoritative for content.

type Supabase = SupabaseClient<Database>

export type ContentError = 'not-admin' | 'write-failed' | 'conflict' | 'has-references'

const PG_UNIQUE_VIOLATION = '23505'
const PG_FK_VIOLATION = '23503'

// Append order for a table whose rows carry a `position` column.
async function nextPosition(
  supabase: Supabase,
  table: 'activity_prompts' | 'providers' | 'stories',
): Promise<number> {
  const { data } = await supabase
    .from(table)
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
  return (data?.[0]?.position ?? -1) + 1
}

// --- Templates (edit-only; the 6 are enum-fixed) -------------------------

export type TemplatePatch = {
  readonly name: string
  readonly emoji: string
  readonly tagline: string
  readonly description: string
  readonly jewishLens: string
  readonly themes: readonly string[]
  readonly celebrationIdeas: readonly string[]
  readonly gettingStarted: readonly string[]
  readonly providerTypes: readonly string[]
}

export async function updateTemplate(
  supabase: Supabase,
  key: TemplateKey,
  patch: TemplatePatch,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const { error } = await supabase
    .from('templates')
    .update({
      name: patch.name,
      emoji: patch.emoji,
      tagline: patch.tagline,
      description: patch.description,
      jewish_lens: patch.jewishLens,
      themes: [...patch.themes],
      celebration_ideas: [...patch.celebrationIdeas],
      getting_started: [...patch.gettingStarted],
      provider_types: [...patch.providerTypes],
    })
    .eq('key', key)
  if (error) {
    console.error('updateTemplate failed', error)
    return err('write-failed')
  }
  return ok(null)
}

// --- Template milestones (save the whole ordered list) -------------------

export type MilestoneInput = { readonly title: string; readonly description: string }

export async function replaceTemplateMilestones(
  supabase: Supabase,
  template: TemplateKey,
  milestones: readonly MilestoneInput[],
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const del = await supabase.from('template_milestones').delete().eq('template', template)
  if (del.error) {
    console.error('replaceTemplateMilestones delete failed', del.error)
    return err('write-failed')
  }
  const rows = milestones.map((m, i) => ({
    template,
    position: i,
    title: m.title,
    description: m.description,
  }))
  if (rows.length > 0) {
    const { error } = await supabase.from('template_milestones').insert(rows)
    if (error) {
      console.error('replaceTemplateMilestones insert failed', error)
      return err('write-failed')
    }
  }
  return ok(null)
}

// --- Activity prompts (full CRUD) ----------------------------------------

export type ActivityPromptInput = {
  readonly template: TemplateKey
  readonly kind: ActivityPrompt['kind']
  readonly title: string
  readonly description: string
}

export async function createActivityPrompt(
  supabase: Supabase,
  id: string,
  input: ActivityPromptInput,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const position = await nextPosition(supabase, 'activity_prompts')
  const { error } = await supabase.from('activity_prompts').insert({ id, position, ...input })
  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) return err('conflict')
    console.error('createActivityPrompt failed', error)
    return err('write-failed')
  }
  return ok(null)
}

export async function updateActivityPrompt(
  supabase: Supabase,
  id: string,
  input: ActivityPromptInput,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const { error } = await supabase.from('activity_prompts').update(input).eq('id', id)
  if (error) {
    console.error('updateActivityPrompt failed', error)
    return err('write-failed')
  }
  return ok(null)
}

export async function deleteActivityPrompt(
  supabase: Supabase,
  id: string,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const { error } = await supabase.from('activity_prompts').delete().eq('id', id)
  if (error) {
    console.error('deleteActivityPrompt failed', error)
    return err('write-failed')
  }
  return ok(null)
}

// --- Providers (upsert + nested testimonials + template links) -----------

export type TestimonialInput = { readonly quote: string; readonly attribution: string }
export type ProviderInput = {
  readonly key: string
  readonly name: string
  readonly tagline: string
  readonly overview: string
  readonly approach: string
  readonly format: ProviderFormat
  readonly location: string
  readonly priceRange: string
  readonly orgType: 'organization' | 'independent'
  readonly verified: boolean
  readonly templates: readonly TemplateKey[]
  readonly testimonials: readonly TestimonialInput[]
}

export async function saveProvider(
  supabase: Supabase,
  input: ProviderInput,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')

  const { data: existing } = await supabase
    .from('providers')
    .select('position')
    .eq('key', input.key)
    .maybeSingle()
  const position = existing?.position ?? (await nextPosition(supabase, 'providers'))

  const up = await supabase.from('providers').upsert({
    key: input.key,
    name: input.name,
    tagline: input.tagline,
    overview: input.overview,
    approach: input.approach,
    format: input.format,
    location: input.location,
    price_range: input.priceRange,
    org_type: input.orgType,
    verified: input.verified,
    position,
  })
  if (up.error) {
    console.error('saveProvider upsert failed', up.error)
    return err('write-failed')
  }

  // Replace the child sets (small; a mid-op failure just needs a re-save).
  await supabase.from('provider_testimonials').delete().eq('provider_key', input.key)
  if (input.testimonials.length > 0) {
    const { error } = await supabase.from('provider_testimonials').insert(
      input.testimonials.map((t, i) => ({
        provider_key: input.key,
        position: i,
        quote: t.quote,
        attribution: t.attribution,
      })),
    )
    if (error) {
      console.error('saveProvider testimonials failed', error)
      return err('write-failed')
    }
  }

  await supabase.from('provider_templates').delete().eq('provider_key', input.key)
  if (input.templates.length > 0) {
    const { error } = await supabase.from('provider_templates').insert(
      input.templates.map((template, i) => ({
        provider_key: input.key,
        template,
        position: i,
      })),
    )
    if (error) {
      console.error('saveProvider templates failed', error)
      return err('write-failed')
    }
  }
  return ok(null)
}

export async function deleteProvider(
  supabase: Supabase,
  key: string,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const { error } = await supabase.from('providers').delete().eq('key', key)
  if (error) {
    // provider_interest references providers(key); a lead blocks deletion.
    if (error.code === PG_FK_VIOLATION) return err('has-references')
    console.error('deleteProvider failed', error)
    return err('write-failed')
  }
  return ok(null)
}

// --- Quiz (question + its options) ---------------------------------------

export type QuizOptionInput = {
  readonly id: string
  readonly label: string
  readonly emoji: string
  readonly weights: QuizWeights
}
export type QuizQuestionInput = {
  readonly id: string
  readonly kind: 'single' | 'words'
  readonly prompt: string
  readonly helper: string | null
  readonly pickExactly: number | null
  readonly options: readonly QuizOptionInput[]
}

export async function saveQuizQuestion(
  supabase: Supabase,
  input: QuizQuestionInput,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')

  const { data: existing } = await supabase
    .from('quiz_questions')
    .select('position')
    .eq('id', input.id)
    .maybeSingle()
  const position =
    existing?.position ??
    (await (async () => {
      const { data } = await supabase
        .from('quiz_questions')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)
      return (data?.[0]?.position ?? -1) + 1
    })())

  const up = await supabase.from('quiz_questions').upsert({
    id: input.id,
    kind: input.kind,
    prompt: input.prompt,
    helper: input.helper,
    // The words_have_pick_exactly check: words => set, single => null.
    pick_exactly: input.kind === 'words' ? (input.pickExactly ?? 1) : null,
    position,
  })
  if (up.error) {
    console.error('saveQuizQuestion upsert failed', up.error)
    return err('write-failed')
  }

  await supabase.from('quiz_options').delete().eq('question_id', input.id)
  if (input.options.length > 0) {
    const { error } = await supabase.from('quiz_options').insert(
      input.options.map((o, i) => ({
        id: o.id,
        question_id: input.id,
        label: o.label,
        emoji: o.emoji,
        weights: o.weights,
        position: i,
      })),
    )
    if (error) {
      if (error.code === PG_UNIQUE_VIOLATION) return err('conflict')
      console.error('saveQuizQuestion options failed', error)
      return err('write-failed')
    }
  }
  return ok(null)
}

export async function deleteQuizQuestion(
  supabase: Supabase,
  id: string,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const { error } = await supabase.from('quiz_questions').delete().eq('id', id)
  if (error) {
    console.error('deleteQuizQuestion failed', error)
    return err('write-failed')
  }
  return ok(null)
}

// --- Setup options (edit label/helper only; keys are scoring-coupled) -----

export async function updateChoiceOption(
  supabase: Supabase,
  table: 'timeline_options' | 'comfort_options',
  key: string,
  input: { readonly label: string; readonly helper: string },
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const { error } = await supabase.from(table).update(input).eq('key', key)
  if (error) {
    console.error('updateChoiceOption failed', error)
    return err('write-failed')
  }
  return ok(null)
}

// --- Stories (full CRUD) -------------------------------------------------

export type StoryInput = {
  readonly childName: string
  readonly age: number
  readonly template: TemplateKey
  readonly journeyName: string
  readonly story: string
  readonly quote: string
  readonly celebration: string
}

function storyRow(input: StoryInput) {
  return {
    child_name: input.childName,
    age: input.age,
    template: input.template,
    journey_name: input.journeyName,
    story: input.story,
    quote: input.quote,
    celebration: input.celebration,
  }
}

export async function createStory(
  supabase: Supabase,
  slug: string,
  input: StoryInput,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const position = await nextPosition(supabase, 'stories')
  const { error } = await supabase.from('stories').insert({ slug, position, ...storyRow(input) })
  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) return err('conflict')
    console.error('createStory failed', error)
    return err('write-failed')
  }
  return ok(null)
}

export async function updateStory(
  supabase: Supabase,
  slug: string,
  input: StoryInput,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const { error } = await supabase.from('stories').update(storyRow(input)).eq('slug', slug)
  if (error) {
    console.error('updateStory failed', error)
    return err('write-failed')
  }
  return ok(null)
}

export async function deleteStory(
  supabase: Supabase,
  slug: string,
): Promise<Result<null, ContentError>> {
  if (!(await currentAdmin(supabase))) return err('not-admin')
  const { error } = await supabase.from('stories').delete().eq('slug', slug)
  if (error) {
    console.error('deleteStory failed', error)
    return err('write-failed')
  }
  return ok(null)
}
