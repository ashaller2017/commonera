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

// Mini scenes for the pick-3 words question. One focal motif each, hue keyed
// to the word's dominant journey. Kept simpler than the big answer scenes:
// blob ground + one object + one accent.

export function AdventurousScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* compass */}
        <circle cx={60} cy={62} r={30} className={c.fill} />
        <circle cx={60} cy={62} r={22} className="fill-background" />
        <path d="M60 44l7 18-7-5-7 5Z" className={c.fillDeep} />
        <path d="M60 80l-7-18 7 5 7-5Z" className={cn(c.fill, 'opacity-50')} />
      </Pop>
      <Twinkle>
        <Spark x={96} y={28} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function WildScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* pine */}
        <path d="M60 22 82 58H70l14 24H36l14-24H38Z" className={c.fill} />
        <path d="M60 34 74 58H64l10 18H46l10-18H46Z" className={c.fillDeep} />
        <rect x={55} y={82} width={10} height={14} rx={4} className={c.fillDeep} />
      </Rise>
      <Twinkle delay={0.4}>
        <Spark x={28} y={34} r={5} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function CreativeScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* palette */}
        <path
          d="M60 34c20 0 34 12 34 26 0 10-8 14-16 14-6 0-8 4-8 8 0 5-4 8-10 8-18 0-32-14-32-28s14-28 32-28Z"
          className={c.fill}
        />
        <circle cx={48} cy={54} r={5} className="fill-background" />
        <circle cx={66} cy={48} r={5} className="fill-accent" />
        <circle cx={42} cy={70} r={5} className={c.fillDeep} />
      </Pop>
      <Draw d={squigglePath(70, 24, 28)} className={c.strokeDeep} strokeWidth={5} />
    </Scene>
  )
}

export function FunnyScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* laughing face */}
        <circle cx={60} cy={60} r={30} className={c.fill} />
        <path
          d="M46 54q4-6 8 0"
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
          className="stroke-white"
        />
        <path
          d="M66 54q4-6 8 0"
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
          className="stroke-white"
        />
        <path d="M44 66q16 18 32 0Z" className="fill-background" />
      </Pop>
      <Twinkle>
        <Spark x={94} y={32} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function CaringScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        <path
          d="M60 88C38 72 28 60 28 47c0-10 8-17 17-17 6 0 12 3 15 9 3-6 9-9 15-9 9 0 17 7 17 17 0 13-10 25-32 41Z"
          className={c.fill}
        />
      </Pop>
      <Bob distance={2.5}>
        <path
          d="M88 30c-5-4-8-7-8-10 0-3 2-5 5-5 1 0 3 1 3 2 0-1 2-2 3-2 3 0 5 2 5 5 0 3-3 6-8 10Z"
          className={c.fillDeep}
        />
      </Bob>
    </Scene>
  )
}

export function OrganizedScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* clipboard */}
        <rect x={36} y={28} width={48} height={64} rx={8} className={c.fill} />
        <rect x={50} y={22} width={20} height={12} rx={5} className={c.fillDeep} />
      </Rise>
      <Draw d="M46 48h20" className="stroke-white" strokeWidth={5} />
      <Draw d="M46 62h28" className="stroke-white" strokeWidth={5} />
      <Draw d="M46 76l5 5 10-10" className="stroke-white" strokeWidth={5} />
    </Scene>
  )
}

export function CuriousScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Draw d="M24 88q14-10 24-8" className={cn(c.strokeDeep, 'opacity-50')} strokeWidth={4} />
      <Pop>
        {/* magnifier */}
        <circle cx={64} cy={52} r={22} className={c.fill} />
        <circle cx={64} cy={52} r={14} className="fill-background" />
        <rect
          x={76}
          y={66}
          width={10}
          height={26}
          rx={5}
          transform="rotate(-45 81 79)"
          className={c.fillDeep}
        />
      </Pop>
      <Twinkle>
        <Spark x={60} y={48} r={5} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function ThoughtfulScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* lightbulb */}
        <circle cx={60} cy={52} r={22} className="fill-accent" />
        <rect x={52} y={72} width={16} height={10} rx={3} className={c.fill} />
        <rect x={54} y={84} width={12} height={6} rx={3} className={c.fillDeep} />
      </Rise>
      <Draw d="M60 18v-6M84 28l5-5M36 28l-5-5" className={c.strokeDeep} strokeWidth={5} />
    </Scene>
  )
}

export function CozyScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        <rect x={48} y={50} width={24} height={44} rx={8} className={c.fill} />
        <rect x={58} y={40} width={4} height={12} rx={2} className={c.fillDeep} />
      </Rise>
      <Flicker>
        <path d="M60 24c6 7 8 11 8 15a8 8 0 1 1-16 0c0-4 2-8 8-15Z" className="fill-accent" />
      </Flicker>
    </Scene>
  )
}

export function LoyalScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Pop>
        {/* linked rings */}
        <circle cx={48} cy={60} r={18} fill="none" strokeWidth={9} className={c.stroke} />
        <circle cx={72} cy={60} r={18} fill="none" strokeWidth={9} className={c.strokeDeep} />
      </Pop>
      <Twinkle>
        <Spark x={60} y={26} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function DreamerScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Bob>
        <path
          d="M36 66a14 14 0 0 1 4-27 18 18 0 0 1 34-4 13 13 0 0 1 10 24 12 12 0 0 1-6 7Z"
          className={c.fill}
        />
      </Bob>
      <Twinkle>
        <Spark x={88} y={78} r={7} className="fill-accent-deep" />
      </Twinkle>
      <Pop>
        <Spark x={30} y={86} r={4} className={c.fillDeep} />
      </Pop>
    </Scene>
  )
}

export function BoldScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-20')} />
      </Pop>
      <Rise>
        {/* rocket */}
        <path
          d="M60 18c10 8 14 20 14 32 0 8-2 16-6 22H52c-4-6-6-14-6-22 0-12 4-24 14-32Z"
          className={c.fill}
        />
        <circle cx={60} cy={46} r={7} className="fill-background" />
        <path d="M46 60l-10 14 12-2Z" className={c.fillDeep} />
        <path d="M74 60l10 14-12-2Z" className={c.fillDeep} />
      </Rise>
      <Flicker>
        <path d="M60 76c4 6 4 12 0 18-4-6-4-12 0-18Z" className="fill-accent" />
      </Flicker>
    </Scene>
  )
}
