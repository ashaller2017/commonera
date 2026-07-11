import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { TemplateChip } from '@/components/template-chip'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/wordmark'
import { homePathForRole } from '@/lib/auth/home-path'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import { cn } from '@/lib/utils'
import { fetchStoriesFn } from '@/utils/content.functions'

export const Route = createFileRoute('/stories')({
  loader: async () => ({ stories: await fetchStoriesFn() }),
  component: StoriesPage,
})

function StoriesPage() {
  const { user } = Route.useRouteContext()
  const { stories } = Route.useLoaderData()
  const home = user ? homePathForRole(user.role) : '/signup'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <div className="flex items-center gap-2">
          {user ? (
            <Button render={<Link to={homePathForRole(user.role)} />}>Open my journey</Button>
          ) : (
            <>
              <Button variant="ghost" render={<Link to="/login" />}>
                Log in
              </Button>
              <Button render={<Link to="/signup" />}>Begin your journey</Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl"
          >
            Six kids. Six completely different B'Mitzvahs.
          </motion.h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            None of them did it the way you would, and that is exactly the point. Here is how six
            journeys actually came together, messy middles and all, so you can go build the one only
            you could.
          </p>
        </section>

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-4 pb-24 sm:gap-28 sm:px-6">
          {stories.map((story, index) => {
            const palette = TEMPLATE_PALETTE[story.template]
            const reversed = index % 2 === 1
            return (
              <article
                key={story.slug}
                className="grid items-start gap-6 lg:grid-cols-[5fr_4fr] lg:gap-12"
              >
                <div
                  className={cn('rounded-3xl p-8 sm:p-10', palette.soft, reversed && 'lg:order-2')}
                >
                  <TemplateChip template={story.template} variant="solid" />
                  <h2
                    className={cn(
                      'mt-6 font-display text-3xl font-semibold leading-tight sm:text-4xl',
                      palette.softText,
                    )}
                  >
                    {story.journeyName}
                  </h2>
                  <p className={cn('mt-2 text-sm font-bold opacity-80', palette.softText)}>
                    {story.childName}, {story.age}
                  </p>
                  <blockquote
                    className={cn(
                      'mt-7 font-display text-2xl font-medium leading-snug sm:text-3xl',
                      palette.softText,
                    )}
                  >
                    "{story.quote}"
                  </blockquote>
                </div>

                <div className="flex flex-col gap-5">
                  <p className="max-w-prose text-lg leading-relaxed text-pretty">{story.story}</p>
                  <div className="rounded-2xl bg-accent p-5 text-accent-foreground">
                    <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                      The celebration
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{story.celebration}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-12">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Your turn</h2>
            <p className="max-w-2xl text-primary-foreground/85">
              No two of these look alike, and yours will not either. Take the quiz, pick a shape,
              and start building a journey that could only be yours.
            </p>
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
              render={<Link to={home} />}
            >
              {user ? 'Open my journey' : 'Begin your journey'}
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-10">
        <div className="mx-auto w-full max-w-6xl px-4 text-sm text-muted-foreground sm:px-6">
          <p>
            These stories are illustrative composites written for this prototype, not real profiles.
          </p>
        </div>
      </footer>
    </div>
  )
}
