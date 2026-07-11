import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, HeadContent, Link, Scripts } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import appCss from '@/styles.css?url'
import { fetchUserFn } from '@/utils/auth.functions'
import { fetchTemplatesFn } from '@/utils/content.functions'
import { fetchSiteUrlFn } from '@/utils/site.functions'

const SITE_TITLE = "B'Mitzvah 2.0 · Your B'Mitzvah. Your way."
const SITE_DESCRIPTION =
  "Design your own B'Mitzvah journey: take the quiz, pick a path, build it milestone by milestone, and celebrate on your terms."

export const Route = createRootRoute({
  head: ({ loaderData }) => {
    const siteUrl = loaderData?.siteUrl ?? ''
    const ogImage = `${siteUrl}/og/default`
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: SITE_TITLE },
        { name: 'description', content: SITE_DESCRIPTION },
        { name: 'theme-color', content: '#007d6b' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: "B'Mitzvah 2.0" },
        { property: 'og:title', content: SITE_TITLE },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: siteUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SITE_TITLE },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    }
  },
  beforeLoad: async () => ({ user: await fetchUserFn() }),
  // The template catalog is static reference content; load it once and cache it
  // for the session. Consumers read it through useTemplates(). siteUrl backs
  // the absolute og:image/twitter:image URLs above.
  loader: async () => {
    const [templates, siteUrl] = await Promise.all([fetchTemplatesFn(), fetchSiteUrlFn()])
    return { templates, siteUrl }
  },
  staleTime: Number.POSITIVE_INFINITY,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl">🧭</p>
      <h1 className="font-display text-3xl font-semibold">This path doesn't exist</h1>
      <p className="text-muted-foreground">
        Whatever you were looking for, it's not here. Head back and pick up your journey.
      </p>
      <Link to="/" className="font-bold text-primary underline-offset-4 hover:underline">
        Back to the start
      </Link>
    </main>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system" storageKey="theme">
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
          </ThemeProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
