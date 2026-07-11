import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowRight,
  Check,
  Circle,
  Handshake,
  Lock,
  PartyPopper,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useId, useState } from 'react'
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
import type { ActivityPrompt } from '@/lib/content/types'
import { type JourneyProgress, journeyProgress } from '@/lib/journey/progress'
import { cn } from '@/lib/utils'
import { fetchActivityPromptsFn, fetchTimelineOptionsFn } from '@/utils/content.functions'
import {
  addActivityFn,
  fetchOwnJourneyFn,
  removeActivityFn,
  setActivityStatusFn,
  setMilestoneStatusFn,
} from '@/utils/journeys.functions'
import type { JourneyView, MilestoneStatus } from '@/utils/journeys.server'

export const Route = createFileRoute('/_authed/kid/')({
  loader: async () => {
    const [journey, prompts, timeline] = await Promise.all([
      fetchOwnJourneyFn(),
      fetchActivityPromptsFn(),
      fetchTimelineOptionsFn(),
    ])
    return { journey, prompts, timeline }
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
      <span className="text-5xl" aria-hidden>
        🧭
      </span>
      <h1 className="font-display text-4xl font-semibold">{firstName}, your journey starts here</h1>
      <p className="text-muted-foreground">
        Take a 3-minute quiz and it figures out what kind of B'Mitzvah journey actually fits you. No
        wrong answers, and you get to name the whole thing at the end.
      </p>
      <Button size="lg" render={<Link to="/kid/quiz" />}>
        Take the quiz
      </Button>
    </motion.section>
  )
}

function JourneyDashboard({ journey }: { journey: JourneyView }) {
  const { timeline } = Route.useLoaderData()
  const template = useTemplate(journey.template)
  const palette = TEMPLATE_PALETTE[journey.template]
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
      <motion.header variants={item} className="flex flex-col gap-4 border-b pb-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{journey.name}</h1>
          <TemplateChip template={journey.template} />
          {timelineLabel ? (
            <span className="text-sm font-bold text-muted-foreground">{timelineLabel}</span>
          ) : null}
        </div>
        {template ? (
          <p className="max-w-2xl text-sm text-muted-foreground">{template.tagline}</p>
        ) : null}
        <div className="flex items-center gap-4">
          <div
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={progress.done}
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-label="Milestones done"
          >
            <motion.div
              className={cn('h-full rounded-full', palette.bar)}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(progress.percent, 3)}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
          <span className="shrink-0 text-sm font-bold text-muted-foreground">
            {progress.done} of {progress.total} done
          </span>
        </div>
      </motion.header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-8">
        <MilestoneMap journey={journey} palette={palette} allDone={allDone} />
        <div className="flex flex-col gap-6">
          <ActivityList journey={journey} />
          <SuggestionBank journey={journey} />
          <GuidesReward palette={palette} progress={progress} />
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

function MilestoneMap({
  journey,
  palette,
  allDone,
}: {
  journey: JourneyView
  palette: TemplatePalette
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
                  <div className="flex items-center gap-2">
                    <h3
                      className={cn(
                        'font-bold',
                        done && 'text-muted-foreground line-through decoration-2',
                      )}
                    >
                      {milestone.title}
                    </h3>
                    {isFinal ? (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                        Celebration
                      </span>
                    ) : null}
                  </div>
                  <Button
                    variant={milestone.status === 'in_progress' ? 'default' : 'outline'}
                    size="sm"
                    disabled={mutation.isPending}
                    onClick={() =>
                      mutation.mutate({ milestoneId: milestone.id, status: action.next })
                    }
                  >
                    {action.label}
                  </Button>
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
// accent-gold dots pop in, then the whole banner is the door to the guides.
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
      <Link to="/kid/guides" className="block rounded-2xl bg-accent p-5 text-accent-foreground">
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
          Your guides just unlocked. Go meet them.
          <ArrowRight className="size-4" aria-hidden />
        </p>
      </Link>
    </motion.div>
  )
}

function GuidesReward({
  palette,
  progress,
}: {
  palette: TemplatePalette
  progress: JourneyProgress
}) {
  const unlocked = progress.total > 0 && progress.done === progress.total

  if (unlocked) {
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
              <p className="font-display text-lg font-semibold">Your guides are open</p>
              <p className="text-sm">Real people who help journeys like yours happen.</p>
            </div>
            <ArrowRight className="size-5 shrink-0" aria-hidden />
          </motion.div>
        </Link>
      </motion.section>
    )
  }

  return (
    <motion.section variants={item} className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary">
          <Lock className="size-5 text-muted-foreground" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-semibold">Your guides</h2>
          <p className="text-sm text-muted-foreground">
            Real people who help journeys like yours happen. They open when every milestone is done.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div
          className="h-2 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={progress.done}
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-label="Milestones toward guides"
        >
          <motion.div
            className={cn('h-full rounded-full', palette.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(progress.percent, 3)}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
        <p className="text-xs font-bold text-muted-foreground">
          {progress.done} of {progress.total} milestones
        </p>
      </div>
    </motion.section>
  )
}

function ActivityList({ journey }: { journey: JourneyView }) {
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
          {journey.activities.map((activity) => (
            <motion.li
              key={activity.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-start gap-3 rounded-2xl border px-4 py-3"
            >
              {/* biome-ignore lint/a11y/useSemanticElements: styled toggle keeps focus and hit target consistent with the design system */}
              <button
                type="button"
                role="checkbox"
                aria-checked={activity.status === 'done'}
                aria-label={`Mark ${activity.title} ${activity.status === 'done' ? 'not done' : 'done'}`}
                disabled={toggleMutation.isPending}
                onClick={() =>
                  toggleMutation.mutate({
                    activityId: activity.id,
                    status: activity.status === 'done' ? 'planned' : 'done',
                  })
                }
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2',
                  activity.status === 'done'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:border-primary',
                )}
              >
                {activity.status === 'done' ? <Check className="size-3.5" aria-hidden /> : null}
              </button>
              <div className="flex-1">
                <p
                  className={cn(
                    'text-sm font-bold',
                    activity.status === 'done' && 'text-muted-foreground line-through',
                  )}
                >
                  {activity.title}
                </p>
                {activity.description ? (
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${activity.title}`}
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(activity.id)}
              >
                <Trash2 aria-hidden />
              </Button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.section>
  )
}

// The activity prompt bank: the ~8 ideas matched to the kid's template render
// right on the dashboard so they are impossible to miss. Ideas from other paths
// and a write-your-own box live behind "More ideas".
function SuggestionBank({ journey }: { journey: JourneyView }) {
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
            <div key={prompt.id} className="flex items-start gap-3 rounded-2xl border px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-bold">{prompt.title}</p>
                <p className="text-xs text-muted-foreground">{prompt.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={addMutation.isPending}
                onClick={() => add(prompt.id, prompt.title, prompt.description)}
              >
                <Plus aria-hidden />
                Add
              </Button>
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
