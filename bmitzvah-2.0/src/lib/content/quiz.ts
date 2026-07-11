import type { ChoiceOption, ComfortKey, QuizQuestion, TimelineKey } from './types'

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1-words',
    kind: 'words',
    prompt: 'Pick exactly 3 words that feel like you.',
    helper: 'No overthinking, just go with your gut.',
    pickExactly: 3,
    options: [
      { id: 'q1-adventurous', label: 'Adventurous', emoji: '🧭', weights: { 'into-the-wild': 2 } },
      { id: 'q1-wild', label: 'Wild', emoji: '🌲', weights: { 'into-the-wild': 2 } },
      { id: 'q1-creative', label: 'Creative', emoji: '🎨', weights: { 'make-something-real': 2 } },
      {
        id: 'q1-funny',
        label: 'Funny',
        emoji: '🎭',
        weights: { 'make-something-real': 1, 'my-own-path': 1 },
      },
      { id: 'q1-caring', label: 'Caring', emoji: '💛', weights: { 'make-a-difference': 2 } },
      {
        id: 'q1-organized',
        label: 'Organized',
        emoji: '📋',
        weights: { 'make-a-difference': 1, 'mind-and-meaning': 1 },
      },
      { id: 'q1-curious', label: 'Curious', emoji: '🔍', weights: { 'mind-and-meaning': 2 } },
      { id: 'q1-thoughtful', label: 'Thoughtful', emoji: '🧠', weights: { 'mind-and-meaning': 2 } },
      { id: 'q1-cozy', label: 'Cozy', emoji: '🕯️', weights: { 'roots-and-rituals': 2 } },
      { id: 'q1-loyal', label: 'Loyal', emoji: '🤝', weights: { 'roots-and-rituals': 2 } },
      { id: 'q1-dreamer', label: 'Dreamer', emoji: '☁️', weights: { 'my-own-path': 2 } },
      {
        id: 'q1-bold',
        label: 'Bold',
        emoji: '🚀',
        weights: { 'my-own-path': 1, 'make-a-difference': 1 },
      },
    ],
  },
  {
    id: 'q2-saturday',
    kind: 'single',
    prompt: "It's a free Saturday with zero plans. What sounds best?",
    options: [
      {
        id: 'q2-outside',
        label: 'Head outside and explore somewhere new',
        emoji: '🥾',
        weights: { 'into-the-wild': 3 },
      },
      {
        id: 'q2-make',
        label: 'Make or build something in your room',
        emoji: '🛠️',
        weights: { 'make-something-real': 3 },
      },
      {
        id: 'q2-help',
        label: 'Do something that helps people you care about',
        emoji: '🤲',
        weights: { 'make-a-difference': 3 },
      },
      {
        id: 'q2-rabbit-hole',
        label: 'Fall down a rabbit hole about something you love',
        emoji: '📚',
        weights: { 'mind-and-meaning': 3 },
      },
      {
        id: 'q2-cook',
        label: 'Cook or bake with family and hear their stories',
        emoji: '🍲',
        weights: { 'roots-and-rituals': 3 },
      },
      {
        id: 'q2-mix',
        label: 'A little of everything, your own mix',
        emoji: '🎛️',
        weights: { 'my-own-path': 3 },
      },
    ],
  },
  {
    id: 'q3-trip',
    kind: 'single',
    prompt: 'Which weekend trip would you say yes to first?',
    options: [
      {
        id: 'q3-camping',
        label: 'Camping with a hike and a campfire',
        emoji: '🏕️',
        weights: { 'into-the-wild': 3 },
      },
      {
        id: 'q3-backstage',
        label: 'Backstage at a show or a big art museum',
        emoji: '🎨',
        weights: { 'make-something-real': 2, 'mind-and-meaning': 1 },
      },
      {
        id: 'q3-volunteering',
        label: "A day volunteering you'd feel proud of",
        emoji: '🧡',
        weights: { 'make-a-difference': 3 },
      },
      {
        id: 'q3-science',
        label: 'A science center or planetarium',
        emoji: '🔭',
        weights: { 'mind-and-meaning': 3 },
      },
      {
        id: 'q3-relatives',
        label: 'Visiting relatives and old family photos',
        emoji: '📸',
        weights: { 'roots-and-rituals': 3 },
      },
      {
        id: 'q3-plan-own',
        label: "You'd rather plan your own trip from scratch",
        emoji: '🗺️',
        weights: { 'my-own-path': 3, 'into-the-wild': 1 },
      },
    ],
  },
  {
    id: 'q4-lead',
    kind: 'single',
    prompt: "Your friend group needs someone to take the lead. You're most likely to...",
    options: [
      {
        id: 'q4-organize',
        label: 'Get everyone organized and moving',
        emoji: '📋',
        weights: { 'make-a-difference': 2, 'my-own-path': 1 },
      },
      {
        id: 'q4-idea',
        label: 'Come up with the wild creative idea',
        emoji: '💡',
        weights: { 'make-something-real': 2, 'my-own-path': 1 },
      },
      {
        id: 'q4-research',
        label: "Research it so the group knows what they're doing",
        emoji: '🔍',
        weights: { 'mind-and-meaning': 3 },
      },
      {
        id: 'q4-include',
        label: 'Make sure nobody gets left out',
        emoji: '🤝',
        weights: { 'make-a-difference': 3 },
      },
      {
        id: 'q4-different',
        label: 'Suggest doing it totally differently than expected',
        emoji: '🌀',
        weights: { 'my-own-path': 3 },
      },
    ],
  },
  {
    id: 'q5-club',
    kind: 'single',
    prompt: "Pick the after-school club you'd actually show up for.",
    options: [
      {
        id: 'q5-outdoor',
        label: 'Outdoor, hiking, or nature club',
        emoji: '🌲',
        weights: { 'into-the-wild': 3 },
      },
      {
        id: 'q5-art',
        label: 'Art, music, drama, or maker club',
        emoji: '🎭',
        weights: { 'make-something-real': 3 },
      },
      {
        id: 'q5-volunteer',
        label: 'Volunteer or community action club',
        emoji: '🌍',
        weights: { 'make-a-difference': 3 },
      },
      {
        id: 'q5-debate',
        label: 'Debate, quiz bowl, or coding club',
        emoji: '🧠',
        weights: { 'mind-and-meaning': 3 },
      },
      {
        id: 'q5-food',
        label: 'A club that celebrates food and cultures',
        emoji: '🥟',
        weights: { 'roots-and-rituals': 2, 'make-a-difference': 1 },
      },
      {
        id: 'q5-own-club',
        label: "You'd start your own club",
        emoji: '🚩',
        weights: { 'my-own-path': 3 },
      },
    ],
  },
  {
    id: 'q6-wall',
    kind: 'single',
    prompt: "There's a big empty wall and it's yours. What goes on it?",
    options: [
      {
        id: 'q6-map',
        label: 'A map of places you want to explore',
        emoji: '🗺️',
        weights: { 'into-the-wild': 3 },
      },
      {
        id: 'q6-art',
        label: 'A giant piece of art you made',
        emoji: '🖼️',
        weights: { 'make-something-real': 3 },
      },
      {
        id: 'q6-causes',
        label: 'A board of causes you care about',
        emoji: '📌',
        weights: { 'make-a-difference': 3 },
      },
      {
        id: 'q6-facts',
        label: 'A wall of facts, questions, and ideas',
        emoji: '🧩',
        weights: { 'mind-and-meaning': 3 },
      },
      {
        id: 'q6-photos',
        label: 'Photos of family and people you love',
        emoji: '🖤',
        weights: { 'roots-and-rituals': 3 },
      },
      {
        id: 'q6-mix',
        label: 'A mix of all of it, always changing',
        emoji: '🌈',
        weights: { 'my-own-path': 3 },
      },
    ],
  },
  {
    id: 'q7-proud',
    kind: 'single',
    prompt: "Someone asks what you're proud of. You'd rather say...",
    options: [
      {
        id: 'q7-outdoors',
        label: 'I pushed myself and did something hard outdoors',
        emoji: '💪',
        weights: { 'into-the-wild': 2, 'my-own-path': 1 },
      },
      {
        id: 'q7-made',
        label: 'I made something people actually loved',
        emoji: '🌟',
        weights: { 'make-something-real': 3 },
      },
      {
        id: 'q7-better',
        label: 'I made something better for other people',
        emoji: '💗',
        weights: { 'make-a-difference': 3 },
      },
      {
        id: 'q7-figured',
        label: 'I figured out something tricky on my own',
        emoji: '🧠',
        weights: { 'mind-and-meaning': 2, 'my-own-path': 1 },
      },
      {
        id: 'q7-tradition',
        label: 'I kept a family tradition going',
        emoji: '🕯️',
        weights: { 'roots-and-rituals': 3 },
      },
      {
        id: 'q7-own-way',
        label: 'I did it my own way, even if it was different',
        emoji: '🦄',
        weights: { 'my-own-path': 3 },
      },
    ],
  },
  {
    id: 'q8-rather',
    kind: 'single',
    prompt: 'Would you rather...',
    options: [
      {
        id: 'q8-fire',
        label: 'Learn to build a fire and read a trail',
        emoji: '🔥',
        weights: { 'into-the-wild': 3 },
      },
      {
        id: 'q8-edit',
        label: 'Learn to edit video or play a song',
        emoji: '🎬',
        weights: { 'make-something-real': 3 },
      },
      {
        id: 'q8-event',
        label: 'Learn to plan an event that raises money for good',
        emoji: '🎟️',
        weights: { 'make-a-difference': 2, 'my-own-path': 1 },
      },
      {
        id: 'q8-how',
        label: 'Learn how something works from the inside out',
        emoji: '⚙️',
        weights: { 'mind-and-meaning': 2, 'into-the-wild': 1 },
      },
      {
        id: 'q8-recipe',
        label: 'Learn a recipe passed down in your family',
        emoji: '🥘',
        weights: { 'roots-and-rituals': 3 },
      },
      {
        id: 'q8-random',
        label: 'Learn a bunch of random skills just because',
        emoji: '🎲',
        weights: { 'my-own-path': 3 },
      },
    ],
  },
  {
    id: 'q9-story',
    kind: 'single',
    prompt: 'What story do you want people to tell about your big day?',
    options: [
      {
        id: 'q9-adventurous',
        label: 'The one where you did something adventurous',
        emoji: '🧗',
        weights: { 'into-the-wild': 3 },
      },
      {
        id: 'q9-unforgettable',
        label: 'The one where you made something unforgettable',
        emoji: '🎆',
        weights: { 'make-something-real': 3 },
      },
      {
        id: 'q9-difference',
        label: 'The one where you made a real difference',
        emoji: '🌱',
        weights: { 'make-a-difference': 3 },
      },
      {
        id: 'q9-taught',
        label: 'The one where you taught everyone something new',
        emoji: '🎓',
        weights: { 'mind-and-meaning': 3 },
      },
      {
        id: 'q9-family',
        label: 'The one that brought your family together',
        emoji: '🫶',
        weights: { 'roots-and-rituals': 3 },
      },
      {
        id: 'q9-surprise',
        label: 'The one nobody saw coming',
        emoji: '🎇',
        weights: { 'my-own-path': 3 },
      },
    ],
  },
  {
    id: 'q10-best-part',
    kind: 'single',
    prompt: 'Last one. When a project is done, the best part is...',
    options: [
      {
        id: 'q10-outside',
        label: 'Being outside and feeling it in your body',
        emoji: '🌄',
        weights: { 'into-the-wild': 2, 'my-own-path': 1 },
      },
      {
        id: 'q10-show',
        label: 'Showing people the thing you made',
        emoji: '🎨',
        weights: { 'make-something-real': 3 },
      },
      {
        id: 'q10-helped',
        label: 'Knowing you helped someone',
        emoji: '🤗',
        weights: { 'make-a-difference': 3 },
      },
      {
        id: 'q10-understanding',
        label: "Understanding something you didn't before",
        emoji: '💭',
        weights: { 'mind-and-meaning': 3 },
      },
      {
        id: 'q10-table',
        label: 'Sharing it around a table with people you love',
        emoji: '🍽️',
        weights: { 'roots-and-rituals': 3 },
      },
      {
        id: 'q10-your-way',
        label: 'Knowing you did it exactly your way',
        emoji: '🛤️',
        weights: { 'my-own-path': 3 },
      },
    ],
  },
]

export const TIMELINE_OPTIONS: readonly ChoiceOption<TimelineKey>[] = [
  {
    key: 'under-6-months',
    label: 'In the next 6 months',
    helper: "Plenty of time to build something real, let's get going.",
  },
  {
    key: 'about-a-year',
    label: 'About a year away',
    helper: 'A great runway, no rush and no cramming.',
  },
  {
    key: 'more-than-a-year',
    label: 'More than a year out',
    helper: 'Early is a gift, you can dream big and start slow.',
  },
  {
    key: 'just-exploring',
    label: 'Just exploring for now',
    helper: 'No pressure at all, look around and see what sparks.',
  },
]

export const COMFORT_OPTIONS: readonly ChoiceOption<ComfortKey>[] = [
  {
    key: 'cultural',
    label: 'Keep it cultural',
    helper: 'Values, family, and belonging, without the religious parts.',
  },
  {
    key: 'curious',
    label: 'Curious, keep it light',
    helper: 'Open to a little tradition, as long as it stays optional.',
  },
  {
    key: 'traditional',
    label: 'Some tradition, please',
    helper: 'Lean into the rituals and roots, on your own terms.',
  },
]
