import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Check, Handshake } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useState } from 'react'
import { TemplateChip } from '@/components/template-chip'
import { ThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/wordmark'
import { useTemplates } from '@/hooks/use-templates'
import { homePathForRole } from '@/lib/auth/home-path'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import { cn } from '@/lib/utils'
import { fetchProvidersFn, fetchStoriesFn } from '@/utils/content.functions'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [providers, stories] = await Promise.all([fetchProvidersFn(), fetchStoriesFn()])
    return { providers, stories }
  },
  component: LandingPage,
})

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

const HOW_IT_WORKS = [
  {
    title: 'Take the quiz',
    body: 'A 3-minute quiz about who you actually are, not who anyone expects you to be. No wrong answers, no studying.',
  },
  {
    title: 'Pick your path',
    body: 'Six journey shapes, a few matched to you. Choose one and make it yours, starting with what you name it.',
  },
  {
    title: 'Build it',
    body: 'Real milestones and activities, all picked by you. Your dashboard tracks the whole thing like a playlist, not a report card.',
  },
  {
    title: 'Celebrate',
    body: 'Every step points at one joyful, earned day that looks exactly like you, wherever you want it.',
  },
] as const

const HERO_DONE = 3

function LandingPage() {
  const { user } = Route.useRouteContext()
  const { providers, stories } = Route.useLoaderData()
  const templates = useTemplates()
  const [activePath, setActivePath] = useState(0)

  // The hero mockup is a live product preview built from real content: the
  // Into the Wild template's milestones under a real journey name from Stories.
  const heroTemplate = templates.find((t) => t.key === 'into-the-wild')
  const heroJourneyName =
    stories.find((s) => s.template === 'into-the-wild')?.journeyName ?? 'Into the Wild'

  // Two stories, told as testimony rather than a card grid. Contrasting colors
  // (forest green, candlelight amber) and contrasting journeys (an outdoor climb,
  // an interfaith table) so the pair reads as range, not repetition.
  const featuredStories = [
    stories.find((s) => s.slug === 'noa-long-way-up'),
    stories.find((s) => s.slug === 'maya-friday-table'),
  ].filter((s) => s !== undefined)

  const verifiedProviders = providers.filter((p) => p.verified)

  const cta = user
    ? { to: homePathForRole(user.role), label: 'Open my journey' }
    : { to: '/signup', label: 'Begin your journey' }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <div className="flex items-center gap-2">
          <ThemeToggle />
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
        {/* Hero: split layout. Oversized type with a drawn color underline on
            the left, a live journey-card mockup on the right. */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28 lg:pt-20">
          <div className="flex flex-col items-start">
            <motion.h1
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="font-display font-semibold leading-[0.98] tracking-[-0.03em] text-[clamp(2.75rem,8vw,6rem)]"
            >
              Your B'Mitzvah.
              <br />
              <span className="relative inline-block">
                Your way.
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
                  className="absolute inset-x-0 -bottom-1 -z-10 h-[0.16em] origin-left rounded-full bg-primary"
                />
              </span>
            </motion.h1>
            <motion.p
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
              className="mt-6 max-w-md text-lg text-muted-foreground"
            >
              You've been circling this for a while. Here's what nobody says out loud: there is no
              one right way to do it. Design a journey that's actually yours, then celebrate it with
              the people you love.
            </motion.p>
            <motion.div
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
              className="mt-8 flex flex-col items-start gap-3"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" render={<Link to={cta.to} />}>
                  {cta.label}
                  <ArrowRight aria-hidden />
                </Button>
                {user ? null : (
                  <Button size="lg" variant="ghost" render={<Link to="/stories" />}>
                    See how kids did it
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                No script. No signup sheet. No prior knowledge needed.
              </p>
            </motion.div>
          </div>

          {heroTemplate ? (
            <motion.div
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              className="w-full"
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="rounded-[1.75rem] border bg-card p-5 shadow-xl sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <TemplateChip template="into-the-wild" variant="solid" />
                  <span className="text-xs font-bold text-muted-foreground">
                    {HERO_DONE} of {heroTemplate.milestones.length} done
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
                  {heroJourneyName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your journey, tracked like a playlist.
                </p>
                <div
                  className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={HERO_DONE}
                  aria-valuemin={0}
                  aria-valuemax={heroTemplate.milestones.length}
                  aria-label="Milestones done"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '50%' }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
                    className="h-full rounded-full bg-wild"
                  />
                </div>
                <ul className="mt-5 flex flex-col gap-3">
                  {heroTemplate.milestones.map((milestone, index) => {
                    const status =
                      index < HERO_DONE ? 'done' : index === HERO_DONE ? 'active' : 'todo'
                    return (
                      <li key={milestone.title} className="flex items-center gap-3">
                        <span
                          className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded-full',
                            status === 'done' && 'bg-wild text-white',
                            status === 'active' && 'border-2 border-wild',
                            status === 'todo' && 'bg-muted',
                          )}
                        >
                          {status === 'done' ? <Check className="size-3" aria-hidden /> : null}
                        </span>
                        <span
                          className={cn(
                            'text-sm',
                            status === 'done' && 'font-semibold',
                            status === 'active' && 'font-bold text-wild-deep',
                            status === 'todo' && 'text-muted-foreground',
                          )}
                        >
                          {milestone.title}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            </motion.div>
          ) : null}
        </section>

        {/* Six paths: an interactive strip. One path expands, the rest compress
            to color-and-emoji spines. Only the open path shows body copy, so no
            paragraph is ever duplicated across tiles. */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="max-w-2xl"
          >
            <h2 className="font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Six shapes. One is about to be yours.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Templates are starting points, not scripts. Open one, bend it until it fits, then make
              it unmistakably yours.
            </p>
          </motion.div>

          {/* Desktop: horizontal accordion */}
          <div className="mt-10 hidden gap-3 md:flex md:h-[27rem]">
            <LayoutGroup>
              {templates.map((template, index) => {
                const palette = TEMPLATE_PALETTE[template.key]
                const isActive = index === activePath
                const firstMilestone = template.milestones[0]?.title
                return (
                  <motion.button
                    key={template.key}
                    type="button"
                    layout
                    onMouseEnter={() => setActivePath(index)}
                    onFocus={() => setActivePath(index)}
                    onClick={() => setActivePath(index)}
                    aria-expanded={isActive}
                    aria-label={template.name}
                    transition={{ duration: 0.55, ease: EASE }}
                    className={cn(
                      'relative flex flex-col overflow-hidden rounded-3xl p-6 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring',
                      palette.soft,
                      isActive ? 'flex-[2.6]' : 'flex-[0.7]',
                    )}
                  >
                    <motion.span layout="position" className="text-4xl" aria-hidden>
                      {template.emoji}
                    </motion.span>
                    <AnimatePresence mode="wait" initial={false}>
                      {isActive ? (
                        <motion.div
                          key="open"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className={cn('mt-4 flex max-w-md flex-col gap-3', palette.softText)}
                        >
                          <h3 className="font-display text-2xl font-semibold">{template.name}</h3>
                          <p className="text-sm font-bold">{template.tagline}</p>
                          <p className="text-sm/relaxed opacity-90">{template.description}</p>
                          <p className="mt-1 text-xs font-bold opacity-80">
                            {template.milestones.length} milestones · first move: {firstMilestone}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="closed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, ease: EASE }}
                          className={cn(
                            'mt-4 font-display text-base font-semibold [writing-mode:vertical-rl]',
                            palette.softText,
                          )}
                        >
                          {template.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </LayoutGroup>
          </div>

          {/* Mobile: stacked accordion */}
          <div className="mt-8 flex flex-col gap-2.5 md:hidden">
            {templates.map((template, index) => {
              const palette = TEMPLATE_PALETTE[template.key]
              const isActive = index === activePath
              const firstMilestone = template.milestones[0]?.title
              return (
                <div key={template.key} className={cn('overflow-hidden rounded-3xl', palette.soft)}>
                  <button
                    type="button"
                    onClick={() => setActivePath(isActive ? -1 : index)}
                    aria-expanded={isActive}
                    className={cn(
                      'flex w-full items-center gap-3 p-5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring',
                      palette.softText,
                    )}
                  >
                    <span className="text-2xl" aria-hidden>
                      {template.emoji}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-lg font-semibold">
                        {template.name}
                      </span>
                      <span className="block text-sm font-bold opacity-90">{template.tagline}</span>
                    </span>
                    <motion.span
                      animate={{ rotate: isActive ? 90 : 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      aria-hidden
                    >
                      <ArrowRight className="size-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isActive ? (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className={cn('px-5 pb-5', palette.softText)}>
                          <p className="text-sm opacity-90">{template.description}</p>
                          <p className="mt-3 text-xs font-bold opacity-80">
                            {template.milestones.length} milestones · first move: {firstMilestone}
                          </p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>

        {/* How it works: a connected path, not four identical columns. The
            heading holds the left, the earned steps run down a drawn spine. */}
        <section className="border-y bg-secondary/40">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-24">
            <motion.div
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: EASE }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <h2 className="font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                From here to a day that's yours
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Four moves. You earn each one, and the whole thing builds toward a celebration that
                looks like you.
              </p>
              <Button size="lg" className="mt-6" render={<Link to={cta.to} />}>
                {cta.label}
                <ArrowRight aria-hidden />
              </Button>
            </motion.div>

            <ol className="relative flex flex-col gap-8">
              <motion.span
                aria-hidden
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: EASE }}
                className="pointer-events-none absolute left-[1.1875rem] top-5 bottom-5 w-0.5 origin-top bg-border"
              />
              {HOW_IT_WORKS.map((step, index) => {
                const isLast = index === HOW_IT_WORKS.length - 1
                return (
                  <motion.li
                    key={step.title}
                    initial={{ y: 16 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
                    className="flex items-start gap-5"
                  >
                    <span
                      className={cn(
                        'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold',
                        isLast
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-primary text-primary-foreground',
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-display text-xl font-semibold sm:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-muted-foreground">{step.body}</p>
                    </div>
                  </motion.li>
                )
              })}
            </ol>
          </div>
        </section>

        {/* Stories as testimony: two big pull-quotes in template deep color,
            offset left and right, names small underneath. */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <h2 className="max-w-xl font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Kids who did it their way
            </h2>
            <Link
              to="/stories"
              className="inline-flex items-center gap-1.5 font-bold text-primary underline-offset-4 hover:underline"
            >
              Read all the stories
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </motion.div>

          <div className="mt-14 flex flex-col gap-16 lg:gap-24">
            {featuredStories.map((story, index) => {
              const palette = TEMPLATE_PALETTE[story.template]
              const alignRight = index % 2 === 1
              return (
                <motion.figure
                  key={story.slug}
                  initial={{ y: 24 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className={cn('max-w-3xl', alignRight && 'lg:ml-auto lg:items-end lg:text-right')}
                >
                  <div className={cn('flex', alignRight && 'lg:justify-end')}>
                    <TemplateChip template={story.template} variant="solid" />
                  </div>
                  <blockquote
                    className={cn(
                      'mt-6 font-display font-semibold leading-[1.08] tracking-[-0.02em] text-[clamp(1.9rem,4.5vw,3.5rem)]',
                      palette.softText,
                    )}
                  >
                    “{story.quote}”
                  </blockquote>
                  <figcaption className="mt-6">
                    <span className="font-display text-lg font-semibold">{story.journeyName}</span>
                    <span className="mt-0.5 block text-sm font-bold text-muted-foreground">
                      {story.childName}, age {story.age}
                    </span>
                  </figcaption>
                </motion.figure>
              )
            })}
          </div>
        </section>

        {/* Guides: companions through the journey, available from day one.
            Drenched primary panel, asymmetric, with the vetted names beside it. */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32">
          <motion.div
            initial={{ y: 24 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden rounded-[2rem] bg-primary text-primary-foreground"
          >
            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <div className="flex flex-col items-start gap-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
                  <Handshake className="size-3.5" aria-hidden />
                  With you from day one
                </span>
                <h2 className="font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                  Go it alone, or bring on a guide
                </h2>
                <p className="max-w-md text-lg text-primary-foreground/80">
                  Real outdoor educators, artists, mentors and tradition-keepers, each one vetted
                  before they ever meet your kid. A guide could be a rabbi — or the person who helps
                  build the Roblox part of a Roblox-themed B'Mitzvah. They keep the journey moving;
                  you decide if and when to bring one in.
                </p>
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                  render={
                    <Link
                      to={
                        user
                          ? user.role === 'admin'
                            ? '/admin'
                            : user.role === 'parent'
                              ? '/parent/guides'
                              : '/kid/guides'
                          : '/signup'
                      }
                    />
                  }
                >
                  {user ? 'Meet the guides' : 'Begin your journey'}
                  <ArrowRight aria-hidden />
                </Button>
              </div>

              <ul className="flex flex-col gap-2.5">
                {verifiedProviders.map((provider, index) => (
                  <motion.li
                    key={provider.key}
                    initial={{ y: 12 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.4, ease: EASE, delay: index * 0.06 }}
                    whileHover={{ y: -3 }}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-primary-foreground/10 px-4 py-3"
                  >
                    <span className="font-bold">{provider.name}</span>
                    <span className="text-xs font-bold text-primary-foreground/70">
                      {provider.location}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-sm text-muted-foreground sm:px-6">
          <p>
            A Common Era prototype. Guide profiles are simulated for this sprint; the vetting
            network is the real product.
          </p>
          <p>Built for families who want the milestone without the mold.</p>
        </div>
      </footer>
    </div>
  )
}
