import type { Provider, TemplateKey } from '@/lib/content/types'

// How well a guide fits a journey path. A provider serves a set of templates;
// the first (templates[0]) is its headline path. 'primary' means the guide
// leads with this path, 'secondary' means it also serves it, 'none' means it
// does not. Pure: derived only from provider.templates and the target template.
export type ProviderMatch = 'primary' | 'secondary' | 'none'

export function matchProvider(provider: Provider, template: TemplateKey): ProviderMatch {
  if (provider.templates[0] === template) return 'primary'
  return provider.templates.includes(template) ? 'secondary' : 'none'
}

// A guide's best fit across any of the given paths (a parent may have several
// kids on different paths). Primary anywhere wins over secondary.
function bestMatch(provider: Provider, templates: readonly TemplateKey[]): ProviderMatch {
  let best: ProviderMatch = 'none'
  for (const template of templates) {
    const match = matchProvider(provider, template)
    if (match === 'primary') return 'primary'
    if (match === 'secondary') best = 'secondary'
  }
  return best
}

export type RecommendationSplit = {
  readonly recommended: readonly Provider[]
  readonly rest: readonly Provider[]
}

// Split the catalog into guides recommended for these paths and the rest.
// Recommended come out primary-first then secondary; catalog order is preserved
// within each tier and within the rest. No paths (a kid with no journey yet)
// means nothing is recommended and everything falls to 'rest'.
export function splitByRecommendation(
  providers: readonly Provider[],
  templates: readonly TemplateKey[],
): RecommendationSplit {
  if (templates.length === 0) return { recommended: [], rest: providers }
  const primary: Provider[] = []
  const secondary: Provider[] = []
  const rest: Provider[] = []
  for (const provider of providers) {
    const match = bestMatch(provider, templates)
    if (match === 'primary') primary.push(provider)
    else if (match === 'secondary') secondary.push(provider)
    else rest.push(provider)
  }
  return { recommended: [...primary, ...secondary], rest }
}
