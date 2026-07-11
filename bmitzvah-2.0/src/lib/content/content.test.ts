import { describe, expect, it } from 'vitest'
import { ACTIVITY_PROMPTS } from './prompts'
import { PROVIDERS } from './providers'
import { COMFORT_OPTIONS, QUIZ_QUESTIONS, TIMELINE_OPTIONS } from './quiz'
import { STORIES } from './stories'
import { TEMPLATES } from './templates'
import { COMFORT_KEYS, TEMPLATE_KEYS, TIMELINE_KEYS } from './types'

const allOptions = QUIZ_QUESTIONS.flatMap((q) => q.options)

describe('TEMPLATES', () => {
  it('has one entry per template key, in order', () => {
    expect(TEMPLATES).toHaveLength(6)
    expect(TEMPLATES.map((t) => t.key)).toEqual([...TEMPLATE_KEYS])
  })

  it('gives every template exactly six milestones', () => {
    for (const template of TEMPLATES) {
      expect(template.milestones).toHaveLength(6)
    }
  })

  it('gives every template exactly two celebration ideas and three getting-started tips', () => {
    for (const template of TEMPLATES) {
      expect(template.celebrationIdeas).toHaveLength(2)
      expect(template.gettingStarted).toHaveLength(3)
    }
  })
})

describe('QUIZ_QUESTIONS', () => {
  it('has ten questions', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(10)
  })

  it('opens with a words question of twelve options picking exactly three', () => {
    const first = QUIZ_QUESTIONS[0]
    expect(first?.kind).toBe('words')
    if (first?.kind === 'words') {
      expect(first.pickExactly).toBe(3)
      expect(first.options).toHaveLength(12)
    }
  })

  it('follows the words question with single questions of four to six options', () => {
    for (const question of QUIZ_QUESTIONS.slice(1)) {
      expect(question.kind).toBe('single')
      expect(question.options.length).toBeGreaterThanOrEqual(4)
      expect(question.options.length).toBeLessThanOrEqual(6)
    }
  })

  it('uses a unique id for every option', () => {
    const ids = allOptions.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every option one to three weights, each valued one to three', () => {
    for (const option of allOptions) {
      const values = Object.values(option.weights)
      expect(values.length).toBeGreaterThanOrEqual(1)
      expect(values.length).toBeLessThanOrEqual(3)
      for (const value of values) {
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(3)
      }
    }
  })

  it('lets every template win by drawing weight from at least eight options', () => {
    for (const key of TEMPLATE_KEYS) {
      const count = allOptions.filter((o) => o.weights[key] !== undefined).length
      expect(count).toBeGreaterThanOrEqual(8)
    }
  })

  it('keeps my-own-path reachable from at least eight options', () => {
    const count = allOptions.filter((o) => o.weights['my-own-path'] !== undefined).length
    expect(count).toBeGreaterThanOrEqual(8)
  })
})

describe('ACTIVITY_PROMPTS', () => {
  it('has forty-eight prompts, eight per template', () => {
    expect(ACTIVITY_PROMPTS).toHaveLength(48)
    for (const key of TEMPLATE_KEYS) {
      expect(ACTIVITY_PROMPTS.filter((p) => p.template === key)).toHaveLength(8)
    }
  })

  it('uses a unique id for every prompt', () => {
    const ids = ACTIVITY_PROMPTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('PROVIDERS', () => {
  it('has six providers covering every template', () => {
    expect(PROVIDERS).toHaveLength(6)
    for (const key of TEMPLATE_KEYS) {
      expect(PROVIDERS.some((p) => p.templates.includes(key))).toBe(true)
    }
  })

  it('leaves exactly one provider unverified', () => {
    expect(PROVIDERS.filter((p) => !p.verified)).toHaveLength(1)
  })

  it('gives every provider exactly two testimonials', () => {
    for (const provider of PROVIDERS) {
      expect(provider.testimonials).toHaveLength(2)
    }
  })
})

describe('STORIES', () => {
  it('has one story per template with unique slugs', () => {
    expect(STORIES).toHaveLength(6)
    const slugs = STORIES.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const key of TEMPLATE_KEYS) {
      expect(STORIES.filter((s) => s.template === key)).toHaveLength(1)
    }
  })
})

describe('CHOICE_OPTIONS', () => {
  it('matches the timeline and comfort key arrays', () => {
    expect(TIMELINE_OPTIONS.map((o) => o.key)).toEqual([...TIMELINE_KEYS])
    expect(COMFORT_OPTIONS.map((o) => o.key)).toEqual([...COMFORT_KEYS])
  })
})
