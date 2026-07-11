import { createFileRoute, Link } from '@tanstack/react-router'
import { Copy, Share2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { JourneyCardView } from '@/components/journey-card'
import { Button } from '@/components/ui/button'
import { useTemplate } from '@/hooks/use-templates'
import { journeyProgress } from '@/lib/journey/progress'
import { fetchOwnJourneyFn } from '@/utils/journeys.functions'
import type { JourneyView } from '@/utils/journeys.server'

export const Route = createFileRoute('/_authed/kid/card')({
  loader: () => fetchOwnJourneyFn(),
  component: CardPage,
})

function CardPage() {
  const journey = Route.useLoaderData()
  if (!journey) return <EmptyCard />
  return <JourneyCard journey={journey} />
}

function EmptyCard() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center gap-6 py-20 text-center">
      <span className="text-5xl" aria-hidden>
        🪪
      </span>
      <h1 className="font-display font-semibold text-3xl sm:text-4xl">
        Your card shows up once you have a journey
      </h1>
      <p className="text-muted-foreground">
        Take the quiz, name your path, and this turns into a snapshot worth sending to someone.
      </p>
      <Button size="lg" render={<Link to="/kid/quiz" />}>
        Take the quiz
      </Button>
    </section>
  )
}

function JourneyCard({ journey }: { journey: JourneyView }) {
  const { user } = Route.useRouteContext()
  const firstName = user.displayName.split(' ')[0] ?? user.displayName
  const template = useTemplate(journey.template)
  const progress = journeyProgress(journey.milestones.map((m) => m.status))
  const activities = journey.activities
    .slice(0, 3)
    .map((a) => ({ title: a.title, done: a.status === 'done' }))
  const celebrationWhat = journey.celebration?.what.trim() ?? ''

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <JourneyCardView
        template={journey.template}
        journeyName={journey.name}
        firstName={firstName}
        themes={template?.themes ?? []}
        milestonesDone={progress.done}
        milestonesTotal={progress.total}
        activities={activities}
        celebration={celebrationWhat.length > 0 ? celebrationWhat : null}
      />
      <ShareSection slug={journey.shareSlug} journeyName={journey.name} firstName={firstName} />
    </div>
  )
}

function ShareSection({
  slug,
  journeyName,
  firstName,
}: {
  slug: string | null
  journeyName: string
  firstName: string
}) {
  const [origin, setOrigin] = useState('')
  const [canShare, setCanShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  if (!slug) return null
  const url = `${origin}/share/${slug}`

  const flash = () => {
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      flash()
    } catch {
      // clipboard blocked; nothing to do
    }
  }
  const share = async () => {
    try {
      await navigator.share({ title: `${firstName}'s B'Mitzvah journey`, text: journeyName, url })
    } catch {
      // user dismissed or share unavailable
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-muted-foreground text-sm">Anyone with this link can see your card.</p>
      <div className="flex w-full max-w-sm items-center rounded-full border bg-secondary/40 px-4 py-2.5">
        <span className="truncate text-muted-foreground text-sm">
          {origin ? url : `/share/${slug}`}
        </span>
      </div>
      <div className="flex gap-2">
        <Button onClick={copyLink}>
          <Copy aria-hidden />
          {copied ? 'Copied' : 'Copy link'}
        </Button>
        {canShare ? (
          <Button variant="outline" onClick={share}>
            <Share2 aria-hidden />
            Share
          </Button>
        ) : null}
      </div>
    </div>
  )
}
