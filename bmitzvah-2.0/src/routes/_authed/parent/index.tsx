import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowRight, Check, Handshake, Heart, Plus } from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import { useState } from 'react'
import {
  ChildSettingsDialog,
  ChildSettingsSelects,
  type SetupOptions,
} from '@/components/child-settings-dialog'
import {
  type FavoritedGuide,
  GuideHeartChips,
  JourneyCompleteBadge,
  kidFavoritedGuides,
} from '@/components/kid-status'
import type { KidFavoriteRow } from '@/components/provider-directory'
import { TemplateChip } from '@/components/template-chip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { normalizeUsername, USERNAME_PATTERN } from '@/lib/auth/kid-credentials'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import type { ComfortKey, Provider, TimelineKey } from '@/lib/content/types'
import { cn } from '@/lib/utils'
import { registerKidFn } from '@/utils/auth.functions'
import type { RegisterKidError } from '@/utils/auth.server'
import { upsertChildSettingsFn } from '@/utils/child-settings.functions'
import { fetchProvidersFn, fetchSetupOptionsFn } from '@/utils/content.functions'
import { fetchFavoritesFn, fetchKidsFn } from '@/utils/journeys.functions'
import type { KidSummary } from '@/utils/journeys.server'

export const Route = createFileRoute('/_authed/parent/')({
  loader: async () => {
    const [kids, favorites, providers, setupOptions] = await Promise.all([
      fetchKidsFn(),
      fetchFavoritesFn(),
      fetchProvidersFn(),
      fetchSetupOptionsFn(),
    ])
    return { kids, favorites, providers, setupOptions }
  },
  component: ParentDashboard,
})

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

const pageStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
}

const rowStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

function ParentDashboard() {
  const { kids, favorites, providers } = Route.useLoaderData()
  const hasKids = kids.length > 0
  return (
    <motion.div
      className="flex flex-col gap-10"
      variants={pageStagger}
      initial="hidden"
      animate="show"
    >
      <motion.header className="flex flex-col gap-2" variants={fadeUp}>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Your family</h1>
        <p className="max-w-2xl text-muted-foreground">
          Your kids design their own B'Mitzvah journeys. This page is your window in: watch the
          progress, cheer it on, and leave the steering to them.
        </p>
      </motion.header>

      {hasKids ? (
        <>
          <motion.div variants={fadeUp}>
            <StatOverview kids={kids} />
          </motion.div>
          <KidsList kids={kids} favorites={favorites} providers={providers} />
        </>
      ) : (
        <motion.div variants={fadeUp}>
          <OnboardingPanel />
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <Reassurance />
      </motion.div>
    </motion.div>
  )
}

type FamilyStats = {
  readonly kidCount: number
  readonly milestonesDone: number
  readonly milestonesTotal: number
  readonly activitiesPlanned: number
  readonly activitiesDone: number
}

function familyStats(kids: readonly KidSummary[]): FamilyStats {
  let milestonesDone = 0
  let milestonesTotal = 0
  let activitiesPlanned = 0
  let activitiesDone = 0
  for (const kid of kids) {
    const journey = kid.journey
    if (!journey) continue
    milestonesDone += journey.milestonesDone
    milestonesTotal += journey.milestonesTotal
    activitiesPlanned += journey.activitiesPlanned
    activitiesDone += journey.activitiesDone
  }
  return {
    kidCount: kids.length,
    milestonesDone,
    milestonesTotal,
    activitiesPlanned,
    activitiesDone,
  }
}

function StatOverview({ kids }: { kids: readonly KidSummary[] }) {
  const stats = familyStats(kids)
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        value={stats.kidCount}
        label={stats.kidCount === 1 ? 'Kid' : 'Kids'}
        caption="designing their own journey"
      />
      <StatCard
        value={stats.milestonesDone}
        label="Milestones done"
        caption={
          stats.milestonesTotal > 0
            ? `of ${stats.milestonesTotal} across their journeys`
            : 'they land here once a journey starts'
        }
      />
      <StatCard
        value={stats.activitiesPlanned}
        label="Activities in flight"
        caption={
          stats.activitiesDone > 0
            ? `${stats.activitiesDone} already checked off`
            : 'real things to do, make, and give'
        }
      />
      <GuidesStatCard />
    </div>
  )
}

function StatCard({ value, label, caption }: { value: number; label: string; caption: string }) {
  return (
    <Card className="gap-1.5 p-5">
      <p className="font-display text-3xl font-semibold leading-none">{value}</p>
      <p className="text-sm font-bold">{label}</p>
      <p className="text-xs text-muted-foreground">{caption}</p>
    </Card>
  )
}

// Guides are available from day one: a facilitator can keep a kid on track and
// help with the Jewish meaning-making, so the door is never locked.
function GuidesStatCard() {
  return (
    <Link to="/parent/guides" className="block">
      <Card className="h-full justify-between gap-3 p-5 transition-colors hover:bg-secondary/40">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <p className="font-display text-3xl font-semibold leading-none">Guides</p>
            <p className="text-sm font-bold">Here from day one</p>
          </div>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Handshake className="size-4" aria-hidden />
          </span>
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          Facilitators who keep the journey moving
          <ArrowRight className="size-3 shrink-0" aria-hidden />
        </p>
      </Card>
    </Link>
  )
}

const ONBOARDING_STEPS = [
  {
    title: 'You set up the login',
    body: 'A username, a password, and two quick questions about the celebration. No email needed for them.',
  },
  {
    title: 'They take the quiz',
    body: 'A short quiz points them to a journey that actually fits who they are.',
  },
  {
    title: 'Bring on a guide, or don’t',
    body: 'Real people who keep the journey moving — a rabbi, a mentor, a maker. Optional, and there from day one.',
  },
  {
    title: 'You watch it grow',
    body: 'Their milestones, activities, and celebration plans all show up right here.',
  },
] as const

function OnboardingPanel() {
  return (
    <section className="rounded-3xl border bg-secondary/40 p-8 sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-semibold">Start by setting up your kid</h2>
          <p className="max-w-md text-muted-foreground">
            You create their login, then the rest is theirs. Pick a username and a password
            together, no email required, and they take it from there.
          </p>
          <div className="pt-1">
            <RegisterKidDialog triggerLabel="Add your kid" triggerSize="lg" />
          </div>
        </div>
        <ol className="flex flex-col gap-5">
          {ONBOARDING_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="font-bold">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function KidsList({
  kids,
  favorites,
  providers,
}: {
  kids: readonly KidSummary[]
  favorites: readonly KidFavoriteRow[]
  providers: readonly Provider[]
}) {
  return (
    <motion.section className="flex flex-col gap-5" variants={fadeUp}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">Your kids</h2>
        <RegisterKidDialog triggerLabel="Add another kid" />
      </div>
      <motion.div className="flex flex-col gap-4" variants={rowStagger}>
        {kids.map((kid) => (
          <KidRow key={kid.id} kid={kid} favorites={favorites} providers={providers} />
        ))}
      </motion.div>
    </motion.section>
  )
}

type KidJourneyRow = NonNullable<KidSummary['journey']>

function KidRow({
  kid,
  favorites,
  providers,
}: {
  kid: KidSummary
  favorites: readonly KidFavoriteRow[]
  providers: readonly Provider[]
}) {
  const initial = kid.displayName.trim().charAt(0).toUpperCase() || '?'
  const palette = kid.journey ? TEMPLATE_PALETTE[kid.journey.template] : null
  const complete = kid.journey
    ? kid.journey.milestonesTotal > 0 && kid.journey.milestonesDone === kid.journey.milestonesTotal
    : false
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -2 }} transition={{ duration: 0.2, ease: EASE }}>
      <Card className="gap-5 p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <Avatar className="size-11">
            <AvatarFallback
              className={cn(
                'font-display text-lg font-semibold',
                palette ? cn(palette.soft, palette.softText) : 'bg-muted text-muted-foreground',
              )}
            >
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-display text-2xl font-semibold">{kid.displayName}</h3>
            {kid.username ? (
              <span className="rounded-full bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
                @{kid.username}
              </span>
            ) : null}
            {complete ? <JourneyCompleteBadge /> : null}
          </div>
        </div>
        {kid.settingsAnswered ? null : <AboutKidNudge kid={kid} />}
        {kid.journey ? (
          <KidJourneySummary
            kid={kid}
            journey={kid.journey}
            guides={kidFavoritedGuides(kid.id, favorites, providers)}
          />
        ) : (
          <KidNudge />
        )}
      </Card>
    </motion.div>
  )
}

function KidNudge() {
  return (
    <p className="rounded-2xl bg-secondary/60 px-5 py-4 text-sm text-muted-foreground">
      Hasn't taken the quiz yet. The next step is theirs: have them log in and hit the quiz.
    </p>
  )
}

// Persistent until the parent answers the two about-your-kid questions —
// their observance answer is what tilts the quiz toward tradition.
function AboutKidNudge({ kid }: { kid: KidSummary }) {
  const { setupOptions } = Route.useLoaderData()
  const firstName = kid.displayName.split(' ')[0] || kid.displayName
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent/50 px-5 py-4">
      <p className="text-sm">
        <span className="font-bold">Tell us about {firstName}.</span> Two quick questions — when
        they'll celebrate and how traditional it should feel.
      </p>
      <ChildSettingsDialog
        childId={kid.id}
        kidName={kid.displayName}
        options={setupOptions}
        trigger={<Button variant="outline" size="sm" />}
        triggerLabel="Answer now"
      />
    </div>
  )
}

function KidJourneySummary({
  kid,
  journey,
  guides,
}: {
  kid: KidSummary
  journey: KidJourneyRow
  guides: readonly FavoritedGuide[]
}) {
  const firstName = kid.displayName.split(' ')[0] || kid.displayName
  const total = journey.milestonesTotal
  const done = journey.milestonesDone
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <TemplateChip template={journey.template} />
        <span className="font-display text-lg font-semibold">{journey.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${journey.name} milestones`}
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(percent, 3)}%` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
        </div>
        <span className="whitespace-nowrap text-sm font-bold text-muted-foreground">
          {done} of {total} milestones
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {journey.activitiesDone} done, {journey.activitiesPlanned} planned in their activity list.
      </p>

      {guides.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-1.5">
            <Heart className="size-4 fill-current text-accent-deep" aria-hidden />
            <p className="text-sm font-bold">{firstName} is interested in a guide</p>
          </div>
          <GuideHeartChips guides={guides} />
          <Link
            to="/parent/guides"
            className="inline-flex w-fit items-center gap-1 text-sm font-bold text-primary underline-offset-4 hover:underline"
          >
            Reach out on their behalf
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No guide picks from {firstName} yet. A facilitator can help keep things on track —{' '}
          <Link
            to="/parent/guides"
            className="font-bold text-primary underline-offset-4 hover:underline"
          >
            browse the guides
          </Link>{' '}
          anytime.
        </p>
      )}

      <div>
        <Button
          variant="outline"
          size="sm"
          render={<Link to="/parent/kids/$childId" params={{ childId: kid.id }} />}
        >
          See the plan
        </Button>
      </div>
    </div>
  )
}

const REASSURANCES = [
  {
    worry: "Wondering if you're doing this right?",
    calm: "There's no single right way to do this. A milestone your kid actually cares about is the whole point.",
  },
  {
    worry: "Not sure it's Jewish enough?",
    calm: 'Every journey carries a Jewish thread they can pick up or leave on their own terms, and it still counts.',
  },
  {
    worry: "Afraid they won't care?",
    calm: 'They chose this path themselves, which is exactly why it tends to stick.',
  },
] as const

function Reassurance() {
  return (
    <section className="flex flex-col gap-6 border-t pt-8">
      <h2 className="font-display text-xl font-semibold">A few things to set down</h2>
      <div className="flex max-w-2xl flex-col gap-5">
        {REASSURANCES.map((item) => (
          <div key={item.worry} className="flex flex-col gap-1">
            <p className="font-bold">{item.worry}</p>
            <p className="text-muted-foreground">{item.calm}</p>
          </div>
        ))}
      </div>
      <Link
        to="/parent/guides"
        className="w-fit text-sm font-bold text-primary underline-offset-4 hover:underline"
      >
        When you want real-world help, the guide directory is open whenever you are.
      </Link>
    </section>
  )
}

function RegisterKidDialog({
  triggerLabel,
  triggerSize = 'default',
}: {
  triggerLabel: string
  triggerSize?: 'default' | 'lg'
}) {
  const router = useRouter()
  const { setupOptions } = Route.useLoaderData()
  const [open, setOpen] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [aboutDone, setAboutDone] = useState(false)

  const mutation = useMutation({
    mutationFn: (input: { username: string; displayName: string; password: string }) =>
      registerKidFn({ data: input }),
  })
  const result = mutation.data

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      const succeeded = result?.ok === true
      setDisplayName('')
      setUsername('')
      setPassword('')
      setLocalError(null)
      setAboutDone(false)
      mutation.reset()
      if (succeeded) void router.invalidate()
    }
  }

  const errorMessage = result && !result.ok ? registerErrorMessage(result.error) : localError

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size={triggerSize} />}>
        <Plus aria-hidden />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {result?.ok && !aboutDone ? (
          <AboutKidStep
            childId={result.value.id}
            kidName={result.value.displayName}
            options={setupOptions}
            onDone={() => setAboutDone(true)}
          />
        ) : null}
        {result?.ok && aboutDone ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Add your kid</DialogTitle>
              <DialogDescription>You create the login. They take it from there.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-5" aria-hidden />
                </span>
                <p className="font-display text-lg font-semibold">
                  {result.value.displayName}'s login is ready
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Have them go to the login page and open the{' '}
                <span className="font-bold text-foreground">I'm the kid</span> tab. They sign in
                with the username{' '}
                <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
                  {result.value.username}
                </span>{' '}
                and the password you two picked.
              </p>
              <p className="text-sm text-muted-foreground">
                While they take the quiz, you could{' '}
                <Link
                  to="/parent/guides"
                  className="font-bold text-primary underline-offset-4 hover:underline"
                  onClick={() => handleOpenChange(false)}
                >
                  browse guides who can help
                </Link>{' '}
                along the way. Totally optional.
              </p>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </div>
          </>
        ) : null}
        {result?.ok ? null : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Add your kid</DialogTitle>
              <DialogDescription>You create the login. They take it from there.</DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                const normalized = normalizeUsername(username)
                if (!USERNAME_PATTERN.test(normalized)) {
                  setLocalError(
                    'Usernames are 3 to 20 characters: lowercase letters, numbers, and underscores.',
                  )
                  return
                }
                if (password.length < 6) {
                  setLocalError('Pick a password with at least 6 characters.')
                  return
                }
                setLocalError(null)
                mutation.mutate({ username: normalized, displayName: displayName.trim(), password })
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="kid-name">Kid's first name</Label>
                <Input
                  id="kid-name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="The name they'll see on their dashboard"
                  autoComplete="off"
                  maxLength={60}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="kid-username">Username</Label>
                <Input
                  id="kid-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value.toLowerCase())}
                  placeholder="e.g. leo_makes_stuff"
                  autoComplete="off"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  3 to 20 characters: lowercase letters, numbers, and underscores.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="kid-password">Password</Label>
                <Input
                  id="kid-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  At least 6 characters. Pick it together so you both remember it.
                </p>
              </div>
              {errorMessage ? (
                <p className="text-sm font-bold text-destructive" role="alert">
                  {errorMessage}
                </p>
              ) : null}
              <Button type="submit" size="lg" disabled={mutation.isPending}>
                {mutation.isPending ? 'Setting up...' : 'Create their login'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Step two of add-kid: the parent answers the two celebration questions about
// the kid they just created. Skippable — the dashboard nudge picks it up later.
function AboutKidStep({
  childId,
  kidName,
  options,
  onDone,
}: {
  childId: string
  kidName: string
  options: SetupOptions
  onDone: () => void
}) {
  const [timeline, setTimeline] = useState<TimelineKey | null>(null)
  const [comfort, setComfort] = useState<ComfortKey | null>(null)
  const mutation = useMutation({
    mutationFn: () => upsertChildSettingsFn({ data: { childId, timeline, comfort } }),
    onSuccess: (result) => {
      if (result.ok) onDone()
    },
  })
  const firstName = kidName.split(' ')[0] || kidName
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">About {firstName}</DialogTitle>
        <DialogDescription>
          Two quick questions only you can answer — they help the quiz suggest a journey that fits.
        </DialogDescription>
      </DialogHeader>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          mutation.mutate()
        }}
      >
        <ChildSettingsSelects
          kidName={kidName}
          options={options}
          timeline={timeline}
          comfort={comfort}
          onTimelineChange={setTimeline}
          onComfortChange={setComfort}
        />
        {mutation.data && !mutation.data.ok ? (
          <p className="text-sm font-bold text-destructive" role="alert">
            That didn't save. Give it another try in a moment.
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={mutation.isPending || (!timeline && !comfort)}>
          {mutation.isPending ? 'Saving...' : 'Save and continue'}
        </Button>
        <button
          type="button"
          className="self-center text-sm font-bold text-muted-foreground underline-offset-4 hover:underline"
          onClick={onDone}
        >
          I'll answer later
        </button>
      </form>
    </>
  )
}

function registerErrorMessage(error: RegisterKidError): string {
  switch (error) {
    case 'username-taken':
      return "That username's taken, try another"
    case 'not-a-parent':
    case 'registration-failed':
      return 'Something went wrong setting up that login. Give it another try.'
  }
}
