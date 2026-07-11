import { createFileRoute } from '@tanstack/react-router'
import { renderShareCardPng } from '@/server/og/render'
import { getSharedCard } from '@/utils/share.server'

// Dynamic Open Graph image for a shared journey. Server route (no component),
// returns a 1200x630 PNG; the image/png Content-Type is authoritative for
// scrapers, so no file extension is needed. Gated by the unguessable slug.
export const Route = createFileRoute('/og/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const card = await getSharedCard(params.slug)
        if (!card) return new Response('Not found', { status: 404 })
        const png = await renderShareCardPng(card)
        return new Response(png as BodyInit, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          },
        })
      },
    },
  },
})
