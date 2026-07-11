import { useLoaderData } from '@tanstack/react-router'
import type { JourneyTemplate, TemplateKey } from '@/lib/content/types'

// The template catalog is loaded once in the root route and read anywhere via
// these hooks, so components never import the catalog data directly.

export function useTemplates(): readonly JourneyTemplate[] {
  return useLoaderData({ from: '__root__' }).templates
}

export function useTemplate(key: TemplateKey): JourneyTemplate | undefined {
  return useTemplates().find((t) => t.key === key)
}
