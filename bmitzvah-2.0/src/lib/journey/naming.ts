import type { TemplateKey } from '@/lib/content/types'

export type NamingInput = {
  readonly template: TemplateKey
  readonly childName: string
  readonly words: readonly string[]
}

// Name patterns per template. {name} is the child's first name, {word} is one
// of the words they picked in the quiz. The goal is Spotify-playlist energy:
// personal and earned, never curriculum-sounding.
const PATTERNS: Readonly<Record<TemplateKey, readonly string[]>> = {
  'into-the-wild': [
    "{name}'s Trail",
    'The {word} Expedition',
    'Wild by Design',
    "{name}'s Year Outside",
    'The Long Way Up',
  ],
  'make-something-real': [
    'The {word} Project',
    'Made by {name}',
    "{name}'s Studio Year",
    'From Scratch',
    'The Big Make',
  ],
  'make-a-difference': [
    'The {word} Effect',
    "{name}'s Repair Project",
    'Change, Starting Here',
    'The Give Year',
    'Project {word}',
  ],
  'mind-and-meaning': [
    'The {word} Question',
    "{name}'s Deep Dive",
    'One Big Question',
    'The {word} Files',
    'Down the Rabbit Hole',
  ],
  'roots-and-rituals': [
    "{name}'s Table",
    'The {word} Tradition',
    'Old Roots, New Branches',
    'Lighting My Own Way',
    'The Memory Project',
  ],
  'my-own-path': [
    'The {name} Method',
    'Path: {word}',
    "{name}'s Own Path",
    'Uncharted',
    'The {word} Experiment',
  ],
}

const titleCase = (word: string): string =>
  word.length === 0 ? word : word[0]?.toUpperCase() + word.slice(1)

export function suggestJourneyNames(input: NamingInput): readonly string[] {
  const words = input.words.length > 0 ? input.words : ['Next']
  const patterns = PATTERNS[input.template]
  const suggestions: string[] = []

  for (const [index, pattern] of patterns.entries()) {
    const word = titleCase(words[index % words.length] ?? 'Next')
    const name = pattern.replaceAll('{name}', input.childName).replaceAll('{word}', word)
    if (!suggestions.includes(name)) suggestions.push(name)
  }

  return suggestions
}
