import { createFileRoute } from '@tanstack/react-router'
import { renderDefaultCardPng } from '@/server/og/render'

// The site-wide default Open Graph image (homepage, any page without its own
// share card). Static content, so it caches far longer than the per-journey
// cards in og.$slug.ts.
export const Route = createFileRoute('/og/default')({
  server: {
    handlers: {
      GET: async () => {
        const png = await renderDefaultCardPng()
        return new Response(png as BodyInit, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, s-maxage=604800',
          },
        })
      },
    },
  },
})
