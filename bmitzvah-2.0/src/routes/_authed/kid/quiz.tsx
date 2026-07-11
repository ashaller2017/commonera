import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, type Transition, type Variants } from 'motion/react'
import { useEffect, useReducer, useRef, useState } from 'react'
import { TemplateChip } from '@/components/template-chip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTemplate, useTemplates } from '@/hooks/use-templates'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import type { ComfortKey, QuizQuestion, TemplateKey, TimelineKey } from '@/lib/content/types'
import { suggestJourneyNames } from '@/lib/journey/naming'
import { type QuizAnswers, recommendTemplates } from '@/lib/quiz/scoring'
import { cn } from '@/lib/utils'
import { fetchQuizContentFn } from '@/utils/content.functions'
import { createJourneyFn, fetchOwnJourneyFn } from '@/utils/journeys.functions'

export const Route = createFileRoute('/_authed/kid/quiz')({
  // A journey, once chosen, is permanent: kids with one never see the quiz.
  loader: async () => {
    const journey = await fetchOwnJourneyFn()
    if (journey) throw redirect({ to: '/kid' })
    return { quiz: await fetchQuizContentFn() }
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

// A single-choice option's check mark scales in when the option is picked.
const checkVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1 },
}

// A word chip does a small spring-free pop the moment it becomes selected. The
// label form (not an inline keyframe array) means a sibling re-render never
// re-fires the pop: motion only re-runs when the label itself changes.
const chipVariants: Variants = {
  idle: { scale: 1 },
  selected: { scale: [1, 1.05, 1] },
}

type QuizState =
  | {
      readonly step: 'setup'
      readonly timeline: TimelineKey | null
      readonly comfort: ComfortKey | null
    }
  | {
      readonly step: 'question'
      readonly index: number
      readonly answers: QuizAnswers
      readonly timeline: TimelineKey
      readonly comfort: ComfortKey
    }
  | {
      readonly step: 'results'
      readonly answers: QuizAnswers
      readonly timeline: TimelineKey
      readonly comfort: ComfortKey
    }
  | {
      readonly step: 'name'
      readonly template: TemplateKey
      readonly answers: QuizAnswers
      readonly timeline: TimelineKey
      readonly comfort: ComfortKey
    }

type QuizAction =
  | { readonly type: 'set-timeline'; readonly timeline: TimelineKey }
  | { readonly type: 'set-comfort'; readonly comfort: ComfortKey }
  | { readonly type: 'start' }
  | { readonly type: 'answer-single'; readonly optionId: string }
  | { readonly type: 'toggle-word'; readonly optionId: string }
  | { readonly type: 'continue' }
  | { readonly type: 'back' }
  | { readonly type: 'choose-template'; readonly template: TemplateKey }

function quizReducer(
  questions: readonly QuizQuestion[],
  state: QuizState,
  action: QuizAction,
): QuizState {
  switch (action.type) {
    case 'set-timeline':
      return state.step === 'setup' ? { ...state, timeline: action.timeline } : state
    case 'set-comfort':
      return state.step === 'setup' ? { ...state, comfort: action.comfort } : state
    case 'start':
      return state.step === 'setup' && state.timeline && state.comfort
        ? {
            step: 'question',
            index: 0,
            answers: {},
            timeline: state.timeline,
            comfort: state.comfort,
          }
        : state
    case 'answer-single': {
      if (state.step !== 'question') return state
      const question = questions[state.index]
      if (question?.kind !== 'single') return state
      const answers = { ...state.answers, [question.id]: [action.optionId] }
      const nextIndex = state.index + 1
      return nextIndex >= questions.length
        ? { step: 'results', answers, timeline: state.timeline, comfort: state.comfort }
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
        ? {
            step: 'results',
            answers: state.answers,
            timeline: state.timeline,
            comfort: state.comfort,
          }
        : { ...state, index: nextIndex }
    }
    case 'back': {
      if (state.step === 'question') {
        return state.index === 0
          ? { step: 'setup', timeline: state.timeline, comfort: state.comfort }
          : { ...state, index: state.index - 1 }
      }
      if (state.step === 'results') {
        return {
          step: 'question',
          index: questions.length - 1,
          answers: state.answers,
          timeline: state.timeline,
          comfort: state.comfort,
        }
      }
      if (state.step === 'name') {
        return {
          step: 'results',
          answers: state.answers,
          timeline: state.timeline,
          comfort: state.comfort,
        }
      }
      return state
    }
    case 'choose-template':
      return state.step === 'results'
        ? {
            step: 'name',
            template: action.template,
            answers: state.answers,
            timeline: state.timeline,
            comfort: state.comfort,
          }
        : state
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
    { step: 'setup', timeline: null, comfort: null },
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
    <div className="mx-auto w-full max-w-2xl">
      {/* initial={false}: the first paint renders in place (visible by default,
          per DESIGN), only navigation between steps animates. */}
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {state.step === 'setup' ? (
          <SetupStep key="setup" state={state} dispatch={navigate} direction={direction} />
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
      </AnimatePresence>
    </div>
  )
}

function SetupStep({ state, dispatch, direction }: StepProps<'setup'>) {
  const { quiz } = Route.useLoaderData()
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
        <h1 className="font-display text-4xl font-semibold">Let's figure out your journey</h1>
        <p className="text-muted-foreground">
          {quiz.questions.length} questions about you. No wrong answers, no grades, nobody watching
          over your shoulder. First, two quick settings. Ask a parent if you're not sure.
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="timeline">When do you want to celebrate?</Label>
          <Select
            value={state.timeline ?? undefined}
            onValueChange={(value) =>
              dispatch({ type: 'set-timeline', timeline: value as TimelineKey })
            }
          >
            <SelectTrigger id="timeline" className="w-full">
              <SelectValue placeholder="Pick what feels right" />
            </SelectTrigger>
            <SelectPositioner>
              <SelectContent>
                {quiz.timeline.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="comfort">How Jewish-traditional should it feel?</Label>
          <Select
            value={state.comfort ?? undefined}
            onValueChange={(value) =>
              dispatch({ type: 'set-comfort', comfort: value as ComfortKey })
            }
          >
            <SelectTrigger id="comfort" className="w-full">
              <SelectValue placeholder="Every answer is a good answer" />
            </SelectTrigger>
            <SelectPositioner>
              <SelectContent>
                {quiz.comfort.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </div>
      </div>
      <Button
        size="lg"
        disabled={!state.timeline || !state.comfort}
        onClick={() => dispatch({ type: 'start' })}
      >
        Start the quiz
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
            <h1 className="font-display text-3xl font-semibold">{question.prompt}</h1>
            {question.helper ? <p className="text-muted-foreground">{question.helper}</p> : null}
            {question.kind === 'words' ? (
              <p className="text-sm font-bold text-primary">
                Pick {question.pickExactly}. You've got {question.pickExactly - picked.length} left.
              </p>
            ) : null}
          </div>

          {question.kind === 'words' ? (
            <div className="flex flex-wrap gap-2.5">
              {question.options.map((option) => {
                const selected = picked.includes(option.id)
                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => dispatch({ type: 'toggle-word', optionId: option.id })}
                    initial={false}
                    variants={chipVariants}
                    animate={selected ? 'selected' : 'idle'}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-bold',
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input bg-background hover:border-primary/50',
                    )}
                  >
                    <span aria-hidden>{option.emoji}</span>
                    {option.label}
                  </motion.button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {question.options.map((option) => {
                const selected = pendingOption === option.id || picked.includes(option.id)
                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    initial={false}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (pendingOption) return
                      setPendingOption(option.id)
                      advanceTimer.current = setTimeout(
                        () => dispatch({ type: 'answer-single', optionId: option.id }),
                        240,
                      )
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left font-bold',
                      selected
                        ? 'border-primary bg-primary/10'
                        : 'border-input bg-background hover:border-primary/50',
                    )}
                  >
                    <span className="text-2xl" aria-hidden>
                      {option.emoji}
                    </span>
                    {option.label}
                    <AnimatePresence>
                      {selected ? (
                        <motion.span
                          className="ml-auto flex"
                          variants={checkVariants}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
                        >
                          <Check className="size-5 text-primary" aria-hidden />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>
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
  const { quiz } = Route.useLoaderData()
  const templates = useTemplates()
  const ranked = recommendTemplates(quiz.questions, state.answers, state.comfort)
  const recommendedKeys = ranked.map((r) => r.key)
  const rest = templates.filter((t) => !recommendedKeys.includes(t.key))

  return (
    <motion.section
      className="flex flex-col gap-10 py-8"
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
          Quiz done
        </p>
        <h1 className="font-display text-4xl font-semibold">These paths fit you</h1>
        <p className="text-muted-foreground">
          Your answers point at these three. Pick the one that makes you want to start today, or
          browse the rest. Nothing is locked in; the journey bends to you.
        </p>
      </div>

      <motion.div
        className="flex flex-col gap-4"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {ranked.map(({ key }, index) => {
          const template = templates.find((t) => t.key === key)
          const palette = TEMPLATE_PALETTE[key]
          if (!template) return null
          return (
            <motion.button
              key={key}
              type="button"
              variants={listItemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => dispatch({ type: 'choose-template', template: key })}
              className={cn('flex flex-col gap-2 rounded-3xl p-6 text-left', palette.soft)}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  {template.emoji}
                </span>
                <span className={cn('font-display text-2xl font-semibold', palette.softText)}>
                  {template.name}
                </span>
                {index === 0 ? (
                  <motion.span
                    variants={badgeVariants}
                    className={cn(
                      'ml-auto rounded-full px-3 py-1 text-xs font-bold',
                      palette.solid,
                    )}
                  >
                    Best match
                  </motion.span>
                ) : null}
              </div>
              <p className={cn('font-semibold', palette.softText)}>{template.tagline}</p>
              <p className={cn('text-sm opacity-90', palette.softText)}>{template.description}</p>
              <p className={cn('text-sm font-bold underline-offset-4', palette.softText)}>
                Choose this path
              </p>
            </motion.button>
          )
        })}
      </motion.div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold">Or browse the other three</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {rest.map((template) => (
            <motion.button
              key={template.key}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'choose-template', template: template.key })}
              className="flex flex-col gap-2 rounded-2xl border-2 border-input p-4 text-left hover:border-primary/50"
            >
              <span className="text-2xl" aria-hidden>
                {template.emoji}
              </span>
              <span className="font-bold">{template.name}</span>
              <span className="text-sm text-muted-foreground">{template.tagline}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function NameStep({ state, dispatch, direction }: StepProps<'name'>) {
  const router = useRouter()
  const { user } = Route.useRouteContext()
  const { quiz } = Route.useLoaderData()
  const template = useTemplate(state.template)
  const palette = TEMPLATE_PALETTE[state.template]
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
          timeline: state.timeline,
          comfort: state.comfort,
          answers: state.answers as Record<string, string[]>,
        },
      }),
    onSuccess: async (result) => {
      // A journey already existing means another tab beat us to it; either
      // way the right place to be is the dashboard.
      if (result.ok || result.error === 'already-has-journey') {
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
      <div className={cn('flex flex-col gap-3 rounded-3xl p-6', palette.soft)}>
        <TemplateChip template={state.template} variant="solid" className="self-start" />
        <p className={cn('text-sm', palette.softText)}>{template.description}</p>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-semibold">Name your journey</h1>
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
