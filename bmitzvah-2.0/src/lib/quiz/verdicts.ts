import type { TemplateKey } from '@/lib/content/types'

// The personality-quiz verdict: one second-person "you care about..." line per
// path, mirroring the tested "Nature Pathway" card copy ("You care about
// nature and animals, spending time with your friends and family and want to
// learn how to care for the world around you"). Presentation copy, not
// content — the admin-editable template records stay untouched.
export const PATH_VERDICTS: Record<TemplateKey, string> = {
  'into-the-wild':
    'You care about nature and animals, being outside with your people, and learning how to look after the world around you.',
  'make-something-real':
    'You care about making real things people can see and hold, and you want your big day to show off something you built yourself.',
  'make-a-difference':
    'You care about people, fairness, and leaving things better than you found them, and you want your big day to actually help someone.',
  'mind-and-meaning':
    'You care about big questions and how things really work, and you want your big day to share something you figured out.',
  'roots-and-rituals':
    'You care about family, stories, and traditions that actually mean something, and you want your big day to feel connected to where you come from.',
  'my-own-path':
    "You care about doing things your own way, mixing everything you love into a day nobody's seen before.",
}
