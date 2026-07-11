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

// Answer scenes for quiz questions Q2-Q5 (free Saturday, weekend trip, taking
// the lead, after-school club). One focal motif per option, hue-keyed.

// Chunky heart with its point at (x, y); s scales the ~16x15 base shape.
function heart(x: number, y: number, s = 1): string {
  return `M${x} ${y}c${-5 * s} ${-4 * s} ${-8 * s} ${-7 * s} ${-8 * s} ${-10 * s}c0 ${-3 * s} ${2 * s} ${-5 * s} ${5 * s} ${-5 * s}c${s} 0 ${3 * s} ${s} ${3 * s} ${2 * s}c0 ${-s} ${2 * s} ${-2 * s} ${3 * s} ${-2 * s}c${3 * s} 0 ${5 * s} ${2 * s} ${5 * s} ${5 * s}c0 ${3 * s} ${-3 * s} ${6 * s} ${-8 * s} ${10 * s}Z`
}

// --- Q2: it's a free Saturday with zero plans --------------------------------

export function Q2OutsideScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Draw
        d="M20 100q20-12 32-8t24-8"
        className={cn(c.strokeDeep, 'opacity-60')}
        strokeWidth={5}
      />
      <Rise>
        {/* small pine at the trail's end */}
        <path d="M78 30 94 56h-8l10 18H62l10-18h-8Z" className={c.fill} />
        <rect x={74} y={74} width={8} height={12} rx={3} className={c.fillDeep} />
      </Rise>
      <Twinkle>
        <circle cx={28} cy={28} r={10} className="fill-accent" />
      </Twinkle>
    </Scene>
  )
}

export function Q2MakeScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* workbench with a stray bolt */}
        <rect x={26} y={72} width={68} height={10} rx={4} className={c.fill} />
        <rect x={32} y={82} width={8} height={14} rx={3} className={c.fillDeep} />
        <rect x={80} y={82} width={8} height={14} rx={3} className={c.fillDeep} />
        <circle cx={40} cy={66} r={4} className={c.fillDeep} />
      </Rise>
      <Pop>
        {/* hammer leaning on the bench */}
        <g transform="rotate(18 64 52)">
          <rect x={60} y={34} width={8} height={40} rx={4} className={c.fillDeep} />
          <rect x={50} y={26} width={28} height={12} rx={5} className={c.fill} />
        </g>
      </Pop>
      <Twinkle>
        <Spark x={96} y={32} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q2HelpScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* two open hands */}
        <rect
          x={22}
          y={72}
          width={28}
          height={16}
          rx={8}
          transform="rotate(24 36 80)"
          className={c.fill}
        />
        <rect
          x={70}
          y={72}
          width={28}
          height={16}
          rx={8}
          transform="rotate(-24 84 80)"
          className={c.fill}
        />
        <rect x={20} y={88} width={14} height={10} rx={4} className={c.fillDeep} />
        <rect x={86} y={88} width={14} height={10} rx={4} className={c.fillDeep} />
      </Rise>
      <Bob distance={2.5}>
        <path d={heart(60, 60, 1.8)} className={c.fillDeep} />
      </Bob>
    </Scene>
  )
}

export function Q2RabbitHoleScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* book stack, the top one open */}
        <rect x={34} y={80} width={52} height={11} rx={5} className={c.fill} />
        <rect x={38} y={67} width={44} height={11} rx={5} className={c.fillDeep} />
        <path d="M60 50q-14-8-27 1l3 15q11-7 24-2Z" className={c.fill} />
        <path d="M60 50q14-8 27 1l-3 15q-11-7-24-2Z" className={c.fillDeep} />
      </Rise>
      <Twinkle>
        <Spark x={92} y={32} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q2CookScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* pot on the stove */}
        <rect x={38} y={58} width={44} height={28} rx={8} className={c.fill} />
        <rect x={32} y={50} width={56} height={9} rx={4.5} className={c.fillDeep} />
        <circle cx={60} cy={46} r={4} className={c.fillDeep} />
        <rect x={26} y={90} width={68} height={6} rx={3} className={cn(c.fillDeep, 'opacity-50')} />
      </Rise>
      <Draw
        d={squigglePath(42, 38, 18) + squigglePath(58, 30, 18)}
        className={c.strokeDeep}
        strokeWidth={4}
      />
    </Scene>
  )
}

export function Q2MixScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* three mixer sliders */}
        <rect x={38} y={32} width={6} height={54} rx={3} className={cn(c.fill, 'opacity-40')} />
        <rect x={58} y={32} width={6} height={54} rx={3} className={cn(c.fill, 'opacity-40')} />
        <rect x={78} y={32} width={6} height={54} rx={3} className={cn(c.fill, 'opacity-40')} />
      </Rise>
      <Pop>
        <circle cx={41} cy={46} r={8} className={c.fillDeep} />
        <circle cx={61} cy={70} r={8} className="fill-accent" />
        <circle cx={81} cy={56} r={8} className={c.fill} />
      </Pop>
    </Scene>
  )
}

// --- Q3: which weekend trip would you say yes to first? ----------------------

export function Q3CampingScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* tent */}
        <path d="M48 28 82 90H14Z" className={c.fill} />
        <path d="M48 56 62 90H34Z" className="fill-background" />
      </Rise>
      <Pop>
        <rect x={84} y={88} width={22} height={5} rx={2.5} className={c.fillDeep} />
      </Pop>
      <Flicker>
        <path d="M95 62c6 7 8 11 8 15a8 8 0 1 1-16 0c0-4 2-8 8-15Z" className="fill-accent" />
      </Flicker>
    </Scene>
  )
}

export function Q3BackstageScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* curtains parting */}
        <rect x={18} y={18} width={84} height={9} rx={4.5} className={c.fillDeep} />
        <path d="M24 27h22q4 34-4 68l-20 3q10-36 2-71Z" className={c.fill} />
        <path d="M96 27H74q-4 34 4 68l20 3q-10-36-2-71Z" className={c.fill} />
      </Rise>
      <Twinkle>
        <circle cx={60} cy={66} r={15} className="fill-accent" />
      </Twinkle>
    </Scene>
  )
}

export function Q3VolunteeringScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* open donation box */}
        <rect x={36} y={62} width={48} height={28} rx={5} className={c.fill} />
        <path d="M36 62 22 50l14-3Z" className={c.fillDeep} />
        <path d="M84 62l14-12-14-3Z" className={c.fillDeep} />
      </Rise>
      <Bob distance={3}>
        <path d={heart(60, 54, 1.8)} className={c.fillDeep} />
      </Bob>
    </Scene>
  )
}

export function Q3ScienceScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* telescope on its tripod */}
        <path
          d="M58 60 42 94M66 60 82 94"
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          className={c.strokeDeep}
        />
        <rect
          x={38}
          y={42}
          width={48}
          height={14}
          rx={7}
          transform="rotate(-24 62 49)"
          className={c.fill}
        />
        <circle cx={42} cy={60} r={6} className={c.fillDeep} />
      </Pop>
      <Twinkle>
        <Spark x={96} y={24} r={7} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q3RelativesScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* two photo frames */}
        <g transform="rotate(-7 46 56)">
          <rect x={29} y={35} width={34} height={42} rx={5} className={c.fill} />
          <rect x={35} y={41} width={22} height={30} rx={3} className="fill-background" />
        </g>
        <g transform="rotate(7 74 66)">
          <rect x={57} y={45} width={34} height={42} rx={5} className={c.fillDeep} />
          <rect x={63} y={51} width={22} height={30} rx={3} className="fill-background" />
        </g>
      </Pop>
      <Bob distance={2}>
        <path d={heart(94, 34, 1.1)} className="fill-accent-deep" />
      </Bob>
    </Scene>
  )
}

export function Q3PlanOwnScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* unfolded zigzag map */}
        <path d="M24 34l24-8 24 8 24-8v58l-24 8-24-8-24 8Z" className={c.fill} />
        <path d="M48 26v58l24 8V34Z" className={cn(c.fillDeep, 'opacity-40')} />
      </Pop>
      <Draw d="M32 78q12-14 26-8t24-24" className="stroke-white" strokeWidth={5} />
      <Pop>
        <path
          d="M82 30a9 9 0 0 1 9 9c0 6-9 15-9 15s-9-9-9-15a9 9 0 0 1 9-9Z"
          className="fill-accent-deep"
        />
        <circle cx={82} cy={39} r={3.5} className="fill-background" />
      </Pop>
    </Scene>
  )
}

// --- Q4: your friend group needs someone to take the lead --------------------

export function Q4OrganizeScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* megaphone */}
        <rect x={26} y={50} width={12} height={20} rx={5} className={c.fillDeep} />
        <path d="M36 54 74 38v44L36 66Z" className={c.fill} />
        <rect x={46} y={68} width={9} height={18} rx={4} className={c.fillDeep} />
      </Pop>
      <Draw d="M82 46q10 12 0 26M92 40q16 18 0 38" className={c.strokeDeep} strokeWidth={5} />
      <Twinkle>
        <Spark x={28} y={30} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q4IdeaScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* lightbulb moment */}
        <circle cx={58} cy={50} r={21} className="fill-accent" />
        <rect x={49} y={69} width={18} height={9} rx={3} className={c.fill} />
        <rect x={53} y={80} width={10} height={6} rx={3} className={c.fillDeep} />
      </Rise>
      <Draw d="M58 22v-10M84 30l7-7M32 30l-7-7" className={c.strokeDeep} strokeWidth={5} />
      <Pop>
        <Spark x={92} y={72} r={6} className={c.fillDeep} />
      </Pop>
    </Scene>
  )
}

export function Q4ResearchScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* open book */}
        <path d="M60 48q-18-9-34 0v30q16-9 34 0 18-9 34 0V48q-16-9-34 0Z" className={c.fill} />
        <path
          d="M60 50v28"
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-white"
        />
      </Rise>
      <Pop>
        {/* magnifier resting on the pages */}
        <circle cx={72} cy={44} r={14} className={c.fillDeep} />
        <circle cx={72} cy={44} r={8} className="fill-background" />
        <rect
          x={80}
          y={52}
          width={9}
          height={22}
          rx={4.5}
          transform="rotate(-42 84 56)"
          className={c.fillDeep}
        />
      </Pop>
    </Scene>
  )
}

export function Q4IncludeScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* three friends, arms linked */}
        <circle cx={36} cy={68} r={11} className={c.fill} />
        <circle cx={60} cy={62} r={12} className={c.fillDeep} />
        <circle cx={84} cy={68} r={11} className={c.fill} />
        <path
          d="M36 84q12 10 24 0M60 84q12 10 24 0"
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          className={c.strokeDeep}
        />
      </Pop>
      <Bob distance={2.5}>
        <path d={heart(60, 42, 1.4)} className="fill-accent-deep" />
      </Bob>
    </Scene>
  )
}

export function Q4DifferentScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* the two arrows everyone takes */}
        <rect x={24} y={40} width={28} height={8} rx={4} className={cn(c.fill, 'opacity-50')} />
        <path d="M52 36l16 8-16 8Z" className={cn(c.fill, 'opacity-50')} />
        <rect x={24} y={82} width={28} height={8} rx={4} className={cn(c.fill, 'opacity-50')} />
        <path d="M52 78l16 8-16 8Z" className={cn(c.fill, 'opacity-50')} />
      </Rise>
      <Draw d="M24 65h26q16 0 16-18V32" className={c.strokeDeep} strokeWidth={6} />
      <Pop>
        <path d="M66 14l10 17H56Z" className={c.fillDeep} />
      </Pop>
    </Scene>
  )
}

// --- Q5: pick the after-school club you'd actually show up for ---------------

export function Q5OutdoorScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Draw
        d={squigglePath(10, 78, 26)}
        className={cn(c.strokeDeep, 'opacity-60')}
        strokeWidth={4}
      />
      <Rise>
        {/* hiking boot */}
        <path d="M42 42h22v20q20 2 22 20v6H42Z" className={c.fill} />
        <rect x={38} y={86} width={50} height={8} rx={4} className={c.fillDeep} />
        <path
          d="M46 52h12M46 60h12"
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-white"
        />
      </Rise>
      <Twinkle>
        <Spark x={26} y={28} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q5ArtScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* pencil */}
        <g transform="rotate(45 60 58)">
          <rect x={55} y={22} width={10} height={56} rx={3} className={c.fillDeep} />
          <path d="M55 78h10l-5 14Z" className={c.fill} />
        </g>
      </Pop>
      <Pop>
        {/* paintbrush crossing it, drop mid-flick */}
        <g transform="rotate(-45 60 58)">
          <rect x={56} y={24} width={8} height={38} rx={4} className={c.fill} />
          <path d="M54 62h12l-2 16h-8Z" className={c.fillDeep} />
        </g>
        <path d="M88 74c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11Z" className="fill-accent" />
      </Pop>
    </Scene>
  )
}

export function Q5VolunteerScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* globe */}
        <circle cx={60} cy={62} r={26} className={c.fill} />
        <path
          d="M38 54q22-9 44 0M38 70q22 9 44 0"
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-white"
        />
        <ellipse
          cx={60}
          cy={62}
          rx={11}
          ry={26}
          fill="none"
          strokeWidth={4}
          className="stroke-white"
        />
      </Pop>
      <Twinkle>
        <path d={heart(78, 46, 1.2)} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q5DebateScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* speech bubble one */}
        <rect x={18} y={28} width={40} height={24} rx={11} className={c.fill} />
        <path d="M34 50l-4 14 16-10Z" className={c.fill} />
      </Pop>
      <Rise>
        {/* speech bubble two, flipped */}
        <rect x={62} y={66} width={40} height={24} rx={11} className={c.fillDeep} />
        <path d="M86 68l4-14-16 10Z" className={c.fillDeep} />
      </Rise>
      <Twinkle>
        <Spark x={54} y={58} r={7} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function Q5FoodScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* steamed bao on a plate */}
        <ellipse cx={60} cy={88} rx={32} ry={8} className={c.fillDeep} />
        <path d="M34 86a26 24 0 0 1 52 0Z" className={c.fill} />
        <path
          d="M50 68q3 6 1 12M60 64v16M70 68q-3 6-1 12"
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-white"
        />
      </Rise>
      <Draw d={squigglePath(48, 46, 24)} className={c.strokeDeep} strokeWidth={4} />
    </Scene>
  )
}

export function Q5OwnClubScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Draw d="M42 100V22" className={c.strokeDeep} strokeWidth={5} />
      <Pop>
        {/* waving flag */}
        <path
          d="M44 24c10-6 20-6 30 0 6 4 12 4 18 0v22c-6 4-12 4-18 0-10-6-20-6-30 0Z"
          className={c.fill}
        />
      </Pop>
      <Twinkle>
        <Spark x={90} y={78} r={7} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}
