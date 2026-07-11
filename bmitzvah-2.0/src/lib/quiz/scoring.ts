import type { ComfortKey, QuizQuestion, TemplateKey } from '@/lib/content/types'
import { TEMPLATE_KEYS } from '@/lib/content/types'

// Option ids the child picked, keyed by question id. 'words' questions carry
// several ids, 'single' questions carry one.
export type QuizAnswers = Readonly<Record<string, readonly string[]>>

export type TemplateScores = Readonly<Record<TemplateKey, number>>

export type RankedTemplate = {
  readonly key: TemplateKey
  readonly score: number
}

// A ranked template plus how close the kid's answers came to a perfect run
// for it — the number the results screen shows next to each match bar.
export type TemplateMatch = RankedTemplate & {
  readonly percent: number
}

// A stated preference for tradition outweighs any single quiz answer, and mild
// curiosity nudges without deciding.
const COMFORT_BOOST: Readonly<Record<ComfortKey, number>> = {
  cultural: 0,
  curious: 1,
  traditional: 4,
}

// When no single theme clearly wins, the honest recommendation is the
// build-your-own frame rather than a coin-flip between mediocre fits.
const FLATNESS_SPREAD = 2
const FLATNESS_BONUS = 3

const zeroScores = (): Record<TemplateKey, number> => {
  const scores = {} as Record<TemplateKey, number>
  for (const key of TEMPLATE_KEYS) {
    scores[key] = 0
  }
  return scores
}

export function scoreQuiz(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
  // Null when the parent hasn't answered the observance question yet: the quiz
  // still works, just without the tradition lean.
  comfort: ComfortKey | null,
): TemplateScores {
  const scores = zeroScores()

  for (const question of questions) {
    const picked = answers[question.id]
    if (!picked) continue
    for (const option of question.options) {
      if (!picked.includes(option.id)) continue
      for (const [key, weight] of Object.entries(option.weights)) {
        scores[key as TemplateKey] += weight
      }
    }
  }

  if (comfort) scores['roots-and-rituals'] += COMFORT_BOOST[comfort]

  const others = TEMPLATE_KEYS.filter((key) => key !== 'my-own-path').map((key) => scores[key])
  const max = Math.max(...others)
  const sorted = [...others].sort((a, b) => b - a)
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0
  if (max - median <= FLATNESS_SPREAD) {
    scores['my-own-path'] += FLATNESS_BONUS
  }

  return scores
}

export function rankTemplates(scores: TemplateScores): readonly RankedTemplate[] {
  // Ties break by TEMPLATE_KEYS order so results are stable across runs.
  return TEMPLATE_KEYS.map((key) => ({ key, score: scores[key] })).sort((a, b) => b.score - a.score)
}

// The best score each template could possibly reach given this quiz's
// content: single questions contribute their strongest option, words
// questions their strongest pickExactly options. The comfort boost and the
// flatness bonus count too, since real scores can include them.
function maxPossibleScores(
  questions: readonly QuizQuestion[],
  comfort: ComfortKey | null,
): Record<TemplateKey, number> {
  const max = zeroScores()
  for (const question of questions) {
    for (const key of TEMPLATE_KEYS) {
      const weights = question.options
        .map((option) => option.weights[key] ?? 0)
        .filter((weight) => weight > 0)
        .sort((a, b) => b - a)
      max[key] +=
        question.kind === 'words'
          ? weights.slice(0, question.pickExactly).reduce((sum, weight) => sum + weight, 0)
          : (weights[0] ?? 0)
    }
  }
  if (comfort) max['roots-and-rituals'] += COMFORT_BOOST[comfort]
  max['my-own-path'] += FLATNESS_BONUS
  return max
}

const toPercent = (score: number, max: number): number =>
  max > 0 ? Math.min(100, Math.max(0, Math.round((score / max) * 100))) : 0

export function recommendTemplates(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
  comfort: ComfortKey | null,
): readonly TemplateMatch[] {
  const scores = scoreQuiz(questions, answers, comfort)
  const max = maxPossibleScores(questions, comfort)
  // Four matches, mirroring the tested tracker's four category rows.
  return rankTemplates(scores)
    .slice(0, 4)
    .map(({ key, score }) => ({ key, score, percent: toPercent(score, max[key]) }))
}
