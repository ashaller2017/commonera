import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import {
  createActivityPrompt,
  createStory,
  deleteActivityPrompt,
  deleteProvider,
  deleteQuizQuestion,
  deleteStory,
  type ProviderInput,
  type QuizQuestionInput,
  replaceTemplateMilestones,
  saveProvider,
  saveQuizQuestion,
  updateActivityPrompt,
  updateChoiceOption,
  updateStory,
  updateTemplate,
} from '@/utils/admin-content.server'
import { getSupabaseServerClient } from '@/utils/supabase'

const templateKey = z.enum(TEMPLATE_KEYS)
const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]{1,64}$/, 'Use lowercase letters, numbers, and dashes.')
const text = z.string().trim().min(1)
const textList = z.array(z.string().trim().min(1)).max(24)

// --- Templates -----------------------------------------------------------

const UpdateTemplateSchema = z.object({
  key: templateKey,
  name: text.max(80),
  emoji: z.string().trim().min(1).max(8),
  tagline: text.max(160),
  description: text.max(1200),
  jewishLens: text.max(1200),
  themes: textList,
  celebrationIdeas: textList,
  gettingStarted: textList,
  providerTypes: textList,
})

export const updateTemplateFn = createServerFn({ method: 'POST' })
  .validator(UpdateTemplateSchema)
  .handler(async ({ data }) => {
    const { key, ...patch } = data
    return updateTemplate(getSupabaseServerClient(), key, patch)
  })

const ReplaceMilestonesSchema = z.object({
  template: templateKey,
  milestones: z
    .array(z.object({ title: text.max(120), description: z.string().trim().max(500) }))
    .max(12),
})

export const replaceTemplateMilestonesFn = createServerFn({ method: 'POST' })
  .validator(ReplaceMilestonesSchema)
  .handler(async ({ data }) =>
    replaceTemplateMilestones(getSupabaseServerClient(), data.template, data.milestones),
  )

// --- Activity prompts ----------------------------------------------------

const activityKind = z.enum(['do', 'create', 'learn', 'give'])
const PromptFields = {
  template: templateKey,
  kind: activityKind,
  title: text.max(120),
  description: z.string().trim().max(500),
}

export const createActivityPromptFn = createServerFn({ method: 'POST' })
  .validator(z.object({ id: slug, ...PromptFields }))
  .handler(async ({ data }) => {
    const { id, ...input } = data
    return createActivityPrompt(getSupabaseServerClient(), id, input)
  })

export const updateActivityPromptFn = createServerFn({ method: 'POST' })
  .validator(z.object({ id: slug, ...PromptFields }))
  .handler(async ({ data }) => {
    const { id, ...input } = data
    return updateActivityPrompt(getSupabaseServerClient(), id, input)
  })

export const deleteActivityPromptFn = createServerFn({ method: 'POST' })
  .validator(z.object({ id: slug }))
  .handler(async ({ data }) => deleteActivityPrompt(getSupabaseServerClient(), data.id))

// --- Providers -----------------------------------------------------------

const ProviderSchema = z.object({
  key: slug,
  name: text.max(120),
  tagline: text.max(200),
  overview: text.max(1500),
  approach: text.max(1000),
  format: z.enum(['in-person', 'virtual', 'hybrid']),
  location: text.max(120),
  priceRange: text.max(80),
  orgType: z.enum(['organization', 'independent']),
  verified: z.boolean(),
  templates: z.array(templateKey).min(1).max(6),
  testimonials: z.array(z.object({ quote: text.max(500), attribution: text.max(120) })).max(6),
})

export const saveProviderFn = createServerFn({ method: 'POST' })
  .validator(ProviderSchema)
  .handler(async ({ data }) => saveProvider(getSupabaseServerClient(), data as ProviderInput))

export const deleteProviderFn = createServerFn({ method: 'POST' })
  .validator(z.object({ key: slug }))
  .handler(async ({ data }) => deleteProvider(getSupabaseServerClient(), data.key))

// --- Quiz ----------------------------------------------------------------

const weights = z.record(templateKey, z.number().int().min(0).max(9))
const QuizQuestionSchema = z.object({
  id: slug,
  kind: z.enum(['single', 'words']),
  prompt: text.max(200),
  helper: z.string().trim().max(200).nullable(),
  pickExactly: z.number().int().min(1).max(6).nullable(),
  options: z
    .array(
      z.object({
        id: slug,
        label: text.max(160),
        emoji: z.string().trim().min(1).max(8),
        weights,
      }),
    )
    .min(2)
    .max(12),
})

export const saveQuizQuestionFn = createServerFn({ method: 'POST' })
  .validator(QuizQuestionSchema)
  .handler(async ({ data }) =>
    saveQuizQuestion(getSupabaseServerClient(), data as QuizQuestionInput),
  )

export const deleteQuizQuestionFn = createServerFn({ method: 'POST' })
  .validator(z.object({ id: slug }))
  .handler(async ({ data }) => deleteQuizQuestion(getSupabaseServerClient(), data.id))

// --- Setup options (label/helper only) -----------------------------------

export const updateChoiceOptionFn = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      table: z.enum(['timeline_options', 'comfort_options']),
      key: z.string().trim().min(1).max(40),
      label: text.max(120),
      helper: text.max(200),
    }),
  )
  .handler(async ({ data }) =>
    updateChoiceOption(getSupabaseServerClient(), data.table, data.key, {
      label: data.label,
      helper: data.helper,
    }),
  )

// --- Stories -------------------------------------------------------------

const StoryFields = {
  childName: text.max(80),
  age: z.number().int().min(9).max(14),
  template: templateKey,
  journeyName: text.max(120),
  story: text.max(2000),
  quote: text.max(400),
  celebration: text.max(2000),
}

export const createStoryFn = createServerFn({ method: 'POST' })
  .validator(z.object({ slug, ...StoryFields }))
  .handler(async ({ data }) => {
    const { slug: s, ...input } = data
    return createStory(getSupabaseServerClient(), s, input)
  })

export const updateStoryFn = createServerFn({ method: 'POST' })
  .validator(z.object({ slug, ...StoryFields }))
  .handler(async ({ data }) => {
    const { slug: s, ...input } = data
    return updateStory(getSupabaseServerClient(), s, input)
  })

export const deleteStoryFn = createServerFn({ method: 'POST' })
  .validator(z.object({ slug }))
  .handler(async ({ data }) => deleteStory(getSupabaseServerClient(), data.slug))
