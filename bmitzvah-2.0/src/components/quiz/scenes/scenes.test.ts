import { describe, expect, it } from 'vitest'
import { QUIZ_QUESTIONS } from '@/lib/content/quiz'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import { OPTION_SCENES, sceneEntryFor, TEMPLATE_SCENES } from './index'

// The quiz content is admin-editable; this test pins the DEFAULT content to
// the scene library so art and questions can't silently drift apart.

describe('scene registry', () => {
  it('has a hand-drawn scene for every default quiz option', () => {
    const missing = QUIZ_QUESTIONS.flatMap((question) =>
      question.options.filter((option) => !OPTION_SCENES[option.id]).map((option) => option.id),
    )
    expect(missing).toEqual([])
  })

  it('has a scene for every journey template', () => {
    for (const key of TEMPLATE_KEYS) {
      expect(TEMPLATE_SCENES[key]).toBeTypeOf('function')
    }
  })

  it('falls back to an emoji sticker for unknown option ids', () => {
    const entry = sceneEntryFor('admin-added-option', '🪁', 2)
    expect(entry.scene).toBeTypeOf('function')
    expect(entry.hue).toBe('diff')
  })

  it('keeps known entries stable regardless of the fallback index', () => {
    const a = sceneEntryFor('q2-outside', '🥾', 0)
    const b = sceneEntryFor('q2-outside', '🥾', 5)
    expect(a.scene).toBe(b.scene)
    expect(a.hue).toBe('wild')
  })
})
