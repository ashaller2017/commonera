import { describe, expect, it } from 'vitest'
import type { QuizQuestion } from '@/lib/content/types'
import { rankTemplates, recommendTemplates, scoreQuiz } from './scoring'

const questions: readonly QuizQuestion[] = [
  {
    id: 'q1',
    kind: 'words',
    prompt: 'Pick two words',
    pickExactly: 2,
    options: [
      { id: 'q1-wild', label: 'Wild', emoji: '🌲', weights: { 'into-the-wild': 3 } },
      { id: 'q1-maker', label: 'Maker', emoji: '🎨', weights: { 'make-something-real': 3 } },
      { id: 'q1-kind', label: 'Kind', emoji: '✊', weights: { 'make-a-difference': 3 } },
      { id: 'q1-curious', label: 'Curious', emoji: '📖', weights: { 'mind-and-meaning': 3 } },
    ],
  },
  {
    id: 'q2',
    kind: 'single',
    prompt: 'Free Saturday?',
    options: [
      { id: 'q2-hike', label: 'Hiking', emoji: '🥾', weights: { 'into-the-wild': 2 } },
      {
        id: 'q2-family',
        label: 'Family dinner',
        emoji: '🕯️',
        weights: { 'roots-and-rituals': 2 },
      },
      {
        id: 'q2-mixed',
        label: 'Bit of everything',
        emoji: '✨',
        weights: { 'my-own-path': 2 },
      },
    ],
  },
]

describe('scoreQuiz', () => {
  it('sums option weights for picked answers', () => {
    const scores = scoreQuiz(
      questions,
      { q1: ['q1-wild', 'q1-maker'], q2: ['q2-hike'] },
      'cultural',
    )
    expect(scores['into-the-wild']).toBe(5)
    expect(scores['make-something-real']).toBe(3)
    expect(scores['make-a-difference']).toBe(0)
  })

  it('ignores answers for unknown questions and unknown option ids', () => {
    const scores = scoreQuiz(questions, { q1: ['nope'], ghost: ['q2-hike'] }, 'cultural')
    expect(Object.values(scores).every((score) => score <= 3)).toBe(true)
    expect(scores['into-the-wild']).toBe(0)
  })

  it('boosts roots-and-rituals when the family wants tradition', () => {
    const cultural = scoreQuiz(questions, { q2: ['q2-hike'] }, 'cultural')
    const traditional = scoreQuiz(questions, { q2: ['q2-hike'] }, 'traditional')
    expect(traditional['roots-and-rituals']).toBe(cultural['roots-and-rituals'] + 4)
  })

  it('applies no boost when the parent has not answered the observance question', () => {
    const unanswered = scoreQuiz(questions, { q2: ['q2-hike'] }, null)
    const cultural = scoreQuiz(questions, { q2: ['q2-hike'] }, 'cultural')
    expect(unanswered['roots-and-rituals']).toBe(cultural['roots-and-rituals'])
  })

  it('boosts my-own-path when no theme clearly wins', () => {
    const flat = scoreQuiz(questions, {}, 'cultural')
    expect(flat['my-own-path']).toBeGreaterThan(0)
  })

  it('does not boost my-own-path when one theme dominates', () => {
    const scores = scoreQuiz(
      questions,
      { q1: ['q1-wild', 'q1-maker'], q2: ['q2-hike'] },
      'cultural',
    )
    expect(scores['my-own-path']).toBe(0)
  })
})

describe('rankTemplates', () => {
  it('sorts by score and breaks ties in template order', () => {
    const ranked = rankTemplates({
      'into-the-wild': 2,
      'make-something-real': 5,
      'make-a-difference': 2,
      'mind-and-meaning': 0,
      'roots-and-rituals': 0,
      'my-own-path': 0,
    })
    expect(ranked.map((r) => r.key).slice(0, 3)).toEqual([
      'make-something-real',
      'into-the-wild',
      'make-a-difference',
    ])
  })
})

describe('recommendTemplates', () => {
  it('returns the top four with match percentages', () => {
    const top = recommendTemplates(questions, { q1: ['q1-wild', 'q1-curious'] }, 'curious')
    expect(top).toHaveLength(4)
    expect(top[0]?.key).toBe('into-the-wild')
    // 3 points of a possible 5 (q1 word worth 3, q2 hike worth 2).
    expect(top[0]?.percent).toBe(60)
  })

  it('scores a perfect run at 100%', () => {
    const top = recommendTemplates(
      questions,
      { q1: ['q1-wild', 'q1-maker'], q2: ['q2-hike'] },
      'cultural',
    )
    expect(top[0]?.key).toBe('into-the-wild')
    expect(top[0]?.percent).toBe(100)
  })

  it('keeps every percent between 0 and 100', () => {
    for (const match of recommendTemplates(questions, {}, 'traditional')) {
      expect(match.percent).toBeGreaterThanOrEqual(0)
      expect(match.percent).toBeLessThanOrEqual(100)
    }
  })
})
