import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getSharedCard } from '@/utils/share.server'
import { getSiteUrl } from '@/utils/site-url.server'

// Public loader surface for the share page (anon-callable; gated by the slug).
// Also returns the absolute base URL (server-derived) so the route's head() can
// build absolute og:image / og:url without touching request headers on the client.
export const fetchSharedCardFn = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string().trim().min(1).max(64) }))
  .handler(async ({ data }) => ({
    card: await getSharedCard(data.slug),
    baseUrl: getSiteUrl(),
  }))
