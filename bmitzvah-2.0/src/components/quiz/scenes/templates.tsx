import {
  Blob,
  Bob,
  Draw,
  Flicker,
  Ground,
  HUE_CLASSES,
  Pop,
  Rise,
  Scene,
  type SceneProps,
  Spark,
  Twinkle,
} from '@/components/quiz/scene-kit'
import { cn } from '@/lib/utils'

// One signature scene per journey template: used on the quiz results cards,
// the intro hero, and the post-quiz guides step. Slightly richer than the
// answer scenes (3-4 parts), same style contract.

export function IntoTheWildTemplateScene({ className }: SceneProps) {
  const c = HUE_CLASSES.wild
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-15')} />
      </Pop>
      <Rise>
        {/* mountains */}
        <path d="M14 92 44 40l18 30 10-14 24 36Z" className={c.fill} />
        <path d="M44 40l8 14-8 5-8-5Z" className="fill-background" />
      </Rise>
      <Twinkle>
        <circle cx={92} cy={30} r={10} className="fill-accent" />
      </Twinkle>
      <Draw d="M22 96q20-8 38-4t38-2" className={c.strokeDeep} strokeWidth={5} />
    </Scene>
  )
}

export function MakeSomethingRealTemplateScene({ className }: SceneProps) {
  const c = HUE_CLASSES.real
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-15')} />
      </Pop>
      <Rise>
        {/* easel + canvas */}
        <rect x={34} y={30} width={52} height={40} rx={6} className="fill-background" />
        <rect
          x={34}
          y={30}
          width={52}
          height={40}
          rx={6}
          fill="none"
          strokeWidth={6}
          className={c.stroke}
        />
        <path
          d="M44 74 36 94M76 74l8 20M60 70v22"
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          className={c.strokeDeep}
        />
      </Rise>
      <Pop>
        {/* paint splat */}
        <circle cx={52} cy={46} r={8} className={c.fill} />
        <circle cx={68} cy={54} r={5} className="fill-accent" />
      </Pop>
      <Twinkle>
        <Spark x={96} y={26} r={7} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function MakeADifferenceTemplateScene({ className }: SceneProps) {
  const c = HUE_CLASSES.diff
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-15')} />
      </Pop>
      <Pop>
        <Ground className={cn(c.fill, 'opacity-35')} />
      </Pop>
      <Draw d="M60 92V56" className={c.strokeDeep} strokeWidth={6} />
      <Rise>
        {/* sprout with heart leaves */}
        <path d="M60 58c-2-12-10-18-22-18 2 12 10 18 22 18Z" className={c.fill} />
        <path d="M60 46c2-10 9-15 19-15-2 10-9 15-19 15Z" className={c.fillDeep} />
      </Rise>
      <Bob distance={2.5}>
        <path
          d="M60 34c-6-5-9-8-9-11 0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5 0 3-3 6-9 11Z"
          className="fill-accent"
        />
      </Bob>
    </Scene>
  )
}

export function MindAndMeaningTemplateScene({ className }: SceneProps) {
  const c = HUE_CLASSES.mind
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={3} className={cn(c.fill, 'opacity-15')} />
      </Pop>
      <Rise>
        {/* open book */}
        <path d="M24 78V42q18-8 36 0 18-8 36 0v36q-18-8-36 0-18-8-36 0Z" className={c.fill} />
        <path d="M60 42v36" fill="none" strokeWidth={4} className="stroke-white" />
      </Rise>
      <Bob distance={3}>
        {/* orbiting planet */}
        <circle cx={88} cy={30} r={9} className={c.fillDeep} />
        <ellipse cx={88} cy={30} rx={16} ry={5} fill="none" strokeWidth={3} className={c.stroke} />
      </Bob>
      <Twinkle delay={0.5}>
        <Spark x={30} y={26} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function RootsAndRitualsTemplateScene({ className }: SceneProps) {
  const c = HUE_CLASSES.roots
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={0} className={cn(c.fill, 'opacity-15')} />
      </Pop>
      <Pop>
        {/* table */}
        <rect x={22} y={78} width={76} height={10} rx={5} className={c.fillDeep} />
      </Pop>
      <Rise>
        {/* two candles */}
        <rect x={40} y={48} width={10} height={30} rx={4} className={c.fill} />
        <rect x={70} y={48} width={10} height={30} rx={4} className={c.fill} />
      </Rise>
      <Flicker>
        <path d="M45 32c4 5 5 8 5 11a5 5 0 1 1-10 0c0-3 1-6 5-11Z" className="fill-accent" />
        <path d="M75 32c4 5 5 8 5 11a5 5 0 1 1-10 0c0-3 1-6 5-11Z" className="fill-accent" />
      </Flicker>
      <Draw d="M56 66q4-6 8 0" className={c.strokeDeep} strokeWidth={4} />
    </Scene>
  )
}

// The results-suspense moment: a drum mid-roll, sticks alternating.
export function DrumrollScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={2} className={cn(c.fill, 'opacity-15')} />
      </Pop>
      <Bob distance={4} duration={0.5}>
        <rect
          x={22}
          y={26}
          width={34}
          height={8}
          rx={4}
          transform="rotate(24 39 30)"
          className={c.fillDeep}
        />
      </Bob>
      <Bob distance={4} duration={0.62}>
        <rect
          x={64}
          y={26}
          width={34}
          height={8}
          rx={4}
          transform="rotate(-24 81 30)"
          className={c.fillDeep}
        />
      </Bob>
      <Rise>
        {/* drum */}
        <rect x={32} y={52} width={56} height={34} rx={8} className={c.fill} />
        <ellipse cx={60} cy={52} rx={28} ry={10} className="fill-accent" />
        <path
          d="M40 60l12 18M64 58l14 20M52 60 40 78M88 60 74 78"
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-white"
        />
      </Rise>
      <Twinkle>
        <Spark x={100} y={40} r={6} className="fill-accent-deep" />
      </Twinkle>
    </Scene>
  )
}

export function MyOwnPathTemplateScene({ className }: SceneProps) {
  const c = HUE_CLASSES.path
  return (
    <Scene className={className}>
      <Pop>
        <Blob variant={1} className={cn(c.fill, 'opacity-15')} />
      </Pop>
      <Pop>
        <Ground y={88} className={cn(c.fill, 'opacity-35')} />
      </Pop>
      <Draw d="M26 96q20-10 12-24t14-26q16-8 26-20" className={c.strokeDeep} strokeWidth={6} />
      <Twinkle>
        <Spark x={86} y={20} r={10} className="fill-accent" />
      </Twinkle>
      <Pop>
        <Spark x={34} y={44} r={5} className={c.fill} />
      </Pop>
    </Scene>
  )
}
