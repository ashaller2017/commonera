import { Check } from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// The shared visual language for the quiz's hand-drawn scenes. Every scene is
// flat chunky vector in ONE journey-hue family (plus a touch of celebration
// gold), drawn on a 120x120 canvas, colored through theme tokens so dark mode
// adapts for free.
//
// Scenes are motion.dev choreography, not static art: each `Scene` is a
// motion.svg that staggers its parts in when it mounts (every question step
// remounts its scenes, so the art assembles itself on arrival). Parts opt into
// one of three entrances — `Pop` (scale from nothing), `Rise` (slide up), and
// `Draw` (a stroke drawing itself via pathLength) — and at most one accent per
// scene may loop forever (`Twinkle`, `Bob`, `Flicker`). Everything runs
// through motion/react, so the global MotionConfig reducedMotion="user"
// collapses it all gracefully.

export type Hue = 'wild' | 'real' | 'diff' | 'mind' | 'roots' | 'path'

export type SceneProps = { readonly className?: string }
export type SceneComponent = ComponentType<SceneProps>

// Literal class strings only: the Tailwind compiler must see every name.
export const HUE_CLASSES: Record<
  Hue,
  {
    readonly fill: string
    readonly fillDeep: string
    readonly stroke: string
    readonly strokeDeep: string
    readonly tile: string
    readonly text: string
    readonly solid: string
    readonly ring: string
  }
> = {
  wild: {
    fill: 'fill-wild',
    fillDeep: 'fill-wild-deep',
    stroke: 'stroke-wild',
    strokeDeep: 'stroke-wild-deep',
    tile: 'bg-wild-soft',
    text: 'text-wild-deep',
    solid: 'bg-wild text-white',
    ring: 'ring-wild',
  },
  real: {
    fill: 'fill-real',
    fillDeep: 'fill-real-deep',
    stroke: 'stroke-real',
    strokeDeep: 'stroke-real-deep',
    tile: 'bg-real-soft',
    text: 'text-real-deep',
    solid: 'bg-real text-white',
    ring: 'ring-real',
  },
  diff: {
    fill: 'fill-diff',
    fillDeep: 'fill-diff-deep',
    stroke: 'stroke-diff',
    strokeDeep: 'stroke-diff-deep',
    tile: 'bg-diff-soft',
    text: 'text-diff-deep',
    solid: 'bg-diff text-white',
    ring: 'ring-diff',
  },
  mind: {
    fill: 'fill-mind',
    fillDeep: 'fill-mind-deep',
    stroke: 'stroke-mind',
    strokeDeep: 'stroke-mind-deep',
    tile: 'bg-mind-soft',
    text: 'text-mind-deep',
    solid: 'bg-mind text-white',
    ring: 'ring-mind',
  },
  roots: {
    fill: 'fill-roots',
    fillDeep: 'fill-roots-deep',
    stroke: 'stroke-roots',
    strokeDeep: 'stroke-roots-deep',
    tile: 'bg-roots-soft',
    text: 'text-roots-deep',
    solid: 'bg-roots text-white',
    ring: 'ring-roots',
  },
  path: {
    fill: 'fill-path',
    fillDeep: 'fill-path-deep',
    stroke: 'stroke-path',
    strokeDeep: 'stroke-path-deep',
    tile: 'bg-path-soft',
    text: 'text-path-deep',
    solid: 'bg-path text-white',
    ring: 'ring-path',
  },
}

// Map a journey template key onto its short hue key.
export const TEMPLATE_HUE = {
  'into-the-wild': 'wild',
  'make-something-real': 'real',
  'make-a-difference': 'diff',
  'mind-and-meaning': 'mind',
  'roots-and-rituals': 'roots',
  'my-own-path': 'path',
} as const satisfies Record<string, Hue>

// Ease-out-quart, the house curve (DESIGN.md).
export const SCENE_EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

// ---------------------------------------------------------------------------
// Choreography variants. The Scene svg is the stagger container; parts pick
// an entrance by variant name. Deterministic, no randomness.
// ---------------------------------------------------------------------------

const sceneStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export const popIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: SCENE_EASE } },
}

export const riseIn: Variants = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.3, ease: SCENE_EASE } },
}

export const drawIn: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: SCENE_EASE },
  },
}

// SVG parts scale around their own box, not the canvas origin.
const PART_STYLE = { transformBox: 'fill-box', transformOrigin: 'center' } as const

export function Scene({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.svg
      viewBox="0 0 120 120"
      aria-hidden
      className={cn('block', className)}
      variants={sceneStagger}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.svg>
  )
}

// A group that pops in as part of the scene stagger. The building block most
// scene parts use.
export function Pop({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.g variants={popIn} style={PART_STYLE} className={className}>
      {children}
    </motion.g>
  )
}

export function Rise({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.g variants={riseIn} style={PART_STYLE} className={className}>
      {children}
    </motion.g>
  )
}

// A stroke that draws itself on. Pass the path `d`; stroke color via className.
export function Draw({
  d,
  className,
  strokeWidth = 5,
}: {
  d: string
  className?: string
  strokeWidth?: number
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      variants={drawIn}
    />
  )
}

// ---------------------------------------------------------------------------
// Idle loops. At most one per scene; motion.dev drives them so reduced motion
// collapses them via the global MotionConfig.
// ---------------------------------------------------------------------------

// Gentle opacity twinkle (sparks, stars, fireflies).
export function Twinkle({
  children,
  duration = 2.2,
  delay = 0,
}: {
  children: ReactNode
  duration?: number
  delay?: number
}) {
  return (
    <motion.g variants={popIn} style={PART_STYLE}>
      <motion.g
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay }}
      >
        {children}
      </motion.g>
    </motion.g>
  )
}

// Slow vertical float (clouds, balloons, boats).
export function Bob({
  children,
  distance = 3,
  duration = 3,
}: {
  children: ReactNode
  distance?: number
  duration?: number
}) {
  return (
    <motion.g variants={riseIn} style={PART_STYLE}>
      <motion.g
        animate={{ y: [0, -distance, 0] }}
        transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      >
        {children}
      </motion.g>
    </motion.g>
  )
}

// Quick scale shimmer (flames, stars mid-celebration).
export function Flicker({ children, duration = 1.4 }: { children: ReactNode; duration?: number }) {
  return (
    <motion.g variants={popIn} style={PART_STYLE}>
      <motion.g
        style={PART_STYLE}
        animate={{ scale: [1, 1.12, 0.96, 1] }}
        transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      >
        {children}
      </motion.g>
    </motion.g>
  )
}

// ---------------------------------------------------------------------------
// Shape helpers (plain SVG; wrap in Pop/Rise/Twinkle for motion).
// ---------------------------------------------------------------------------

const BLOB_PATHS = [
  'M60 8c22 0 44 12 48 32s-6 42-22 52-42 12-58 0S4 58 10 38 38 8 60 8Z',
  'M62 6c20-2 40 10 48 28s2 40-10 54-36 18-54 10S8 72 8 50 26 10 42 8c6-1 14-1 20-2Z',
  'M58 10c24-4 46 8 52 26s-4 38-16 50-34 20-52 12S6 70 8 48 34 14 58 10Z',
  'M64 8c18 2 36 14 42 32s0 38-14 50-38 14-54 4S8 64 12 42 46 6 64 8Z',
] as const

// Organic backdrop shape; variant keeps neighbors from twinning.
export function Blob({ variant = 0, className }: { variant?: number; className?: string }) {
  return <path d={BLOB_PATHS[variant % BLOB_PATHS.length]} className={className} />
}

// Low mound anchoring a scene's feet.
export function Ground({ className, y = 92 }: { className?: string; y?: number }) {
  return <path d={`M8 ${y + 14}c0-10 24-16 52-16s52 6 52 16v14H8Z`} className={className} />
}

// Four-point sparkle.
export function Spark({
  x,
  y,
  r = 7,
  className,
}: {
  x: number
  y: number
  r?: number
  className?: string
}) {
  return (
    <path
      d={`M${x} ${y - r}Q${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y}Q${x + r * 0.22} ${y + r * 0.22} ${x} ${y + r}Q${x - r * 0.22} ${y + r * 0.22} ${x - r} ${y}Q${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r}Z`}
      className={className}
    />
  )
}

// Hand-wavy stroke path (pass to Draw for the draw-on effect).
export function squigglePath(x: number, y: number, width = 40): string {
  const s = width / 4
  return `M${x} ${y}q${s} -8 ${s * 2} 0t${s * 2} 0`
}

// ---------------------------------------------------------------------------
// Fallback art: quiz content is admin-editable, so an option the library has
// never heard of still gets a respectable animated sticker (blob + emoji).
// ---------------------------------------------------------------------------

export function makeEmojiSticker(emoji: string, hue: Hue): SceneComponent {
  const c = HUE_CLASSES[hue]
  return function EmojiSticker({ className }: SceneProps) {
    return (
      <Scene className={className}>
        <Pop>
          <Blob variant={1} className={cn(c.fill, 'opacity-25')} />
        </Pop>
        <Pop>
          <text x={60} y={76} textAnchor="middle" fontSize={46}>
            {emoji}
          </text>
        </Pop>
        <Twinkle>
          <Spark x={100} y={26} r={6} className="fill-accent-deep" />
        </Twinkle>
      </Scene>
    )
  }
}

// ---------------------------------------------------------------------------
// The illustrated answer card.
// ---------------------------------------------------------------------------

// Entrance used by the grids; parent supplies the stagger container.
export const tileEntrance: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: SCENE_EASE } },
}

export function SceneTile({
  scene: Art,
  hue,
  label,
  selected,
  onClick,
  index,
  disabled,
}: {
  scene: SceneComponent
  hue: Hue
  label: string
  selected: boolean
  onClick: () => void
  index: number
  disabled?: boolean
}) {
  const c = HUE_CLASSES[hue]
  const tilt = index % 2 === 0 ? -1.6 : 1.6
  return (
    <motion.div variants={tileEntrance} className="h-full">
      <motion.button
        type="button"
        aria-pressed={selected}
        disabled={disabled}
        onClick={onClick}
        initial={false}
        animate={selected ? { rotate: 0, scale: [1, 1.06, 1] } : { rotate: tilt, scale: 1 }}
        whileHover={{ rotate: 0, y: -4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.25, ease: SCENE_EASE }}
        className={cn(
          'relative flex h-full w-full flex-col items-center gap-2 rounded-3xl p-4 pb-5 text-center',
          c.tile,
          selected && cn('ring-2 ring-offset-2 ring-offset-background', c.ring),
        )}
      >
        <Art className="h-24 w-24" />
        <span className={cn('text-sm font-bold leading-snug text-balance', c.text)}>{label}</span>
        {selected ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, ease: SCENE_EASE }}
            className={cn(
              'absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full',
              c.solid,
            )}
          >
            <Check className="size-4" aria-hidden />
          </motion.span>
        ) : null}
      </motion.button>
    </motion.div>
  )
}

// Compact illustrated token for the pick-3 words question.
export function WordToken({
  scene: Art,
  hue,
  label,
  selected,
  onClick,
}: {
  scene: SceneComponent
  hue: Hue
  label: string
  selected: boolean
  onClick: () => void
}) {
  const c = HUE_CLASSES[hue]
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      initial={false}
      animate={selected ? { scale: [1, 1.07, 1], rotate: [0, -2, 0] } : { scale: 1, rotate: 0 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.22, ease: SCENE_EASE }}
      className={cn(
        'relative flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3',
        c.tile,
        c.text,
        selected && cn('ring-2 ring-offset-2 ring-offset-background', c.ring),
      )}
    >
      <Art className="size-12" />
      <span className="text-sm font-bold">{label}</span>
      {selected ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, ease: SCENE_EASE }}
          className={cn(
            'absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full',
            c.solid,
          )}
        >
          <Check className="size-3" aria-hidden />
        </motion.span>
      ) : null}
    </motion.button>
  )
}
