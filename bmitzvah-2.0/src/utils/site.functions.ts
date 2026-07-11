import { createServerFn } from '@tanstack/react-start'
import { getSiteUrl } from '@/utils/site-url.server'

// Absolute origin for the site, used by the root route to build absolute
// og:image/twitter:image URLs (scrapers fetch these directly, so relative
// URLs won't resolve).
export const fetchSiteUrlFn = createServerFn({ method: 'GET' }).handler(async () => getSiteUrl())
