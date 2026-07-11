import { describe, expect, it } from 'vitest'
import type { Provider, TemplateKey } from '@/lib/content/types'
import { matchProvider, splitByRecommendation } from './recommend'

const provider = (key: string, templates: readonly TemplateKey[]): Provider => ({
  key,
  name: key,
  tagline: '',
  overview: '',
  approach: '',
  format: 'virtual',
  location: '',
  priceRange: '',
  orgType: 'independent',
  templates,
  verified: false,
  testimonials: [],
})

const keys = (providers: readonly Provider[]) => providers.map((p) => p.key)

describe('matchProvider', () => {
  it('is primary when the template leads the provider list', () => {
    expect(matchProvider(provider('a', ['into-the-wild', 'my-own-path']), 'into-the-wild')).toBe(
      'primary',
    )
  })

  it('is secondary when the template is served but not first', () => {
    expect(matchProvider(provider('a', ['into-the-wild', 'my-own-path']), 'my-own-path')).toBe(
      'secondary',
    )
  })

  it('is none when the template is not served', () => {
    expect(matchProvider(provider('a', ['into-the-wild']), 'make-a-difference')).toBe('none')
  })
})

describe('splitByRecommendation', () => {
  const catalog = [
    provider('wild-primary', ['into-the-wild']),
    provider('maker', ['make-something-real']),
    provider('wild-secondary', ['my-own-path', 'into-the-wild']),
    provider('kind', ['make-a-difference']),
  ] as const

  it('recommends nothing when there are no templates', () => {
    const { recommended, rest } = splitByRecommendation(catalog, [])
    expect(recommended).toEqual([])
    expect(keys(rest)).toEqual(['wild-primary', 'maker', 'wild-secondary', 'kind'])
  })

  it('orders primary matches before secondary and keeps the rest out', () => {
    const { recommended, rest } = splitByRecommendation(catalog, ['into-the-wild'])
    expect(keys(recommended)).toEqual(['wild-primary', 'wild-secondary'])
    expect(keys(rest)).toEqual(['maker', 'kind'])
  })

  it('preserves catalog order within each tier', () => {
    const many = [
      provider('p2', ['into-the-wild']),
      provider('s1', ['my-own-path', 'into-the-wild']),
      provider('p1', ['into-the-wild']),
      provider('s2', ['mind-and-meaning', 'into-the-wild']),
    ] as const
    const { recommended } = splitByRecommendation(many, ['into-the-wild'])
    expect(keys(recommended)).toEqual(['p2', 'p1', 's1', 's2'])
  })

  it('unions matches across several templates (multiple kids)', () => {
    const { recommended, rest } = splitByRecommendation(catalog, [
      'into-the-wild',
      'make-a-difference',
    ])
    expect(keys(recommended)).toEqual(['wild-primary', 'kind', 'wild-secondary'])
    expect(keys(rest)).toEqual(['maker'])
  })
})
