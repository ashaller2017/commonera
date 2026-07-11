import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Heart, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, type Transition, type Variants } from 'motion/react'
import { useEffect, useReducer, useRef, useState } from 'react'
import { FaceCluster, PhotoSnap } from '@/components/photo-snap'
import {
  HUE_CLASSES,
  type Hue,
  SceneTile,
  TEMPLATE_HUE,
  tileEntrance,
  WordToken,
} from '@/components/quiz/scene-kit'
import { sceneEntryFor, TEMPLATE_SCENES, templateScene } from '@/components/quiz/scenes'
import { DrumrollScene, MyOwnPathTemplateScene } from '@/components/quiz/scenes/templates'
import { TemplateChip } from '@/components/template-chip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTemplate, useTemplates } from '@/hooks/use-templates'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import type { QuizQuestion, TemplateKey } from '@/lib/content/types'
import { suggestJourneyNames } from '@/lib/journey/naming'
import { splitByRecommendation } from '@/lib/providers/recommend'
import { type QuizAnswers, recommendTemplates } from '@/lib/quiz/scoring'
import { PATH_VERDICTS } from '@/lib/quiz/verdicts'
import { cn } from '@/lib/utils'
import { fetchOwnSettingsFn } from '@/utils/child-settings.functions'
import { fetchProvidersFn, fetchQuizContentFn } from '@/utils/content.functions'
import {
  createJourneyFn,
  fetchFavoritesFn,
  fetchOwnJourneyFn,
  setFavoriteFn,
} from '@/utils/journeys.functions'

export const Route = createFileRoute('/_authed/kid/quiz')({
  // A journey, once chosen, is permanent: kids with one never see the quiz.
  loader: async () => {
    const journey = await fetchOwnJourneyFn()
    if (journey) throw redirect({ to: '/kid' })
    // settings carries the parent's observance answer (may be unanswered —
    // scoring copes with null); providers + favorites feed the final guides
    // step so it renders without a refetch.
    const [quiz, settings, providers, favorites] = await Promise.all([
      fetchQuizContentFn(),
      fetchOwnSettingsFn(),
      fetchProvidersFn(),
      fetchFavoritesFn(),
    ])
    return { quiz, settings, providers, favorites }
  },
  component: QuizPage,
})

// Ease-out-quart, the house curve (DESIGN.md). Named once so every motion in
// the quiz shares one feel.
const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1]
const STEP_TRANSITION: Transition = { duration: 0.25, ease: EASE_OUT_QUART }

// Step transitions. `custom` carries the navigation direction (1 forward, -1
// back) so a step enters from the side you are heading toward and the outgoing
// one leaves the other way. reducedMotion="user" (set in __root) drops the x
// offset to a plain crossfade when the user asks for less motion.
const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -24 }),
}

// Same slide-fade for the question body, keyed by question index so the header
// (progress bar, counter) stays put and animates while the body swaps. Distinct
// variant names keep the outer section's propagation from driving it twice.
const bodyVariants: Variants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction * 24 }),
  shown: { opacity: 1, x: 0 },
  gone: (direction: number) => ({ opacity: 0, x: direction * -24 }),
}

// Staggered list entrance for the results panels and the name suggestions.
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
}
const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: STEP_TRANSITION },
}

// The "Best match" badge pops in a beat after its panel has settled.
const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: EASE_OUT_QUART, delay: 0.25 } },
}

// One playful beat between questions, keyed by index (deterministic — no
// hidden randomness), sliding in with the question body.
const ENCOURAGEMENTS = [
  'Nice pick.',
  'Ooh, interesting.',
  'Good one.',
  'This is going somewhere.',
  "You're on a roll.",
  'No hesitation. Respect.',
] as const

function encouragementFor(index: number, total: number): string | null {
  if (index === 0) return null
  if (index === total - 1) return 'Last one — make it count.'
  return ENCOURAGEMENTS[(index - 1) % ENCOURAGEMENTS.length] ?? null
}

// The progress counter picks up steam as the kid gets closer to the end.
function progressEmoji(percent: number): string | null {
  if (percent >= 90) return '✨'
  if (percent >= 50) return '🔥'
  return null
}

// One-shot dot burst above the results reveal — the same celebratory language
// as the dashboard's completion banner, tinted by the best-match palette.
const resultsBurst: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const resultsBurstDot: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: EASE_OUT_QUART } },
}
const RESULTS_BURST_KEYS = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'] as const

type QuizState =
  | { readonly step: 'intro' }
  | {
      readonly step: 'question'
      readonly index: number
      readonly answers: QuizAnswers
    }
  | {
      readonly step: 'results'
      readonly answers: QuizAnswers
    }
  | {
      readonly step: 'name'
      readonly template: TemplateKey
      readonly answers: QuizAnswers
    }
  | {
      // The journey exists by this point, so there is no way back: the only
      // exits lead to the dashboard or the full guide directory.
      readonly step: 'guides'
      readonly template: TemplateKey
    }

type QuizAction =
  | { readonly type: 'start' }
  | { readonly type: 'answer-single'; readonly optionId: string }
  | { readonly type: 'toggle-word'; readonly optionId: string }
  | { readonly type: 'continue' }
  | { readonly type: 'back' }
  | { readonly type: 'choose-template'; readonly template: TemplateKey }
  | { readonly type: 'journey-created' }

function quizReducer(
  questions: readonly QuizQuestion[],
  state: QuizState,
  action: QuizAction,
): QuizState {
  switch (action.type) {
    case 'start':
      return state.step === 'intro' ? { step: 'question', index: 0, answers: {} } : state
    case 'answer-single': {
      if (state.step !== 'question') return state
      const question = questions[state.index]
      if (question?.kind !== 'single') return state
      const answers = { ...state.answers, [question.id]: [action.optionId] }
      const nextIndex = state.index + 1
      return nextIndex >= questions.length
        ? { step: 'results', answers }
        : { ...state, index: nextIndex, answers }
    }
    case 'toggle-word': {
      if (state.step !== 'question') return state
      const question = questions[state.index]
      if (question?.kind !== 'words') return state
      const picked = state.answers[question.id] ?? []
      const next = picked.includes(action.optionId)
        ? picked.filter((id) => id !== action.optionId)
        : picked.length < question.pickExactly
          ? [...picked, action.optionId]
          : picked
      return { ...state, answers: { ...state.answers, [question.id]: next } }
    }
    case 'continue': {
      if (state.step !== 'question') return state
      const question = questions[state.index]
      if (question?.kind !== 'words') return state
      if ((state.answers[question.id] ?? []).length !== question.pickExactly) return state
      const nextIndex = state.index + 1
      return nextIndex >= questions.length
        ? { step: 'results', answers: state.answers }
        : { ...state, index: nextIndex }
    }
    case 'back': {
      if (state.step === 'question') {
        return state.index === 0 ? { step: 'intro' } : { ...state, index: state.index - 1 }
      }
      if (state.step === 'results') {
        return { step: 'question', index: questions.length - 1, answers: state.answers }
      }
      if (state.step === 'name') {
        return { step: 'results', answers: state.answers }
      }
      return state
    }
    case 'choose-template':
      return state.step === 'results'
        ? { step: 'name', template: action.template, answers: state.answers }
        : state
    case 'journey-created':
      return state.step === 'name' ? { step: 'guides', template: state.template } : state
    default:
      return state
  }
}

function pickedWords(questions: readonly QuizQuestion[], answers: QuizAnswers): readonly string[] {
  const wordsQuestion = questions.find((q) => q.kind === 'words')
  if (!wordsQuestion) return []
  const picked = answers[wordsQuestion.id] ?? []
  return wordsQuestion.options
    .filter((option) => picked.includes(option.id))
    .map((option) => option.label)
}

type StepProps<S extends QuizState['step']> = {
  state: Extract<QuizState, { step: S }>
  dispatch: React.Dispatch<QuizAction>
  direction: number
}

function QuizPage() {
  const { quiz } = Route.useLoaderData()
  const [state, dispatch] = useReducer(
    (current: QuizState, action: QuizAction) => quizReducer(quiz.questions, current, action),
    { step: 'intro' },
  )
  // Direction lives here, not in the reducer: it is a view concern that tells
  // the step transition which way to slide. Every action moves forward except
  // an explicit Back.
  const [direction, setDirection] = useState(1)
  const navigate = (action: QuizAction) => {
    setDirection(action.type === 'back' ? -1 : 1)
    dispatch(action)
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <QuizBackdrop hue={backdropHueFor(state)} />
      {/* initial={false}: the first paint renders in place (visible by default,
          per DESIGN), only navigation between steps animates. */}
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {state.step === 'intro' ? (
          <IntroStep key="intro" state={state} dispatch={navigate} direction={direction} />
        ) : null}
        {state.step === 'question' ? (
          <QuestionStep key="question" state={state} dispatch={navigate} direction={direction} />
        ) : null}
        {state.step === 'results' ? (
          <ResultsStep key="results" state={state} dispatch={navigate} direction={direction} />
        ) : null}
        {state.step === 'name' ? (
          <NameStep key="name" state={state} dispatch={navigate} direction={direction} />
        ) : null}
        {state.step === 'guides' ? (
          <GuidesStep key="guides" state={state} dispatch={navigate} direction={direction} />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

// The step-level backdrop: two soft color washes that crossfade to the
// current step's hue. Clipped to the column so the page never scrolls
// sideways; purely decorative, so it's hidden from assistive tech.
const HUE_ROTATION: readonly Hue[] = ['wild', 'real', 'diff', 'mind', 'roots', 'path']

function backdropHueFor(state: QuizState): Hue {
  if (state.step === 'question') return HUE_ROTATION[state.index % HUE_ROTATION.length] ?? 'path'
  if (state.step === 'name' || state.step === 'guides') return TEMPLATE_HUE[state.template]
  return 'path'
}

function QuizBackdrop({ hue }: { hue: Hue }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={hue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUART }}
          className="absolute inset-0"
        >
          <div
            className={cn(
              '-top-20 -left-24 absolute size-72 rounded-full opacity-70 blur-3xl',
              HUE_CLASSES[hue].tile,
            )}
          />
          <div
            className={cn(
              '-right-28 absolute top-72 size-80 rounded-full opacity-60 blur-3xl',
              HUE_CLASSES[hue].tile,
            )}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function IntroStep({ dispatch, direction }: StepProps<'intro'>) {
  const { quiz } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const firstName = user.displayName.split(' ')[0] ?? user.displayName
  return (
    <motion.section
      className="flex flex-col gap-8 py-8"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={STEP_TRANSITION}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Real kids mid-journey, dropped like prints on a table, with the
            My Own Path scene tucked in as a sticker. */}
        <div className="relative flex items-end justify-center gap-3 py-2 pr-8">
          <PhotoSnap
            src="/photos/kids-gardening.jpg"
            alt="Two kids planting together on a service project"
            tilt={-5}
            className="h-28 w-24 sm:h-32 sm:w-28"
          />
          <PhotoSnap
            src="/photos/party-lift.jpg"
            alt="A kid lifted on a chair, arms up, mid-celebration"
            tilt={2}
            delay={0.08}
            className="z-10 h-36 w-28 sm:h-40 sm:w-32"
          />
          <PhotoSnap
            src="/photos/workshop.jpg"
            alt="A kid teaching an older adult how to use a phone"
            tilt={6}
            delay={0.16}
            className="h-28 w-24 sm:h-32 sm:w-28"
          />
          <MyOwnPathTemplateScene className="-right-2 -bottom-2 absolute z-20 size-20 sm:size-24" />
        </div>
        <h1 className="font-display-wonk text-5xl font-semibold">
          {firstName}, which journey are you?
        </h1>
        <p className="max-w-md text-muted-foreground">
          Real kids are out there building days like these. {quiz.questions.length} questions figure
          out yours. Zero wrong answers, no grades — go with your gut, it knows.
        </p>
      </div>
      <Button size="lg" onClick={() => dispatch({ type: 'start' })}>
        Let's go
      </Button>
    </motion.section>
  )
}

function QuestionStep({ state, dispatch, direction }: StepProps<'question'>) {
  const { quiz } = Route.useLoaderData()
  const question = quiz.questions[state.index]
  const [pendingOption, setPendingOption] = useState<string | null>(null)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  // Reset the highlight and kill any pending auto-advance whenever the
  // question changes, so tapping Back right after an answer cannot let a stale
  // timer overwrite the previous question's answer.
  // biome-ignore lint/correctness/useExhaustiveDependencies: state.index drives the reset
  useEffect(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
    setPendingOption(null)
  }, [state.index])

  if (!question) return null
  const picked = state.answers[question.id] ?? []
  const progress = Math.round((state.index / quiz.questions.length) * 100)

  return (
    <motion.section
      className="flex flex-col gap-8 py-8"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={STEP_TRANSITION}
    >
      {/* Header stays mounted across questions so the bar can animate its width
          rather than reset on every step. */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Back"
          onClick={() => dispatch({ type: 'back' })}
        >
          <ArrowLeft aria-hidden />
        </Button>
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={state.index}
          aria-valuemin={0}
          aria-valuemax={quiz.questions.length}
          aria-label="Quiz progress"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${Math.max(progress, 4)}%` }}
            transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
          />
        </div>
        <span className="text-sm font-bold text-muted-foreground">
          {progressEmoji(progress) ? (
            <motion.span
              key={progressEmoji(progress)}
              className="mr-1 inline-block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
              aria-hidden
            >
              {progressEmoji(progress)}
            </motion.span>
          ) : null}
          {state.index + 1}/{quiz.questions.length}
        </span>
      </div>

      {/* initial={false}: the body sits still when the whole section first
          slides in, then slide-fades on each question change. */}
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={state.index}
          className="flex flex-col gap-8"
          custom={direction}
          variants={bodyVariants}
          initial="hidden"
          animate="shown"
          exit="gone"
          transition={STEP_TRANSITION}
        >
          <div className="flex flex-col gap-2">
            {encouragementFor(state.index, quiz.questions.length) ? (
              <p className="text-sm font-bold text-primary">
                {encouragementFor(state.index, quiz.questions.length)}
              </p>
            ) : null}
            <h1 className="font-display-wonk text-3xl font-semibold sm:text-4xl">
              {question.prompt}
            </h1>
            {question.helper ? <p className="text-muted-foreground">{question.helper}</p> : null}
            {question.kind === 'words' ? (
              <p className="text-sm font-bold text-primary">
                Pick {question.pickExactly}. You've got {question.pickExactly - picked.length} left.
              </p>
            ) : null}
          </div>

          {question.kind === 'words' ? (
            <motion.div
              className="grid grid-cols-3 gap-2.5 sm:grid-cols-4"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {question.options.map((option, index) => {
                const selected = picked.includes(option.id)
                const { scene, hue } = sceneEntryFor(option.id, option.emoji, index)
                return (
                  <motion.div key={option.id} variants={tileEntrance}>
                    <WordToken
                      scene={scene}
                      hue={hue}
                      label={option.label}
                      selected={selected}
                      onClick={() => dispatch({ type: 'toggle-word', optionId: option.id })}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {question.options.map((option, index) => {
                const selected = pendingOption === option.id || picked.includes(option.id)
                const { scene, hue } = sceneEntryFor(option.id, option.emoji, index)
                return (
                  <SceneTile
                    key={option.id}
                    scene={scene}
                    hue={hue}
                    label={option.label}
                    selected={selected}
                    index={index}
                    disabled={pendingOption !== null && !selected}
                    onClick={() => {
                      if (pendingOption) return
                      setPendingOption(option.id)
                      // A beat longer than the old list rows: the tile pop and
                      // check badge need room to land before the slide.
                      advanceTimer.current = setTimeout(
                        () => dispatch({ type: 'answer-single', optionId: option.id }),
                        340,
                      )
                    }}
                  />
                )
              })}
            </motion.div>
          )}

          {question.kind === 'words' ? (
            <Button
              size="lg"
              disabled={picked.length !== question.pickExactly}
              onClick={() => dispatch({ type: 'continue' })}
            >
              Continue
            </Button>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}

function ResultsStep({ state, dispatch, direction }: StepProps<'results'>) {
  const { quiz, settings, providers } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const firstName = user.displayName.split(' ')[0] ?? user.displayName
  const templates = useTemplates()
  const ranked = recommendTemplates(quiz.questions, state.answers, settings.comfort)
  const recommendedKeys = ranked.map((r) => r.key)
  const rest = templates.filter((t) => !recommendedKeys.includes(t.key))
  // One matched path, personality-quiz style (the tested concept): the top
  // score is THE verdict; the runners-up are close seconds, not co-equals.
  const best = ranked[0]
  const runnersUp = ranked.slice(1)
  const bestPalette = best ? TEMPLATE_PALETTE[best.key] : null
  const bestTemplate = best ? templates.find((t) => t.key === best.key) : null
  const words = pickedWords(quiz.questions, state.answers)
  const matchedGuides = best
    ? splitByRecommendation(providers, [best.key]).recommended.slice(0, 2)
    : []

  // A beat of suspense before the reveal: long enough to feel like the quiz is
  // thinking, short enough that nobody reaches for the reload button.
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (!revealed) {
    return (
      <motion.section
        key="reading"
        className="flex flex-col items-center gap-4 py-24 text-center"
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={STEP_TRANSITION}
      >
        <DrumrollScene className="size-36" />
        <p className="font-display-wonk text-3xl font-semibold">Reading your answers</p>
        <div className="flex items-center gap-1.5" aria-hidden>
          {['d1', 'd2', 'd3'].map((key, i) => (
            <motion.span
              key={key}
              className="size-2.5 rounded-full bg-primary"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      key="revealed"
      className="flex flex-col gap-10 py-8"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={STEP_TRANSITION}
    >
      <div className="flex flex-col gap-3">
        {bestPalette ? (
          <motion.div
            variants={resultsBurst}
            initial="hidden"
            animate="show"
            className="flex items-center gap-1.5"
            aria-hidden
          >
            {RESULTS_BURST_KEYS.map((key, i) => (
              <motion.span
                key={key}
                variants={resultsBurstDot}
                className={cn(
                  'size-2.5 rounded-full',
                  i % 2 === 0 ? bestPalette.dot : 'bg-accent-deep',
                )}
              />
            ))}
          </motion.div>
        ) : null}
        <p className="inline-flex items-center gap-1.5 font-bold text-primary">
          <Sparkles className="size-4" aria-hidden />
          Quiz done
        </p>
        <h1 className="font-display-wonk text-4xl font-semibold sm:text-5xl">
          Your results are in
        </h1>
      </div>

      {/* The verdict: one matched path (the tested "Nature Pathway" card) —
          kid's name up top, patch badge, a "you care about..." line, and the
          three words they picked as receipts. */}
      {best && bestTemplate && bestPalette ? (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className={cn(
            'flex flex-col items-center gap-4 rounded-t-[3.5rem] rounded-b-3xl p-8 text-center',
            bestPalette.soft,
          )}
        >
          <motion.span
            variants={listItemVariants}
            className={cn(
              'font-bold text-xs uppercase tracking-wide opacity-80',
              bestPalette.softText,
            )}
          >
            {firstName}'s path
          </motion.span>
          <motion.div variants={listItemVariants}>
            <BestArt template={best.key} className="size-32" />
          </motion.div>
          <motion.div variants={listItemVariants} className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <h2
                className={cn(
                  'font-display-wonk text-3xl font-semibold sm:text-4xl',
                  bestPalette.softText,
                )}
              >
                {bestTemplate.name}
              </h2>
              <motion.span
                variants={badgeVariants}
                className={cn('rounded-full px-3 py-1 font-bold text-xs', bestPalette.solid)}
              >
                {best.percent}% match
              </motion.span>
            </div>
            <p className={cn('max-w-md text-sm sm:text-base', bestPalette.softText)}>
              {PATH_VERDICTS[best.key]}
            </p>
          </motion.div>
          {words.length > 0 ? (
            <motion.div variants={listItemVariants} className="flex flex-col items-center gap-1.5">
              <div className="flex flex-wrap justify-center gap-1.5">
                {words.map((word) => (
                  <span
                    key={word}
                    className={cn('rounded-full px-3 py-1 font-bold text-xs', bestPalette.solid)}
                  >
                    {word}
                  </span>
                ))}
              </div>
              <p className={cn('text-xs opacity-80', bestPalette.softText)}>
                Your words. This path runs on all three.
              </p>
            </motion.div>
          ) : null}
          <motion.div variants={listItemVariants} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => dispatch({ type: 'choose-template', template: best.key })}
            >
              Choose this path
              <ArrowRight aria-hidden />
            </Button>
          </motion.div>
        </motion.div>
      ) : null}

      {/* The tested tracker's four category rows, reframed to our paths: the
          top four matches, each with its hue-tinted bar, so the percentages
          behind the verdict are right there to argue with. */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        <h2 className="font-display text-2xl font-semibold">Your match meter</h2>
        <div className="flex flex-col gap-2.5">
          {ranked.map(({ key, percent }, index) => {
            const template = templates.find((t) => t.key === key)
            const palette = TEMPLATE_PALETTE[key]
            const Art = TEMPLATE_SCENES[key]
            if (!template) return null
            return (
              <motion.div
                key={key}
                variants={listItemVariants}
                className={cn('flex items-center gap-3 rounded-2xl px-4 py-3', palette.soft)}
              >
                <Art className="size-12 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className={cn('truncate text-sm font-bold', palette.softText)}>
                      {template.name}
                    </p>
                    <p
                      className={cn(
                        'font-display-wonk font-semibold leading-none',
                        palette.softText,
                      )}
                    >
                      {percent}%
                    </p>
                  </div>
                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-background/70"
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${template.name}: ${percent}% match`}
                  >
                    <motion.div
                      className={cn('h-full rounded-full', palette.bar)}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(percent, 4)}%` }}
                      transition={{
                        duration: 0.6,
                        ease: EASE_OUT_QUART,
                        delay: 0.2 + index * 0.1,
                      }}
                    />
                  </div>
                </div>
                {index === 0 ? (
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 font-bold text-[10px] uppercase tracking-wide',
                      palette.solid,
                    )}
                  >
                    Best
                  </span>
                ) : null}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Recommended providers directly under the matched path, as tested. */}
      {matchedGuides.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-semibold">Guides who fit this path</h2>
          <div className="flex flex-col gap-2.5">
            {matchedGuides.map((provider) => {
              const primary = provider.templates[0]
              const { scene: GuideArt, hue: guideHue } = templateScene(primary ?? 'my-own-path')
              const c = HUE_CLASSES[guideHue]
              return (
                <div
                  key={provider.key}
                  className={cn('flex items-center gap-3 rounded-2xl px-4 py-3', c.tile)}
                >
                  <GuideArt className="size-14 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate font-display font-semibold', c.text)}>
                      {provider.name}
                    </p>
                    <p className={cn('truncate text-sm opacity-90', c.text)}>{provider.tagline}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-muted-foreground text-sm">
            Pick your path and you can tap the ones you like right after.
          </p>
        </div>
      ) : null}

      {/* Close seconds and the rest: still one tap away, clearly secondary. */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold">Not feeling it? Close seconds</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {runnersUp.map(({ key, percent }) => {
            const template = templates.find((t) => t.key === key)
            const palette = TEMPLATE_PALETTE[key]
            const Art = TEMPLATE_SCENES[key]
            if (!template) return null
            return (
              <motion.button
                key={key}
                type="button"
                whileHover={{ scale: 1.01, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatch({ type: 'choose-template', template: key })}
                className={cn('flex items-center gap-3 rounded-3xl p-4 text-left', palette.soft)}
              >
                <Art className="size-20 shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={cn('font-display font-semibold text-lg', palette.softText)}>
                      {template.name}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 font-bold text-[10px]',
                        palette.solid,
                      )}
                    >
                      {percent}%
                    </span>
                  </span>
                  <span className={cn('text-sm opacity-90', palette.softText)}>
                    {template.tagline}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {rest.map((template) => {
            const Art = TEMPLATE_SCENES[template.key]
            return (
              <motion.button
                key={template.key}
                type="button"
                whileHover={{ scale: 1.01, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatch({ type: 'choose-template', template: template.key })}
                className="flex flex-col items-start gap-2 rounded-2xl border-2 border-input p-4 text-left hover:border-primary/50"
              >
                <Art className="size-16" />
                <span className="font-bold">{template.name}</span>
                <span className="text-sm text-muted-foreground">{template.tagline}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}

// Best-match patch art, resolved by template key so the hero card stays tidy.
function BestArt({ template, className }: { template: TemplateKey; className?: string }) {
  const Art = TEMPLATE_SCENES[template]
  return <Art className={className} />
}

function NameStep({ state, dispatch, direction }: StepProps<'name'>) {
  const router = useRouter()
  const { user } = Route.useRouteContext()
  const { quiz } = Route.useLoaderData()
  const template = useTemplate(state.template)
  const palette = TEMPLATE_PALETTE[state.template]
  const ChosenArt = TEMPLATE_SCENES[state.template]
  const firstName = user.displayName.split(' ')[0] ?? user.displayName
  const suggestions = suggestJourneyNames({
    template: state.template,
    childName: firstName,
    words: pickedWords(quiz.questions, state.answers),
  })
  const [name, setName] = useState('')
  const mutation = useMutation({
    mutationFn: () =>
      createJourneyFn({
        data: {
          template: state.template,
          name: name.trim(),
          answers: state.answers as Record<string, string[]>,
        },
      }),
    onSuccess: async (result) => {
      // On success, stay in-page and move to the guides step. No
      // router.invalidate() yet: this route's loader redirects away the moment
      // a journey exists, and the kid still has one choice to make here.
      if (result.ok) {
        dispatch({ type: 'journey-created' })
        return
      }
      // A journey already existing means another tab beat us to it; the right
      // place to be is the dashboard.
      if (result.error === 'already-has-journey') {
        await router.invalidate()
        await router.navigate({ to: '/kid' })
      }
    },
  })
  const failed = mutation.data && !mutation.data.ok && mutation.data.error !== 'already-has-journey'
  if (!template) return null

  return (
    <motion.section
      className="flex flex-col gap-8 py-8"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={STEP_TRANSITION}
    >
      <Button variant="ghost" className="self-start" onClick={() => dispatch({ type: 'back' })}>
        <ArrowLeft aria-hidden />
        Back to matches
      </Button>
      <div
        className={cn(
          'flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center',
          palette.soft,
        )}
      >
        <ChosenArt className="size-24 shrink-0 self-center" />
        <div className="flex flex-col gap-3">
          <TemplateChip template={state.template} variant="solid" className="self-start" />
          <p className={cn('text-sm', palette.softText)}>{template.description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="font-display-wonk text-4xl font-semibold">Name your journey</h1>
        <p className="text-muted-foreground">
          This is the name you'll see every day, so make it feel like yours. Steal one of these or
          write your own.
        </p>
      </div>
      <motion.div
        className="flex flex-wrap gap-2.5"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {suggestions.map((suggestion) => (
          <motion.button
            key={suggestion}
            type="button"
            variants={listItemVariants}
            whileTap={{ scale: 0.97 }}
            onClick={() => setName(suggestion)}
            aria-pressed={name === suggestion}
            className={cn(
              'rounded-full border-2 px-4 py-2 text-sm font-bold',
              name === suggestion
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input hover:border-primary/50',
            )}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="journey-name">Journey name</Label>
        <Input
          id="journey-name"
          value={name}
          maxLength={80}
          placeholder="Write your own"
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      {failed ? (
        <p className="text-sm font-bold text-destructive" role="alert">
          We couldn't save your journey. Try again in a second.
        </p>
      ) : null}
      <Button
        size="lg"
        disabled={name.trim().length === 0 || mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? 'Building your journey...' : 'Start this journey'}
      </Button>
    </motion.section>
  )
}

// The journey exists by now; this is the last call before the dashboard.
// Going it alone is a first-class choice, not a failure state — hearts here
// are the kid's "I'm interested" signal that the parent later acts on.
function GuidesStep({ state, direction }: StepProps<'guides'>) {
  const router = useRouter()
  const { providers, favorites } = Route.useLoaderData()
  const palette = TEMPLATE_PALETTE[state.template]
  const { recommended, rest } = splitByRecommendation(providers, [state.template])
  const picks = [...recommended, ...rest].slice(0, 3)
  const [hearted, setHearted] = useState<readonly string[]>(favorites.map((f) => f.providerKey))
  const [leaving, setLeaving] = useState(false)

  const favoriteMutation = useMutation({
    mutationFn: (input: { providerKey: string; favorited: boolean }) =>
      setFavoriteFn({ data: input }),
    onSuccess: (result, input) => {
      if (result.ok) {
        setHearted((current) =>
          input.favorited
            ? [...current, input.providerKey]
            : current.filter((key) => key !== input.providerKey),
        )
      }
    },
  })

  // The quiz loader redirects once a journey exists, so invalidating here (and
  // only here, on the way out) lands the kid on the fresh dashboard.
  const leave = async (to: '/kid' | '/kid/guides') => {
    setLeaving(true)
    await router.invalidate()
    await router.navigate({ to })
  }

  return (
    <motion.section
      className="flex flex-col gap-8 py-8"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={STEP_TRANSITION}
    >
      <div className="flex flex-col gap-3">
        <p className="inline-flex items-center gap-1.5 font-bold text-primary">
          <Sparkles className="size-4" aria-hidden />
          Journey saved
        </p>
        <h1 className="font-display-wonk text-4xl font-semibold">
          Go it alone, or bring someone in?
        </h1>
        <p className="text-muted-foreground">
          These guides know journeys like yours. They help you stay on track, make the big idea
          real, and find the meaning in it — a rabbi, a mentor, or the person who helps you build
          the wild part. Tap the heart on anyone interesting and your parent can reach out. Or skip
          it: doing this your own way is a great plan too.
        </p>
        <div className="flex items-center gap-3">
          <FaceCluster
            photos={[
              { src: '/photos/workshop.jpg', alt: '' },
              { src: '/photos/kid-grandpa-top.jpg', alt: '' },
              { src: '/photos/family-tablet.jpg', alt: '' },
            ]}
          />
          <p className="text-sm font-bold text-muted-foreground">
            Real people, on real journeys like yours
          </p>
        </div>
      </div>

      <motion.div
        className="flex flex-col gap-3"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {picks.map((provider) => {
          const favorited = hearted.includes(provider.key)
          const primaryTemplate = provider.templates[0]
          const { scene: GuideArt } = primaryTemplate
            ? templateScene(primaryTemplate)
            : templateScene(state.template)
          return (
            <motion.div
              key={provider.key}
              variants={listItemVariants}
              className={cn(
                'flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 pr-5',
                palette.soft,
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <GuideArt className="size-16 shrink-0" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className={cn('font-display text-lg font-semibold', palette.softText)}>
                    {provider.name}
                  </p>
                  <p className={cn('text-sm opacity-90', palette.softText)}>{provider.tagline}</p>
                </div>
              </div>
              <Button
                variant={favorited ? 'default' : 'outline'}
                size="sm"
                aria-pressed={favorited}
                disabled={favoriteMutation.isPending}
                onClick={() =>
                  favoriteMutation.mutate({ providerKey: provider.key, favorited: !favorited })
                }
              >
                <Heart className={cn('size-4', favorited && 'fill-current')} aria-hidden />
                {favorited ? 'Interested' : "I'm interested"}
              </Button>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="flex flex-col gap-3">
        <Button size="lg" disabled={leaving} onClick={() => leave('/kid')}>
          {hearted.length > 0 ? 'Start my journey' : "I've got this — go it alone"}
          <ArrowRight aria-hidden />
        </Button>
        <button
          type="button"
          disabled={leaving}
          className="self-center text-sm font-bold text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => leave('/kid/guides')}
        >
          See all the guides first
        </button>
      </div>
    </motion.section>
  )
}
