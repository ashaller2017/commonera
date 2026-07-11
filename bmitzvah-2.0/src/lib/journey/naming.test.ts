import { describe, expect, it } from 'vitest'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import { suggestJourneyNames } from './naming'

describe('suggestJourneyNames', () => {
  it('fills in the child name and picked words', () => {
    const names = suggestJourneyNames({
      template: 'into-the-wild',
      childName: 'Leo',
      words: ['brave', 'outdoorsy', 'loud'],
    })
    expect(names).toContain("Leo's Trail")
    expect(names).toContain('The Outdoorsy Expedition')
  })

  it('returns suggestions for every template even with no words picked', () => {
    for (const template of TEMPLATE_KEYS) {
      const names = suggestJourneyNames({ template, childName: 'Sam', words: [] })
      expect(names.length).toBeGreaterThanOrEqual(4)
      for (const name of names) {
        expect(name).not.toContain('{')
      }
    }
  })

  it('deduplicates suggestions', () => {
    const names = suggestJourneyNames({ template: 'my-own-path', childName: 'Sam', words: ['sam'] })
    expect(new Set(names).size).toBe(names.length)
  })
})
