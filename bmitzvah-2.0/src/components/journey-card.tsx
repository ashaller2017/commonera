import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { TemplateChip } from '@/components/template-chip'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import type { TemplateKey } from '@/lib/content/types'
import { cn } from '@/lib/utils'

// The presentational journey card, shared by the private /kid/card and the
// public /share/$slug page so both stay identical.
export type JourneyCardData = {
  readonly template: TemplateKey
  readonly journeyName: string
  readonly firstName: string
  readonly themes: readonly string[]
  readonly milestonesDone: number
  readonly milestonesTotal: number
  readonly activities: readonly { readonly title: string; readonly done: boolean }[]
  readonly celebration: string | null
}

export function JourneyCardView({
  template,
  journeyName,
  firstName,
  themes,
  milestonesDone,
  milestonesTotal,
  activities,
  celebration,
}: JourneyCardData) {
  const palette = TEMPLATE_PALETTE[template]
  const percent = milestonesTotal > 0 ? Math.round((milestonesDone / milestonesTotal) * 100) : 0

  return (
    <div className={cn('rounded-3xl p-8 sm:p-10', palette.soft)}>
      <TemplateChip template={template} variant="solid" />
      <h1
        className={cn(
          'mt-6 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl',
          palette.softText,
        )}
      >
        {journeyName}
      </h1>
      <p className={cn('mt-3 font-bold text-sm opacity-80', palette.softText)}>
        {firstName} is building this
      </p>

      {themes.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {themes.map((theme) => (
            <li
              key={theme}
              className={cn(
                'rounded-full bg-background/60 px-3 py-1 font-bold text-xs',
                palette.softText,
              )}
            >
              {theme}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-7">
        <span className={cn('font-bold text-sm', palette.softText)}>
          {milestonesDone} of {milestonesTotal} milestones
        </span>
        <div
          className="mt-2 h-3 overflow-hidden rounded-full bg-background/60"
          role="progressbar"
          aria-valuenow={milestonesDone}
          aria-valuemin={0}
          aria-valuemax={milestonesTotal}
          aria-label="Milestones done"
        >
          <motion.div
            className={cn('h-full rounded-full', palette.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(percent, 3)}%` }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
      </div>

      {activities.length > 0 ? (
        <ul className="mt-7 flex flex-col gap-2.5">
          {activities.map((activity) => (
            <li key={activity.title} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full',
                  activity.done
                    ? cn(palette.dot, 'text-white')
                    : cn('border-2', palette.borderSoft),
                )}
              >
                {activity.done ? <Check className="size-3" aria-hidden /> : null}
              </span>
              <span
                className={cn(
                  'font-semibold text-sm',
                  palette.softText,
                  activity.done && 'line-through opacity-70',
                )}
              >
                {activity.title}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {celebration ? (
        <p
          className={cn(
            'mt-7 line-clamp-1 border-t pt-5 font-semibold text-sm',
            palette.softText,
            palette.borderSoft,
          )}
        >
          <span aria-hidden>🎉 </span>
          {celebration}
        </p>
      ) : null}
    </div>
  )
}
