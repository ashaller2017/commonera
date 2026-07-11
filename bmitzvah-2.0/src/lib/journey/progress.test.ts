import { describe, expect, it } from 'vitest'
import { journeyProgress } from './progress'

describe('journeyProgress', () => {
  it('counts done milestones and rounds the percent', () => {
    expect(journeyProgress(['done', 'in_progress', 'todo'])).toEqual({
      done: 1,
      total: 3,
      percent: 33,
    })
  })

  it('handles the empty journey without dividing by zero', () => {
    expect(journeyProgress([])).toEqual({ done: 0, total: 0, percent: 0 })
  })

  it('reports 100 when everything is done', () => {
    expect(journeyProgress(['done', 'done'])).toEqual({ done: 2, total: 2, percent: 100 })
  })
})
