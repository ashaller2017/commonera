import { createFileRoute } from '@tanstack/react-router'

// A literal dot in the filename needs the [.]  escape: TanStack Router's
// file convention otherwise reads "." as a path separator (site.webmanifest.ts
// would resolve to /site/webmanifest, not /site.webmanifest). A route handler
// avoids relying on static /public serving for a file the router would
// otherwise intercept first.
const MANIFEST = {
  name: "B'Mitzvah 2.0",
  short_name: "B'Mitzvah 2.0",
  description:
    "Design your own B'Mitzvah journey: take the quiz, pick a path, build it milestone by milestone, and celebrate on your terms.",
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#007d6b',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}

export const Route = createFileRoute('/site.webmanifest')({
  server: {
    handlers: {
      GET: async () =>
        new Response(JSON.stringify(MANIFEST), {
          headers: {
            'Content-Type': 'application/manifest+json',
            'Cache-Control': 'public, max-age=86400',
          },
        }),
    },
  },
})
