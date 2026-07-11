import type { TemplateKey } from './types'

// Tailwind class bundles per journey template. Class strings must stay literal
// so the compiler sees them.
export type TemplatePalette = {
  readonly solid: string
  readonly soft: string
  readonly softText: string
  readonly bar: string
  readonly dot: string
  readonly borderSoft: string
}

export const TEMPLATE_PALETTE: Readonly<Record<TemplateKey, TemplatePalette>> = {
  'into-the-wild': {
    solid: 'bg-wild text-white',
    soft: 'bg-wild-soft',
    softText: 'text-wild-deep',
    bar: 'bg-wild',
    dot: 'bg-wild',
    borderSoft: 'border-wild/25',
  },
  'make-something-real': {
    solid: 'bg-real text-white',
    soft: 'bg-real-soft',
    softText: 'text-real-deep',
    bar: 'bg-real',
    dot: 'bg-real',
    borderSoft: 'border-real/25',
  },
  'make-a-difference': {
    solid: 'bg-diff text-white',
    soft: 'bg-diff-soft',
    softText: 'text-diff-deep',
    bar: 'bg-diff',
    dot: 'bg-diff',
    borderSoft: 'border-diff/25',
  },
  'mind-and-meaning': {
    solid: 'bg-mind text-white',
    soft: 'bg-mind-soft',
    softText: 'text-mind-deep',
    bar: 'bg-mind',
    dot: 'bg-mind',
    borderSoft: 'border-mind/25',
  },
  'roots-and-rituals': {
    solid: 'bg-roots text-white',
    soft: 'bg-roots-soft',
    softText: 'text-roots-deep',
    bar: 'bg-roots',
    dot: 'bg-roots',
    borderSoft: 'border-roots/25',
  },
  'my-own-path': {
    solid: 'bg-path text-white',
    soft: 'bg-path-soft',
    softText: 'text-path-deep',
    bar: 'bg-path',
    dot: 'bg-path',
    borderSoft: 'border-path/25',
  },
}
