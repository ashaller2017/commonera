import { Link } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import type { AppRole } from '@/lib/auth/types'
import type { DirectoryAccess } from '@/utils/journeys.server'

// The guide directory is earned, not browsed. This screen sells the reward
// and shows exactly how far there is to go.
export function LockedDirectory({ access, viewer }: { access: DirectoryAccess; viewer: AppRole }) {
  const percent = access.total === 0 ? 0 : Math.round((access.done / access.total) * 100)
  const hasJourney = access.total > 0

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary">
        <Lock className="size-6 text-secondary-foreground" aria-hidden />
      </span>
      <h1 className="font-display text-4xl font-semibold">
        {viewer === 'child'
          ? 'Finish your journey, meet your guides'
          : 'The guides come at the end'}
      </h1>
      <p className="text-muted-foreground">
        {viewer === 'child'
          ? hasJourney
            ? `Real people who help journeys like ${access.journeyName ?? 'yours'} come to life are waiting behind this door. Knock it down one milestone at a time.`
            : 'The guide directory opens when your journey is complete. First step: take the quiz and pick your path.'
          : hasJourney
            ? `The directory unlocks for your whole family once ${access.kidName ?? 'your kid'} finishes every milestone of ${access.journeyName ?? 'their journey'}. They're on their way.`
            : 'The directory unlocks once your kid completes their journey. It starts with the quiz, and the quiz is their move.'}
      </p>

      {hasJourney ? (
        <div className="flex w-full max-w-sm flex-col gap-2">
          <div
            className="h-3.5 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={access.done}
            aria-valuemin={0}
            aria-valuemax={access.total}
            aria-label="Milestones done"
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(percent, 3)}%` }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            />
          </div>
          <p className="text-sm font-bold text-muted-foreground">
            {access.done} of {access.total} milestones done
          </p>
        </div>
      ) : null}

      {viewer === 'child' ? (
        <Button size="lg" render={<Link to={hasJourney ? '/kid' : '/kid/quiz'} />}>
          {hasJourney ? 'Back to my milestones' : 'Take the quiz'}
        </Button>
      ) : (
        <Button size="lg" variant="secondary" render={<Link to="/parent" />}>
          Back to the family view
        </Button>
      )}
    </section>
  )
}
