import {
  Blob,
  Bob,
  Draw,
  Flicker,
  HUE_CLASSES,
  Pop,
  Rise,
  Scene,
  type SceneProps,
  Spark,
  squigglePath,
  Twinkle,
} from '@/components/quiz/scene-kit'
import { cn } from '@/lib/utils'

// Answer scenes for quiz questions Q6-Q10 (walls, pride, learning, big-day
// stories, and finishing a project). One focal motif per option, hue-keyed.

// ---------------------------------------------------------------------------
// Q6 — "There's a big empty wall and it's yours. What goes on it?"
// ---------------------------------------------------------------------------

export function Q6MapScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* pinned map */}
        <rect x={28} y={30} width={64} height={62} rx={8} className={c.fill} />
        <rect x={35} y={37} width={50} height={48} rx={4} className="fill-background" />
      </Pop>
      <Draw d="M42 76q10-16 20-10t18-18" className={c.strokeDeep} strokeWidth={5} />
      <Pop>
        <circle cx={42} cy={76} r={5} className={c.fillDeep} />
        <circle cx={80} cy={48} r={5} className="fill-accent" />
      </Pop>
    </Scene>
  )
}

export function Q6ArtScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* picture frame */}
        <rect x={30} y={28} width={60} height={60} rx={6} className={c.fill} />
        <rect x={38} y={36} width={44} height={44} rx={3} className="fill-background" />
      </Pop>
      <Draw d={squigglePath(44, 60, 32)} className={c.strokeDeep} strokeWidth={6} />
      <Twinkle>
        <Spark x={98} y={26} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q6CausesScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* pinboard of causes */}
        <rect x={26} y={28} width={68} height={64} rx={8} className={c.fill} />
        <rect
          x={33}
          y={36}
          width={20}
          height={22}
          rx={3}
          transform="rotate(-6 43 47)"
          className="fill-background"
        />
        <rect
          x={38}
          y={62}
          width={20}
          height={22}
          rx={3}
          transform="rotate(7 48 73)"
          className="fill-background"
        />
      </Pop>
      <Bob distance={2.5}>
        <rect
          x={62}
          y={42}
          width={22}
          height={24}
          rx={3}
          transform="rotate(5 73 54)"
          className="fill-background"
        />
        <path
          d="M73 62c-6-4.5-9-8-9-11.5 0-3 2.2-5 5-5 1.6 0 3.2.8 4 2.4.8-1.6 2.4-2.4 4-2.4 2.8 0 5 2 5 5 0 3.5-3 7-9 11.5Z"
          className={c.fillDeep}
        />
      </Bob>
    </Scene>
  )
}

export function Q6FactsScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* puzzle piece */}
        <path
          d="M32 52a8 8 0 0 1 8-8h6a8 8 0 1 1 16 0h6a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8Z"
          className={c.fill}
        />
      </Pop>
      <Draw d="M80 36q12-8 19 1t-5 16l-7 5v6" className={c.strokeDeep} strokeWidth={5} />
      <Pop>
        <circle cx={87} cy={76} r={4} className={c.fillDeep} />
      </Pop>
    </Scene>
  )
}

export function Q6PhotosScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Draw d="M18 34q42 16 84 0" className={c.strokeDeep} strokeWidth={4} />
      <Rise>
        {/* hanging polaroids */}
        <rect
          x={30}
          y={42}
          width={26}
          height={30}
          rx={3}
          transform="rotate(-6 43 57)"
          className="fill-background"
        />
        <rect
          x={34}
          y={46}
          width={18}
          height={16}
          rx={2}
          transform="rotate(-6 43 57)"
          className={c.fill}
        />
        <rect
          x={64}
          y={44}
          width={26}
          height={30}
          rx={3}
          transform="rotate(5 77 59)"
          className="fill-background"
        />
        <rect
          x={68}
          y={48}
          width={18}
          height={16}
          rx={2}
          transform="rotate(5 77 59)"
          className={c.fillDeep}
        />
      </Rise>
      <Pop>
        <path
          d="M60 94c-5-4-7.5-6.8-7.5-9.5 0-2.4 1.8-4 4-4 1.4 0 2.8.7 3.5 2 .7-1.3 2.1-2 3.5-2 2.2 0 4 1.6 4 4 0 2.7-2.5 5.5-7.5 9.5Z"
          className={c.fillDeep}
        />
      </Pop>
    </Scene>
  )
}

export function Q6MixScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* collage of frames */}
        <rect
          x={28}
          y={34}
          width={34}
          height={40}
          rx={4}
          transform="rotate(-5 45 54)"
          className={c.fill}
        />
        <rect
          x={34}
          y={40}
          width={22}
          height={28}
          rx={2}
          transform="rotate(-5 45 54)"
          className="fill-background"
        />
        <rect
          x={68}
          y={30}
          width={26}
          height={30}
          rx={4}
          transform="rotate(6 81 45)"
          className={c.fillDeep}
        />
        <rect
          x={73}
          y={35}
          width={16}
          height={20}
          rx={2}
          transform="rotate(6 81 45)"
          className="fill-background"
        />
        <rect
          x={58}
          y={70}
          width={22}
          height={24}
          rx={4}
          transform="rotate(-4 69 82)"
          className={c.fill}
        />
        <rect
          x={62}
          y={74}
          width={14}
          height={16}
          rx={2}
          transform="rotate(-4 69 82)"
          className="fill-background"
        />
      </Pop>
      <Twinkle>
        <Spark x={100} y={78} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// Q7 — "Someone asks what you're proud of. You'd rather say..."
// ---------------------------------------------------------------------------

export function Q7OutdoorsScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* summit */}
        <path d="M60 34 94 96H26Z" className={c.fill} />
        <path d="M60 34 72 56l-6-4-6 5-6-5-6 4Z" className="fill-background" />
      </Rise>
      <Draw d="M60 34V12" className={c.strokeDeep} strokeWidth={4} />
      <Pop>
        <path d="M60 12h22l-7 7 7 7H60Z" className="fill-accent" />
      </Pop>
    </Scene>
  )
}

export function Q7MadeScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* award rosette */}
        <rect
          x={46}
          y={62}
          width={12}
          height={32}
          rx={4}
          transform="rotate(14 52 78)"
          className={c.fillDeep}
        />
        <rect
          x={62}
          y={62}
          width={12}
          height={32}
          rx={4}
          transform="rotate(-14 68 78)"
          className={c.fillDeep}
        />
        <circle cx={60} cy={50} r={24} className={c.fill} />
        <circle cx={60} cy={50} r={16} className={c.fillDeep} />
      </Rise>
      <Twinkle>
        <circle cx={60} cy={50} r={8} className="fill-accent" />
      </Twinkle>
    </Scene>
  )
}

export function Q7BetterScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Draw d="M60 94V24M44 38l16-16 16 16" className={c.strokeDeep} strokeWidth={6} />
      <Pop>
        {/* heart riding the up arrow */}
        <path
          d="M60 86C43 74 36 64 36 54c0-8 6-14 13-14 5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 10-7 20-24 32Z"
          className={c.fill}
        />
      </Pop>
    </Scene>
  )
}

export function Q7FiguredScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* padlock */}
        <path
          d="M40 48v-8a12 12 0 0 1 24 0v8"
          fill="none"
          strokeWidth={8}
          className={c.strokeDeep}
        />
        <circle cx={52} cy={66} r={22} className={c.fill} />
        <rect x={49} y={64} width={6} height={12} rx={3} className="fill-background" />
      </Pop>
      <Rise>
        <circle cx={94} cy={66} r={9} fill="none" strokeWidth={6} className={c.strokeDeep} />
        <rect x={72} y={63} width={16} height={6} rx={3} className={c.fillDeep} />
        <rect x={72} y={69} width={5} height={7} rx={2} className={c.fillDeep} />
      </Rise>
      <Twinkle>
        <Spark x={52} y={62} r={6} className="fill-accent" />
      </Twinkle>
    </Scene>
  )
}

export function Q7TraditionScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* candle lighting candle */}
        <rect x={40} y={50} width={18} height={44} rx={5} className={c.fill} />
        <rect x={47.5} y={42} width={3} height={9} rx={1.5} className={c.fillDeep} />
        <rect x={70} y={66} width={14} height={28} rx={5} className={c.fillDeep} />
        <rect x={75.5} y={58} width={3} height={9} rx={1.5} className={c.fill} />
      </Rise>
      <Flicker>
        <path d="M49 28c5 6 7 9 7 12a7 7 0 1 1-14 0c0-3 2-6 7-12Z" className="fill-accent" />
        <path
          d="M77 46c3.5 4.5 5 7 5 9.5a5 5 0 1 1-10 0c0-2.5 1.5-5 5-9.5Z"
          className="fill-accent"
        />
      </Flicker>
    </Scene>
  )
}

export function Q7OwnWayScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      {/* fork in the road */}
      <Draw
        d="M60 98V72M60 72q-4-16-24-24M60 72q4-16 24-24"
        className={c.strokeDeep}
        strokeWidth={6}
      />
      <Pop>
        <circle cx={36} cy={48} r={5} className={c.fillDeep} />
      </Pop>
      <Twinkle>
        <Spark x={86} y={44} r={9} className="fill-accent" />
      </Twinkle>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// Q8 — "Would you rather learn..."
// ---------------------------------------------------------------------------

export function Q8FireScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* crossed logs */}
        <rect
          x={34}
          y={80}
          width={52}
          height={10}
          rx={5}
          transform="rotate(12 60 85)"
          className={c.fillDeep}
        />
        <rect
          x={34}
          y={80}
          width={52}
          height={10}
          rx={5}
          transform="rotate(-12 60 85)"
          className={c.fill}
        />
      </Rise>
      <Flicker>
        <path
          d="M60 26c12 14 18 24 18 33a18 18 0 1 1-36 0c0-9 6-19 18-33Z"
          className="fill-accent"
        />
        <path d="M60 48c6 7 9 12 9 16a9 9 0 1 1-18 0c0-4 3-9 9-16Z" className="fill-accent-deep" />
      </Flicker>
    </Scene>
  )
}

export function Q8EditScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* clapperboard */}
        <rect x={32} y={48} width={56} height={42} rx={6} className={c.fill} />
        <rect
          x={30}
          y={34}
          width={58}
          height={14}
          rx={4}
          transform="rotate(-8 34 41)"
          className={c.fillDeep}
        />
        <path
          d="M42 34l-6 12M58 33l-6 12M74 32l-6 12"
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          transform="rotate(-8 34 41)"
          className="stroke-white"
        />
        <path d="M54 60l16 9-16 9Z" className="fill-background" />
      </Rise>
      <Twinkle>
        <Spark x={98} y={28} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q8EventScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* admission ticket */}
        <g transform="rotate(-5 60 62)">
          <rect x={26} y={46} width={68} height={34} rx={8} className={c.fill} />
          <circle cx={26} cy={63} r={6} className="fill-background" />
          <circle cx={94} cy={63} r={6} className="fill-background" />
          <path
            d="M74 51v5M74 61v5M74 71v5"
            fill="none"
            strokeWidth={4}
            strokeLinecap="round"
            className="stroke-white"
          />
          <path
            d="M50 72c-7-5-10-8.5-10-12 0-3 2.3-5.3 5.3-5.3 1.8 0 3.7 1 4.7 2.7 1-1.7 2.9-2.7 4.7-2.7 3 0 5.3 2.3 5.3 5.3 0 3.5-3 7-10 12Z"
            className="fill-background"
          />
        </g>
      </Rise>
      <Twinkle>
        <Spark x={98} y={30} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q8HowScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* interlocking gears */}
        <rect x={44} y={30} width={8} height={44} rx={3} className={c.fill} />
        <rect x={26} y={48} width={44} height={8} rx={3} className={c.fill} />
        <rect
          x={44}
          y={30}
          width={8}
          height={44}
          rx={3}
          transform="rotate(45 48 52)"
          className={c.fill}
        />
        <circle cx={48} cy={52} r={16} className={c.fill} />
        <circle cx={48} cy={52} r={6} className="fill-background" />
      </Pop>
      <Pop>
        <rect x={77} y={60} width={6} height={30} rx={2.5} className="fill-accent" />
        <rect x={65} y={72} width={30} height={6} rx={2.5} className="fill-accent" />
        <circle cx={80} cy={75} r={11} className="fill-accent" />
        <circle cx={80} cy={75} r={4} className="fill-background" />
      </Pop>
    </Scene>
  )
}

export function Q8RecipeScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* recipe card */}
        <rect x={24} y={36} width={48} height={52} rx={6} className={c.fill} />
      </Rise>
      <Draw d="M32 48h28M32 58h24M32 68h18" className="stroke-white" strokeWidth={5} />
      <Pop>
        {/* stew pot */}
        <rect x={78} y={66} width={28} height={20} rx={7} className={c.fillDeep} />
        <rect x={75} y={62} width={34} height={6} rx={3} className={c.fill} />
      </Pop>
      <Draw d="M88 54q-3-7 0-13M96 54q3-7 0-13" className={c.strokeDeep} strokeWidth={4} />
    </Scene>
  )
}

export function Q8RandomScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* tumbling dice */}
        <g transform="rotate(-12 48 54)">
          <rect x={33} y={39} width={30} height={30} rx={7} className={c.fill} />
          <circle cx={40} cy={46} r={3} className="fill-background" />
          <circle cx={48} cy={54} r={3} className="fill-background" />
          <circle cx={56} cy={62} r={3} className="fill-background" />
        </g>
        <g transform="rotate(14 78 76)">
          <rect x={65} y={63} width={26} height={26} rx={6} className={c.fillDeep} />
          <circle cx={72} cy={70} r={3} className="fill-background" />
          <circle cx={84} cy={82} r={3} className="fill-background" />
        </g>
      </Pop>
      <Twinkle>
        <Spark x={94} y={32} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// Q9 — "What story do you want people to tell about your big day?"
// ---------------------------------------------------------------------------

export function Q9AdventurousScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Draw d="M52 80q-26 14-30-6t24-30q20-8 36 4" className={c.strokeDeep} strokeWidth={5} />
      <Pop>
        {/* carabiner */}
        <rect
          x={46}
          y={32}
          width={32}
          height={50}
          rx={15}
          fill="none"
          strokeWidth={9}
          className={c.stroke}
        />
        <path
          d="M78 48v20"
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          className={c.strokeDeep}
        />
      </Pop>
      <Twinkle>
        <Spark x={98} y={86} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q9UnforgettableScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      {/* firework burst */}
      <Draw
        d="M58 40V22M70 46l13-13M74 58h18M70 70l13 13M46 46 33 33M42 58H24M46 70 33 83M58 76v18"
        className={c.strokeDeep}
        strokeWidth={5}
      />
      <Pop>
        <circle cx={88} cy={28} r={4} className={c.fillDeep} />
        <circle cx={28} cy={88} r={4} className={c.fillDeep} />
        <circle cx={98} cy={58} r={4} className={c.fillDeep} />
      </Pop>
      <Twinkle duration={1.6}>
        <circle cx={58} cy={58} r={9} className="fill-accent" />
      </Twinkle>
    </Scene>
  )
}

export function Q9DifferenceScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Draw d="M60 82v8M60 84l-11 9M60 84l11 9" className={c.strokeDeep} strokeWidth={4} />
      <Rise>
        {/* young tree with heart crown */}
        <rect x={56} y={56} width={8} height={24} rx={3} className={c.fillDeep} />
        <path
          d="M60 62C45 51 39 43 39 35c0-7 5-12 12-12 4 0 7 2 9 6 2-4 5-6 9-6 7 0 12 5 12 12 0 8-6 16-21 27Z"
          className={c.fill}
        />
        <rect x={22} y={78} width={76} height={5} rx={2.5} className={c.fillDeep} />
      </Rise>
      <Twinkle>
        <Spark x={94} y={30} r={5} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q9TaughtScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* graduation cap */}
        <path d="M44 56v14c0 4 8 8 16 8s16-4 16-8V56l-16 7Z" className={c.fillDeep} />
        <path d="M60 34 98 50 60 66 22 50Z" className={c.fill} />
        <circle cx={96} cy={50} r={3.5} className={c.fillDeep} />
      </Rise>
      <Bob distance={3}>
        <rect x={94.5} y={50} width={3} height={17} rx={1.5} className="fill-accent" />
        <circle cx={96} cy={71} r={5} className="fill-accent" />
      </Bob>
    </Scene>
  )
}

export function Q9FamilyScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* family around the table */}
        <circle cx={42} cy={60} r={12} className={c.fill} />
        <circle cx={78} cy={60} r={12} className={c.fill} />
        <circle cx={60} cy={54} r={13} className={c.fillDeep} />
        <ellipse cx={60} cy={82} rx={33} ry={11} className={c.fillDeep} />
      </Rise>
      <Bob distance={2.5}>
        <path
          d="M60 34c-6-4.5-9-8-9-11.5 0-3 2.2-5 5-5 1.6 0 3.2.8 4 2.4.8-1.6 2.4-2.4 4-2.4 2.8 0 5 2 5 5 0 3.5-3 7-9 11.5Z"
          className="fill-accent-deep"
        />
      </Bob>
    </Scene>
  )
}

export function Q9SurpriseScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* gift box */}
        <rect x={42} y={60} width={36} height={30} rx={5} className={c.fill} />
        <rect x={57} y={60} width={6} height={30} className="fill-background" />
      </Rise>
      <Pop>
        <rect
          x={38}
          y={48}
          width={44}
          height={11}
          rx={5}
          transform="rotate(-14 60 53)"
          className={c.fillDeep}
        />
      </Pop>
      <Twinkle>
        <Spark x={46} y={34} r={5} className="fill-accent-deep" />
        <Spark x={78} y={26} r={7} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

// ---------------------------------------------------------------------------
// Q10 — "When a project is done, the best part is..."
// ---------------------------------------------------------------------------

export function Q10OutsideScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* sunrise */}
        <path d="M36 74a24 24 0 0 1 48 0Z" className="fill-accent" />
      </Rise>
      <Draw
        d="M60 40V26M38 48 28 38M82 48l10-10M30 66H14M90 66h16"
        className={c.strokeDeep}
        strokeWidth={5}
      />
      <Rise>
        <path d="M6 88q26-16 54-11t54 11v18H6Z" className={c.fill} />
        <path d="M2 98q30-12 58-7t58 7v12H2Z" className={c.fillDeep} />
      </Rise>
    </Scene>
  )
}

export function Q10ShowScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* spotlight beam */}
        <path d="M56 4 30 46h56Z" className={cn('fill-accent', 'opacity-30')} />
      </Pop>
      <Draw d="M42 64 34 96M78 64l8 32M60 70V96" className={c.strokeDeep} strokeWidth={5} />
      <Rise>
        {/* easel canvas */}
        <rect x={36} y={30} width={48} height={38} rx={4} className={c.fill} />
        <rect x={42} y={36} width={36} height={26} rx={2} className="fill-background" />
        <path
          d="M48 56q8-14 15-6t14-4"
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
          className={c.stroke}
        />
        <rect x={32} y={68} width={56} height={5} rx={2.5} className={c.fillDeep} />
      </Rise>
    </Scene>
  )
}

export function Q10HelpedScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* side hug */}
        <g transform="rotate(8 48 72)">
          <rect x={36} y={58} width={24} height={38} rx={12} className={c.fill} />
          <circle cx={48} cy={48} r={11} className={c.fill} />
        </g>
        <g transform="rotate(-8 74 72)">
          <rect x={62} y={58} width={24} height={38} rx={12} className={c.fillDeep} />
          <circle cx={74} cy={48} r={11} className={c.fillDeep} />
        </g>
      </Rise>
      <Bob distance={2.5}>
        <path
          d="M61 32c-6-4.5-9-8-9-11.5 0-3 2.2-5 5-5 1.6 0 3.2.8 4 2.4.8-1.6 2.4-2.4 4-2.4 2.8 0 5 2 5 5 0 3.5-3 7-9 11.5Z"
          className="fill-accent-deep"
        />
      </Bob>
    </Scene>
  )
}

export function Q10UnderstandingScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* thought chain */}
        <circle cx={32} cy={90} r={5} className={c.fillDeep} />
        <circle cx={43} cy={74} r={7} className={c.fill} />
        <circle cx={55} cy={56} r={9} className={c.fillDeep} />
      </Pop>
      <Twinkle>
        <circle cx={74} cy={36} r={15} className="fill-accent" />
        <rect x={68} y={50} width={12} height={8} rx={3} className={c.fill} />
        <rect x={70} y={60} width={8} height={5} rx={2.5} className={c.fillDeep} />
      </Twinkle>
    </Scene>
  )
}

export function Q10TableScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* shared table */}
        <ellipse cx={60} cy={76} rx={36} ry={20} className={c.fillDeep} />
        <ellipse cx={60} cy={70} rx={36} ry={18} className={c.fill} />
        <ellipse cx={36} cy={76} rx={7} ry={4} className="fill-background" />
        <ellipse cx={84} cy={76} rx={7} ry={4} className="fill-background" />
        <ellipse cx={60} cy={65} rx={15} ry={8} className="fill-background" />
        <ellipse cx={60} cy={63} rx={9} ry={5} className="fill-accent" />
      </Rise>
      <Draw d="M54 52q-3-6 0-12M66 52q3-6 0-12" className={c.strokeDeep} strokeWidth={4} />
    </Scene>
  )
}

export function Q10YourWayScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* hill with flag */}
        <path d="M54 70q28-26 56 0v28H54Z" className={c.fill} />
        <rect x={80} y={28} width={3} height={22} rx={1.5} className={c.fillDeep} />
        <path d="M83 28h16l-5 6 5 6H83Z" className="fill-accent" />
      </Rise>
      <Draw d="M16 98q28 0 34-16t20-22q8-6 10-9" className={c.strokeDeep} strokeWidth={6} />
      <Twinkle>
        <Spark x={30} y={36} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}
