import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, HeadContent, Link, Scripts } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import appCss from '@/styles.css?url'
import { fetchUserFn } from '@/utils/auth.functions'
import { fetchTemplatesFn } from '@/utils/content.functions'
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: "B'Mitzvah 2.0 · Your B'Mitzvah. Your way." },
      {
        name: 'description',
        content:
          "Design your own B'Mitzvah journey: take the quiz, pick a path, build it milestone by milestone, and celebrate on your terms.",
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  beforeLoad: async () => ({ user: await fetchUserFn() }),
  // The template catalog is static reference content; load it once and cache it
  // for the session. Consumers read it through useTemplates().
  loader: async () => ({ templates: await fetchTemplatesFn() }),
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
