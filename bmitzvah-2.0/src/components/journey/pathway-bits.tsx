import { ArrowRight, Check } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { HUE_CLASSES, type Hue, type SceneComponent } from '@/components/quiz/scene-kit'
import {
  AdventurousScene,
  CaringScene,
  CreativeScene,
  CuriousScene,
  DreamerScene,
} from '@/components/quiz/scenes/words'
import { cn } from '@/lib/utils'

// The visual vocabulary of the tested "pathway" mockups (product pack p.11):
// a big playful progress ring, tilted encouragement stickers, and small-caps
// status pills on the right edge of item rows. All colors run through the
// journey-hue theme tokens so dark mode adapts for free.

const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

// Literal stroke classes per hue (the Tailwind compiler must see every name).
const HUE_STROKE: Record<Hue, string> = {
  wild: 'stroke-wild',
  real: 'stroke-real',
  diff: 'stroke-diff',
  mind: 'stroke-mind',
  roots: 'stroke-roots',
  path: 'stroke-path',
}

// "Raised So Far!"-style ring: the journey's milestone count as a big
// celebratory dial instead of a bar.
export function ProgressRing({
  done,
  total,
  hue,
  className,
}: {
  done: number
  total: number
  hue: Hue
  className?: string
}) {
  const c = HUE_CLASSES[hue]
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const fraction = total > 0 ? done / total : 0
  return (
    <div
      className={cn('relative', className)}
      role="progressbar"
      aria-valuenow={done}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label="Milestones done"
    >
      <svg viewBox="0 0 120 120" className="-rotate-90 size-full" aria-hidden="true">
        <circle
          cx={60}
          cy={60}
          r={radius}
          fill="none"
          strokeWidth={13}
          className="stroke-secondary"
        />
        <motion.circle
          cx={60}
          cy={60}
          r={radius}
          fill="none"
          strokeWidth={13}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - fraction) }}
          transition={{ duration: 0.6, ease: EASE }}
          className={HUE_STROKE[hue]}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <span className={cn('font-display-wonk text-2xl font-semibold leading-none', c.text)}>
          {done}/{total}
        </span>
      </div>
    </div>
  )
}

// Tilted encouragement sticker ("keep it up!"): pops in, straightens on hover.
export function StickerNote({
  children,
  tilt = -8,
  className,
}: {
  children: ReactNode
  tilt?: number
  className?: string
}) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: tilt }}
      animate={{ scale: 1, rotate: tilt }}
      whileHover={{ rotate: 0 }}
      transition={{ duration: 0.3, ease: EASE, delay: 0.4 }}
      className={cn(
        'inline-block rounded-2xl bg-accent px-3 py-1.5 font-display-wonk font-semibold text-accent-foreground text-sm shadow-sm',
        className,
      )}
    >
      {children}
    </motion.span>
  )
}

// Small-caps status pill, the right-edge vocabulary of every tested item row
// (BOOKED / 2-10 / INSPIRATION ->). Renders a button when onClick is given.
export function StatusPill({
  tone,
  hue,
  children,
  onClick,
  disabled,
  ariaLabel,
  className,
}: {
  tone: 'todo' | 'active' | 'done' | 'link'
  hue?: Hue
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
  className?: string
}) {
  const c = hue ? HUE_CLASSES[hue] : null
  const toneClass =
    tone === 'done'
      ? cn(c?.tile, c?.text)
      : tone === 'active'
        ? (c?.solid ?? 'bg-primary text-primary-foreground')
        : tone === 'link'
          ? 'bg-accent text-accent-foreground'
          : 'border-2 border-input bg-background text-foreground hover:border-primary/50'
  const body = (
    <>
      {tone === 'done' ? <Check className="size-3.5" aria-hidden /> : null}
      {children}
      {tone === 'link' ? <ArrowRight className="size-3.5" aria-hidden /> : null}
    </>
  )
  const base = cn(
    'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-bold text-xs uppercase tracking-wide',
    toneClass,
    className,
  )
  if (!onClick) {
    return <span className={base}>{body}</span>
  }
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: EASE }}
      className={cn(base, 'disabled:opacity-60')}
    >
      {body}
    </motion.button>
  )
}

// Activity "kind" vocabulary: a caps label plus a piece of the quiz's
// illustrated scene language — the tested tracker gives every activity card
// its own art block, so rows read as postcards rather than checklist lines.
// Custom (kid-invented) activities get the dreamer.
export type ActivityKind = 'do' | 'create' | 'learn' | 'give' | 'custom'

const KIND_META: Record<ActivityKind, { label: string; scene: SceneComponent }> = {
  do: { label: 'Do', scene: AdventurousScene },
  create: { label: 'Make', scene: CreativeScene },
  learn: { label: 'Learn', scene: CuriousScene },
  give: { label: 'Give', scene: CaringScene },
  custom: { label: 'Your idea', scene: DreamerScene },
}

export function kindLabel(kind: ActivityKind): string {
  return KIND_META[kind].label
}

export function KindArt({ kind, className }: { kind: ActivityKind; className?: string }) {
  const Art = KIND_META[kind].scene
  return <Art className={cn('shrink-0', className)} />
}

// The mockups' "NATURE THEME TRENDING......." strip: the path's themes drift
// by in small caps. Purely decorative; the loop is a transform, so the global
// reducedMotion config stills it to the first copy.
export function ThemeTicker({
  items,
  className,
}: {
  items: readonly string[]
  className?: string
}) {
  const line = items.join(' • ')
  return (
    <div aria-hidden className={cn('overflow-hidden whitespace-nowrap', className)}>
      <motion.div
        className="flex w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: Math.max(18, items.length * 5),
          ease: 'linear',
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <span className="pr-4">{line} •</span>
        <span className="pr-4">{line} •</span>
      </motion.div>
    </div>
  )
}
