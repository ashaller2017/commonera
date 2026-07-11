export const TEMPLATE_KEYS = [
  'into-the-wild',
  'make-something-real',
  'make-a-difference',
  'mind-and-meaning',
  'roots-and-rituals',
  'my-own-path',
] as const

export type TemplateKey = (typeof TEMPLATE_KEYS)[number]

export type MilestoneTemplate = {
  readonly title: string
  readonly description: string
}

export type JourneyTemplate = {
  readonly key: TemplateKey
  readonly name: string
  readonly emoji: string
  readonly tagline: string
  readonly description: string
  readonly themes: readonly string[]
  readonly jewishLens: string
  readonly celebrationIdeas: readonly string[]
  readonly gettingStarted: readonly string[]
  readonly providerTypes: readonly string[]
  readonly milestones: readonly MilestoneTemplate[]
}

export type QuizWeights = Readonly<Partial<Record<TemplateKey, number>>>

export type QuizOption = {
  readonly id: string
  readonly label: string
  readonly emoji: string
  readonly weights: QuizWeights
}

export type QuizQuestion =
  | {
      readonly id: string
      readonly kind: 'single'
      readonly prompt: string
      readonly helper?: string
      readonly options: readonly QuizOption[]
    }
  | {
      readonly id: string
      readonly kind: 'words'
      readonly prompt: string
      readonly helper?: string
      readonly pickExactly: number
      readonly options: readonly QuizOption[]
    }

export const TIMELINE_KEYS = [
  'under-6-months',
  'about-a-year',
  'more-than-a-year',
  'just-exploring',
] as const

export type TimelineKey = (typeof TIMELINE_KEYS)[number]

export const COMFORT_KEYS = ['cultural', 'curious', 'traditional'] as const

export type ComfortKey = (typeof COMFORT_KEYS)[number]

export type ChoiceOption<K extends string> = {
  readonly key: K
  readonly label: string
  readonly helper: string
}

export type ActivityPrompt = {
  readonly id: string
  readonly template: TemplateKey
  readonly kind: 'do' | 'create' | 'learn' | 'give'
  readonly title: string
  readonly description: string
}

export type ProviderFormat = 'in-person' | 'virtual' | 'hybrid'

export type ProviderTestimonial = {
  readonly quote: string
  readonly attribution: string
}

export type Provider = {
  readonly key: string
  readonly name: string
  readonly tagline: string
  readonly overview: string
  readonly approach: string
  readonly format: ProviderFormat
  readonly location: string
  readonly priceRange: string
  readonly orgType: 'organization' | 'independent'
  readonly templates: readonly TemplateKey[]
  readonly verified: boolean
  readonly testimonials: readonly ProviderTestimonial[]
}

export type InspirationStory = {
  readonly slug: string
  readonly childName: string
  readonly age: number
  readonly template: TemplateKey
  readonly journeyName: string
  readonly story: string
  readonly quote: string
  readonly celebration: string
}
