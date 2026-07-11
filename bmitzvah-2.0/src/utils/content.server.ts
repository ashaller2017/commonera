import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  ActivityPrompt,
  ChoiceOption,
  ComfortKey,
  InspirationStory,
  JourneyTemplate,
  MilestoneTemplate,
  Provider,
  QuizQuestion,
  QuizWeights,
  TemplateKey,
  TimelineKey,
} from '@/lib/content/types'
import type { Database } from '@/types/database'

// Reads for the reference catalog. These project the seeded tables back into
// the exact content shapes the app already renders (src/lib/content/types), so
// consumers move from a static import to a loader without changing field access.
// The rows are public (anon + authenticated select), so these run on the
// RLS-scoped server client for both signed-in and logged-out visitors.

type Supabase = SupabaseClient<Database>

function fail(what: string, error: unknown): never {
  console.error(`content.server: failed to load ${what}`, error)
  throw new Error(`Failed to load ${what}`)
}

export async function getTemplates(supabase: Supabase): Promise<JourneyTemplate[]> {
  const { data, error } = await supabase
    .from('templates')
    .select(
      'key, name, emoji, tagline, description, jewish_lens, themes, celebration_ideas, getting_started, provider_types, template_milestones(title, description)',
    )
    .order('position')
    .order('position', { referencedTable: 'template_milestones' })
  if (error || !data) fail('templates', error)
  return data.map((t) => ({
    key: t.key as TemplateKey,
    name: t.name,
    emoji: t.emoji,
    tagline: t.tagline,
    description: t.description,
    themes: t.themes,
    jewishLens: t.jewish_lens,
    celebrationIdeas: t.celebration_ideas,
    gettingStarted: t.getting_started,
    providerTypes: t.provider_types,
    milestones: t.template_milestones.map(
      (m): MilestoneTemplate => ({ title: m.title, description: m.description }),
    ),
  }))
}

export async function getTemplateMilestones(
  supabase: Supabase,
  template: TemplateKey,
): Promise<MilestoneTemplate[]> {
  const { data, error } = await supabase
    .from('template_milestones')
    .select('title, description')
    .eq('template', template)
    .order('position')
  if (error || !data) fail('template milestones', error)
  return data.map((m) => ({ title: m.title, description: m.description }))
}

export async function getActivityPrompts(supabase: Supabase): Promise<ActivityPrompt[]> {
  const { data, error } = await supabase
    .from('activity_prompts')
    .select('id, template, kind, title, description')
    .order('position')
  if (error || !data) fail('activity prompts', error)
  return data.map((p) => ({
    id: p.id,
    template: p.template as TemplateKey,
    kind: p.kind,
    title: p.title,
    description: p.description,
  }))
}

export async function getProviders(supabase: Supabase): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select(
      'key, name, tagline, overview, approach, format, location, price_range, org_type, verified, provider_templates(template), provider_testimonials(quote, attribution)',
    )
    .order('position')
    .order('position', { referencedTable: 'provider_templates' })
    .order('position', { referencedTable: 'provider_testimonials' })
  if (error || !data) fail('providers', error)
  return data.map((p) => ({
    key: p.key,
    name: p.name,
    tagline: p.tagline,
    overview: p.overview,
    approach: p.approach,
    format: p.format,
    location: p.location,
    priceRange: p.price_range,
    orgType: p.org_type,
    templates: p.provider_templates.map((t) => t.template as TemplateKey),
    verified: p.verified,
    testimonials: p.provider_testimonials.map((t) => ({
      quote: t.quote,
      attribution: t.attribution,
    })),
  }))
}

export async function getStories(supabase: Supabase): Promise<InspirationStory[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('slug, child_name, age, template, journey_name, story, quote, celebration')
    .order('position')
  if (error || !data) fail('stories', error)
  return data.map((s) => ({
    slug: s.slug,
    childName: s.child_name,
    age: s.age,
    template: s.template as TemplateKey,
    journeyName: s.journey_name,
    story: s.story,
    quote: s.quote,
    celebration: s.celebration,
  }))
}

export async function getQuizQuestions(supabase: Supabase): Promise<QuizQuestion[]> {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, kind, prompt, helper, pick_exactly, quiz_options(id, label, emoji, weights)')
    .order('position')
    .order('position', { referencedTable: 'quiz_options' })
  if (error || !data) fail('quiz questions', error)
  return data.map((q): QuizQuestion => {
    const options = q.quiz_options.map((o) => ({
      id: o.id,
      label: o.label,
      emoji: o.emoji,
      weights: (o.weights ?? {}) as QuizWeights,
    }))
    const base = { id: q.id, prompt: q.prompt, helper: q.helper ?? undefined, options }
    return q.kind === 'words'
      ? { ...base, kind: 'words', pickExactly: q.pick_exactly ?? 1 }
      : { ...base, kind: 'single' }
  })
}

export async function getTimelineOptions(supabase: Supabase): Promise<ChoiceOption<TimelineKey>[]> {
  const { data, error } = await supabase
    .from('timeline_options')
    .select('key, label, helper')
    .order('position')
  if (error || !data) fail('timeline options', error)
  return data.map((o) => ({ key: o.key as TimelineKey, label: o.label, helper: o.helper }))
}

export async function getComfortOptions(supabase: Supabase): Promise<ChoiceOption<ComfortKey>[]> {
  const { data, error } = await supabase
    .from('comfort_options')
    .select('key, label, helper')
    .order('position')
  if (error || !data) fail('comfort options', error)
  return data.map((o) => ({ key: o.key as ComfortKey, label: o.label, helper: o.helper }))
}
