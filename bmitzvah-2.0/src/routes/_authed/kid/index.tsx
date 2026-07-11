import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowRight,
  Check,
  Circle,
  Handshake,
  Heart,
  PartyPopper,
  Search,
  Share2,
  Trash2,
} from 'lucide-react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useId, useState } from 'react'
import {
  type ActivityKind,
  KindArt,
  kindLabel,
  ProgressRing,
  StatusPill,
  StickerNote,
  ThemeTicker,
} from '@/components/journey/pathway-bits'
import { PhotoSnap } from '@/components/photo-snap'
import { HUE_CLASSES, type Hue, TEMPLATE_HUE } from '@/components/quiz/scene-kit'
import { templateScene } from '@/components/quiz/scenes'
import { TemplateChip } from '@/components/template-chip'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useTemplate } from '@/hooks/use-templates'
import { TEMPLATE_PALETTE, type TemplatePalette } from '@/lib/content/palette'
import type { ActivityPrompt, Provider } from '@/lib/content/types'
import { journeyProgress } from '@/lib/journey/progress'
import { cn } from '@/lib/utils'
import {
  fetchActivityPromptsFn,
  fetchProvidersFn,
  fetchTimelineOptionsFn,
} from '@/utils/content.functions'
import {
  addActivityFn,
  fetchFavoritesFn,
  fetchOwnJourneyFn,
  removeActivityFn,
  setActivityStatusFn,
  setMilestoneStatusFn,
} from '@/utils/journeys.functions'
import type { JourneyView, MilestoneStatus } from '@/utils/journeys.server'

export const Route = createFileRoute('/_authed/kid/')({
  loader: async () => {
    const [journey, prompts, timeline, providers, favorites] = await Promise.all([
      fetchOwnJourneyFn(),
      fetchActivityPromptsFn(),
      fetchTimelineOptionsFn(),
      fetchProvidersFn(),
      fetchFavoritesFn(),
    ])
    return { journey, prompts, timeline, providers, favorites }
  },
  component: KidDashboard,
})

// Ease-out-quart, the house curve. Motion respects reduced-motion globally via
// MotionConfig reducedMotion="user" in __root, so movement collapses to a
// crossfade for users who ask for it; no per-animation guard needed here.
const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

// Page-load orchestration: sections cascade in on mount.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
}

function KidDashboard() {
  const { journey } = Route.useLoaderData()
  if (!journey) return <EmptyDashboard />
  return <JourneyDashboard journey={journey} />
}

function EmptyDashboard() {
  const { user } = Route.useRouteContext()
  const firstName = user.displayName.split(' ')[0] ?? user.displayName
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="mx-auto flex max-w-xl flex-col items-center gap-6 py-20 text-center"
    >
      <div className="flex items-end justify-center gap-3">
        <PhotoSnap
          src="/photos/party-lift.jpg"
          alt="A kid lifted on a chair, arms up, mid-celebration"
          tilt={-4}
          className="h-32 w-24"
        />
        <PhotoSnap
          src="/photos/kids-gardening.jpg"
          alt="Two kids planting together on a service project"
          tilt={4}
          delay={0.08}
          className="h-28 w-24"
        />
      </div>
      <h1 className="font-display text-4xl font-semibold">{firstName}, your journey starts here</h1>
      <p className="text-muted-foreground">
        Take a 3-minute quiz and it figures out what kind of B'Mitzvah journey actually fits you. No
        wrong answers, and you get to name the whole thing at the end.
      </p>
      <Button size="lg" render={<Link to="/kid/quiz" />}>
        Take the quiz
      </Button>
      <p className="text-sm text-muted-foreground">
        Curious who could help along the way?{' '}
        <Link to="/kid/guides" className="font-bold text-foreground underline underline-offset-4">
          Meet the guides
        </Link>{' '}
        whenever you want.
      </p>
    </motion.section>
  )
}

function JourneyDashboard({ journey }: { journey: JourneyView }) {
  const { timeline } = Route.useLoaderData()
  const template = useTemplate(journey.template)
  const palette = TEMPLATE_PALETTE[journey.template]
  const hue = TEMPLATE_HUE[journey.template]
  const { scene: PathArt } = templateScene(journey.template)
  const progress = journeyProgress(journey.milestones.map((m) => m.status))
  const timelineLabel = timeline.find((t) => t.key === journey.timeline)?.label
  const allDone = progress.total > 0 && progress.done === progress.total

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.header variants={item} className="flex flex-col gap-3">
        {/* The tested "Nature Pathway" arch card: journey identity drenched in
            its own hue, patch art on the left, progress ring on the right. */}
        <div
          className={cn(
            'grid gap-5 rounded-t-[3.5rem] rounded-b-3xl p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-8',
            palette.soft,
          )}
        >
          <PathArt className="mx-auto size-28 sm:mx-0" />
          <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <h1
              className={cn(
                'font-display-wonk text-3xl font-semibold sm:text-4xl',
                palette.softText,
              )}
            >
              {journey.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <TemplateChip template={journey.template} variant="solid" />
              {timelineLabel ? (
                <span
                  className={cn(
                    'rounded-full border-2 border-current px-3 py-1 font-bold text-xs uppercase tracking-wide',
                    palette.softText,
                  )}
                >
                  {timelineLabel}
                </span>
              ) : null}
            </div>
            {template ? (
              <p className={cn('max-w-md text-sm opacity-90', palette.softText)}>
                {template.tagline}
              </p>
            ) : null}
          </div>
          <div className="relative mx-auto sm:mx-0">
            <ProgressRing
              done={progress.done}
              total={progress.total}
              hue={hue}
              className="size-28"
            />
            {progress.done < progress.total ? (
              <StickerNote className="-right-6 -bottom-2 absolute">
                {progress.done === 0
                  ? "Let's go!"
                  : progress.done === progress.total - 1
                    ? 'So close!'
                    : 'Keep it up!'}
              </StickerNote>
            ) : null}
          </div>
          <StageStepper milestones={journey.milestones} palette={palette} />
          {template && template.themes.length > 0 ? (
            <ThemeTicker
              items={[...template.themes, `trending on ${template.name}`]}
              className={cn(
                'font-bold text-[10px] uppercase tracking-[0.25em] opacity-60 sm:col-span-3',
                palette.softText,
              )}
            />
          ) : null}
        </div>
        {/* The mockups' big share moment: journeys are for showing people. */}
        <Button variant="outline" size="lg" className="w-full" render={<Link to="/kid/card" />}>
          <Share2 aria-hidden />
          Share with a grown up
        </Button>
      </motion.header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-8">
        <MilestoneMap journey={journey} palette={palette} hue={hue} allDone={allDone} />
        <div className="flex flex-col gap-6">
          <ActivityList journey={journey} hue={hue} palette={palette} />
          <SuggestionBank journey={journey} palette={palette} />
          <YourGuidesCard />
          <InspirationCard />
        </div>
      </div>
    </motion.div>
  )
}

const NEXT_STATUS: Record<MilestoneStatus, { label: string; next: MilestoneStatus }> = {
  todo: { label: 'Start', next: 'in_progress' },
  in_progress: { label: 'Mark it done', next: 'done' },
  done: { label: 'Undo', next: 'in_progress' },
}

// Stage vocabulary from the tested tracker's DISCOVER / PLAN / GROW / REFLECT
// stepper, mapped onto milestone order: the first is discovery, the last is
// the celebration, and the middle splits into planning and growing.
function stageFor(index: number, total: number): string {
  if (index === total - 1) return 'Celebrate'
  if (index === 0) return 'Discover'
  return index < Math.ceil((total - 1) / 2) ? 'Plan' : 'Grow'
}

const STAGE_SEQUENCE = ['Discover', 'Plan', 'Grow', 'Celebrate'] as const

// The tested tracker's DISCOVER / PLAN / GROW chip row, sitting in the arch
// card so the kid always knows which chapter they're in. The current stage is
// the one holding the first unfinished milestone.
function StageStepper({
  milestones,
  palette,
}: {
  milestones: JourneyView['milestones']
  palette: TemplatePalette
}) {
  const firstOpen = milestones.findIndex((m) => m.status !== 'done')
  const current = firstOpen === -1 ? 'Celebrate' : stageFor(firstOpen, milestones.length)
  return (
    <ol
      className="flex flex-wrap items-center justify-center gap-2 sm:col-span-3 sm:justify-start"
      aria-label={`Journey stage: ${current}`}
    >
      {STAGE_SEQUENCE.map((stage, index) => (
        <li key={stage} className="flex items-center gap-2">
          {index > 0 ? (
            <span
              className={cn('size-1 rounded-full bg-current opacity-40', palette.softText)}
              aria-hidden
            />
          ) : null}
          <span
            className={cn(
              'rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wide',
              stage === current ? palette.solid : cn('opacity-50', palette.softText),
            )}
            aria-current={stage === current ? 'step' : undefined}
          >
            {stage}
          </span>
        </li>
      ))}
    </ol>
  )
}

function MilestoneMap({
  journey,
  palette,
  hue,
  allDone,
}: {
  journey: JourneyView
  palette: TemplatePalette
  hue: Hue
  allDone: boolean
}) {
  const router = useRouter()
  const [justFinished, setJustFinished] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (input: { milestoneId: string; status: MilestoneStatus }) =>
      setMilestoneStatusFn({ data: input }),
    onSuccess: async (result, input) => {
      if (result.ok) {
        setJustFinished(input.status === 'done' ? input.milestoneId : null)
        await router.invalidate()
      }
    },
  })

  return (
    <motion.section variants={item} className="flex flex-col gap-5">
      <h2 className="font-display text-2xl font-semibold">Milestone map</h2>
      {allDone ? <CompletionBanner palette={palette} /> : null}
      <ol className="flex flex-col">
        {journey.milestones.map((milestone, index) => {
          const action = NEXT_STATUS[milestone.status]
          const isLast = index === journey.milestones.length - 1
          const isFinal = isLast
          const done = milestone.status === 'done'
          return (
            <li key={milestone.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.span
                  aria-hidden
                  animate={justFinished === milestone.id ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full',
                    isFinal
                      ? done
                        ? 'bg-accent text-accent-foreground'
                        : 'border-2 border-accent-deep bg-background text-accent-deep'
                      : done
                        ? cn(palette.dot, 'text-white')
                        : milestone.status === 'in_progress'
                          ? cn(palette.softText, 'border-2 border-current bg-background')
                          : 'border-2 border-border bg-background text-muted-foreground',
                  )}
                >
                  {isFinal ? (
                    <PartyPopper className="size-4" />
                  ) : done ? (
                    <Check className="size-4" />
                  ) : (
                    <Circle className="size-2.5" fill="currentColor" />
                  )}
                </motion.span>
                {isLast ? null : (
                  <div className="relative w-0.5 flex-1 overflow-hidden rounded-full bg-border">
                    <motion.div
                      className={cn(
                        'absolute inset-x-0 top-0 h-full origin-top rounded-full',
                        palette.bar,
                      )}
                      initial={false}
                      animate={{ scaleY: done ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  </div>
                )}
              </div>
              <div className={cn('flex flex-1 flex-col gap-1 pb-8', isLast && 'pb-0')}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={cn(
                        'font-bold text-[10px] uppercase tracking-wide',
                        isFinal ? 'text-accent-deep' : palette.softText,
                      )}
                    >
                      {stageFor(index, journey.milestones.length)}
                    </span>
                    <h3
                      className={cn(
                        'font-bold',
                        done && 'text-muted-foreground line-through decoration-2',
                      )}
                    >
                      {milestone.title}
                    </h3>
                  </div>
                  <StatusPill
                    tone={done ? 'done' : milestone.status === 'in_progress' ? 'active' : 'todo'}
                    hue={hue}
                    disabled={mutation.isPending}
                    ariaLabel={`${action.label}: ${milestone.title}`}
                    onClick={() =>
                      mutation.mutate({ milestoneId: milestone.id, status: action.next })
                    }
                  >
                    {done ? 'Done' : action.label}
                  </StatusPill>
                </div>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </motion.section>
  )
}

// One-time celebratory burst when every milestone is done. Template dots and
// accent-gold dots pop in, then the whole banner is the door to the party.
const burst: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const burstDot: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: EASE } },
}

const BURST_KEYS = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'] as const

function CompletionBanner({ palette }: { palette: TemplatePalette }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <Link
        to="/kid/celebration"
        className="block rounded-2xl bg-accent p-5 text-accent-foreground"
      >
        <motion.div
          variants={burst}
          initial="hidden"
          animate="show"
          className="flex items-center gap-1.5"
          aria-hidden
        >
          {BURST_KEYS.map((key, i) => (
            <motion.span
              key={key}
              variants={burstDot}
              className={cn('size-2.5 rounded-full', i % 2 === 0 ? palette.dot : 'bg-accent-deep')}
            />
          ))}
        </motion.div>
        <p className="mt-3 font-display text-2xl font-semibold">Every milestone, done.</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm">
          You did the whole thing. Go plan the party.
          <ArrowRight className="size-4" aria-hidden />
        </p>
      </Link>
    </motion.div>
  )
}

// Guides are companions through the journey, not a finish-line reward, so the
// door to them is always open. With hearts, this becomes the tested
// "DISCOVERY / Wilderness Torah / BOOKED" pattern: each favorited guide as a
// patch row with a status pill.
function YourGuidesCard() {
  const { providers, favorites } = Route.useLoaderData()
  const hearted = favorites
    .map((favorite) => providers.find((p) => p.key === favorite.providerKey))
    .filter((p): p is Provider => p !== undefined)

  if (hearted.length === 0) {
    return (
      <motion.section variants={item}>
        <Link to="/kid/guides" className="block">
          <motion.div
            initial={false}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="flex items-center gap-4 rounded-2xl bg-accent p-5 text-accent-foreground"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-deep/20">
              <Handshake className="size-5 text-accent-deep" aria-hidden />
            </span>
            <div className="flex-1">
              <p className="font-display text-lg font-semibold">
                Go it alone, or bring someone in?
              </p>
              <p className="text-sm">Real people who help journeys like yours happen.</p>
            </div>
            <StatusPill tone="link">Meet them</StatusPill>
          </motion.div>
        </Link>
      </motion.section>
    )
  }

  return (
    <motion.section variants={item} className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold">Your guides</h2>
      <div className="flex flex-col gap-2.5">
        {hearted.map((provider) => {
          const primary = provider.templates[0]
          const { scene: GuideArt, hue: guideHue } = templateScene(primary ?? 'my-own-path')
          const c = HUE_CLASSES[guideHue]
          return (
            <div
              key={provider.key}
              className={cn('flex items-center gap-3 rounded-2xl px-4 py-3', c.tile)}
            >
              <GuideArt className="size-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <p
                  className={cn('font-bold text-[10px] uppercase tracking-wide opacity-70', c.text)}
                >
                  Guide
                </p>
                <p className={cn('truncate font-display font-semibold', c.text)}>{provider.name}</p>
              </div>
              <StatusPill tone="done" hue={guideHue}>
                <Heart className="size-3 fill-current" aria-hidden />
                Interested
              </StatusPill>
            </div>
          )
        })}
      </div>
      <p className="text-muted-foreground text-sm">
        Your parent can reach out from their side.{' '}
        <Link
          to="/kid/guides"
          className="font-bold text-primary underline-offset-4 hover:underline"
        >
          See all guides
        </Link>
      </p>
    </motion.section>
  )
}

// Slide 10's "Be Inspired" feed, dashboard-sized: real kids' stories one tap
// away, with photo prints doing the selling.
function InspirationCard() {
  return (
    <motion.section variants={item}>
      <Link to="/stories" className="block">
        <motion.div
          initial={false}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="flex flex-col gap-4 rounded-2xl bg-secondary/60 p-5"
        >
          <div className="flex items-end gap-2">
            <PhotoSnap
              src="/photos/family-golden-hour.jpg"
              alt="A family celebrating outside at golden hour"
              tilt={-4}
              className="h-24 w-20"
            />
            <PhotoSnap
              src="/photos/kid-tablet-top.jpg"
              alt="A kid planning their journey on a tablet"
              tilt={3}
              delay={0.08}
              className="h-20 w-16"
            />
            <PhotoSnap
              src="/photos/workshop.jpg"
              alt="A kid teaching an older adult how to use a phone"
              tilt={-2}
              delay={0.16}
              className="h-16 w-14"
            />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold">Kids who did it their way</p>
            <p className="text-sm text-muted-foreground">Real stories from journeys like yours.</p>
          </div>
          <StatusPill tone="link" className="self-start">
            Get inspired
          </StatusPill>
        </motion.div>
      </Link>
    </motion.section>
  )
}

function ActivityList({
  journey,
  hue,
  palette,
}: {
  journey: JourneyView
  hue: Hue
  palette: TemplatePalette
}) {
  const { prompts } = Route.useLoaderData()
  const kindFor = (promptId: string | null): ActivityKind =>
    (promptId ? prompts.find((p) => p.id === promptId)?.kind : undefined) ?? 'custom'
  const router = useRouter()
  const toggleMutation = useMutation({
    mutationFn: (input: { activityId: string; status: 'planned' | 'done' }) =>
      setActivityStatusFn({ data: input }),
    onSuccess: async (result) => {
      if (result.ok) await router.invalidate()
    },
  })
  const removeMutation = useMutation({
    mutationFn: (activityId: string) => removeActivityFn({ data: { activityId } }),
    onSuccess: async (result) => {
      if (result.ok) await router.invalidate()
    },
  })

  return (
    <motion.section variants={item} className="flex flex-col gap-5">
      <h2 className="font-display text-2xl font-semibold">Up next</h2>
      {journey.activities.length === 0 ? (
        <p className="rounded-2xl bg-secondary/60 px-5 py-6 text-sm text-muted-foreground">
          This is your activity list: real things to do, make, learn or give. Pick a couple from the
          ideas below to get moving.
        </p>
      ) : null}
      {
        // The list stays mounted even at zero items so removing the last
        // activity still plays its exit animation.
      }
      <motion.ul layout className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {journey.activities.map((activity) => {
            const kind = kindFor(activity.promptId)
            const done = activity.status === 'done'
            return (
              <motion.li
                key={activity.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={cn('flex items-center gap-3 rounded-2xl px-4 py-3', palette.soft)}
              >
                <KindArt kind={kind} className="size-14" />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'font-bold text-[10px] uppercase tracking-wide opacity-70',
                      palette.softText,
                    )}
                  >
                    {kindLabel(kind)}
                  </p>
                  <p
                    className={cn(
                      'text-sm font-bold',
                      done ? 'text-muted-foreground line-through' : palette.softText,
                    )}
                  >
                    {activity.title}
                  </p>
                  {activity.description ? (
                    <p className={cn('text-xs opacity-80', palette.softText)}>
                      {activity.description}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <StatusPill
                    tone={done ? 'done' : 'todo'}
                    hue={hue}
                    disabled={toggleMutation.isPending}
                    ariaLabel={`Mark ${activity.title} ${done ? 'not done' : 'done'}`}
                    onClick={() =>
                      toggleMutation.mutate({
                        activityId: activity.id,
                        status: done ? 'planned' : 'done',
                      })
                    }
                  >
                    {done ? 'Done' : 'Mark done'}
                  </StatusPill>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${activity.title}`}
                    disabled={removeMutation.isPending}
                    onClick={() => removeMutation.mutate(activity.id)}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>
    </motion.section>
  )
}

// The activity prompt bank: the ~8 ideas matched to the kid's template render
// right on the dashboard so they are impossible to miss. Ideas from other paths
// and a write-your-own box live behind "More ideas".
function SuggestionBank({ journey, palette }: { journey: JourneyView; palette: TemplatePalette }) {
  const { prompts } = Route.useLoaderData()
  const router = useRouter()
  const addMutation = useMutation({
    mutationFn: (input: { promptId: string | null; title: string; description: string }) =>
      addActivityFn({ data: input }),
    onSuccess: async (result) => {
      if (result.ok) await router.invalidate()
    },
  })
  const add = (promptId: string | null, title: string, description: string) =>
    addMutation.mutate({ promptId, title, description })

  const addedPromptIds = new Set(
    journey.activities.map((a) => a.promptId).filter((id): id is string => id !== null),
  )
  const matched = prompts.filter(
    (p) => p.template === journey.template && !addedPromptIds.has(p.id),
  )
  const others = prompts.filter((p) => p.template !== journey.template)

  return (
    <motion.section variants={item} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Ideas for your path</h2>
          <p className="text-sm text-muted-foreground">
            Made for your journey. Tap one to add it to your list.
          </p>
        </div>
        <MoreIdeasDialog
          others={others}
          addedPromptIds={addedPromptIds}
          onAdd={add}
          pending={addMutation.isPending}
        />
      </div>
      {matched.length === 0 ? (
        <p className="rounded-2xl bg-secondary/60 px-5 py-6 text-sm text-muted-foreground">
          You've grabbed every ready-made idea for your path. Tap "More ideas" to borrow from
          another path or invent your own.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {matched.map((prompt) => (
            <div
              key={prompt.id}
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 px-4 py-3',
                palette.borderSoft,
              )}
            >
              <KindArt kind={prompt.kind} className="size-12" />
              <div className="flex-1">
                <p
                  className={cn('font-bold text-[10px] uppercase tracking-wide', palette.softText)}
                >
                  {kindLabel(prompt.kind)}
                </p>
                <p className="text-sm font-bold">{prompt.title}</p>
                <p className="text-xs text-muted-foreground">{prompt.description}</p>
              </div>
              <StatusPill
                tone="link"
                disabled={addMutation.isPending}
                ariaLabel={`Add ${prompt.title} to your list`}
                onClick={() => add(prompt.id, prompt.title, prompt.description)}
              >
                Add
              </StatusPill>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  )
}

function MoreIdeasDialog({
  others,
  addedPromptIds,
  onAdd,
  pending,
}: {
  others: readonly ActivityPrompt[]
  addedPromptIds: ReadonlySet<string>
  onAdd: (promptId: string | null, title: string, description: string) => void
  pending: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const searchId = useId()

  const q = query.trim().toLowerCase()
  const filtered = q
    ? others.filter((prompt) => `${prompt.title} ${prompt.description}`.toLowerCase().includes(q))
    : others

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setQuery('')
          setCustomTitle('')
        }
      }}
    >
      <DialogTrigger render={<Button size="sm" variant="ghost" className="shrink-0" />}>
        More ideas
      </DialogTrigger>
      {/* Flex column so the header + search stay fixed and only the list scrolls. */}
      <DialogContent className="flex max-h-[85dvh] flex-col gap-0 p-0">
        <DialogHeader className="gap-3 border-b p-6">
          <DialogTitle className="font-display text-2xl">More ideas</DialogTitle>
          <DialogDescription>
            Borrow an idea from another path, or write your own.
          </DialogDescription>
          <div className="relative">
            <Search
              className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              id={searchId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ideas..."
              aria-label="Search ideas"
              className="pl-9"
            />
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ideas match "{query}".</p>
          ) : (
            <PromptGroup
              heading="From other paths"
              prompts={filtered}
              addedPromptIds={addedPromptIds}
              onAdd={(prompt) => onAdd(prompt.id, prompt.title, prompt.description)}
              pending={pending}
            />
          )}
        </div>
        <DialogFooter className="border-t p-6">
          <form
            className="flex w-full gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              if (customTitle.trim().length === 0) return
              onAdd(null, customTitle.trim(), '')
              setCustomTitle('')
            }}
          >
            <Input
              value={customTitle}
              onChange={(event) => setCustomTitle(event.target.value)}
              placeholder="Invent your own..."
              aria-label="Custom activity"
              maxLength={120}
            />
            <Button type="submit" disabled={customTitle.trim().length === 0 || pending}>
              Add
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PromptGroup({
  heading,
  prompts,
  addedPromptIds,
  onAdd,
  pending,
}: {
  heading: string
  prompts: readonly ActivityPrompt[]
  addedPromptIds: ReadonlySet<string>
  onAdd: (prompt: ActivityPrompt) => void
  pending: boolean
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-sm font-bold text-muted-foreground">{heading}</h3>
      {prompts.map((prompt) => {
        const added = addedPromptIds.has(prompt.id)
        return (
          <div key={prompt.id} className="flex items-start gap-3 rounded-2xl border px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-bold">{prompt.title}</p>
              <p className="text-xs text-muted-foreground">{prompt.description}</p>
            </div>
            <Button
              variant={added ? 'ghost' : 'outline'}
              size="sm"
              disabled={added || pending}
              onClick={() => onAdd(prompt)}
            >
              {added ? 'Added' : 'Add'}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
