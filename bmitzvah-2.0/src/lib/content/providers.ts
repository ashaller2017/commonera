import type { Provider } from './types'

export const PROVIDERS: readonly Provider[] = [
  {
    key: 'wildroots-collective',
    name: 'Wildroots Collective',
    tagline: "B'Mitzvah journeys that happen outside.",
    overview:
      'Wildroots runs season-long outdoor journeys where kids choose a landscape and learn it by living in it. Groups meet on trails, rivers, and campsites through the year, ending with a ceremony under open sky. Everything is built around the natural world, not a building.',
    approach:
      'They believe the outdoors is the best teacher there is, and their guides walk beside kids rather than lecture at them.',
    format: 'in-person',
    location: 'Bay Area, CA',
    priceRange: '$1,200 to $2,800',
    orgType: 'organization',
    templates: ['into-the-wild'],
    verified: true,
    testimonials: [
      {
        quote: "Noa came home muddy, exhausted, and more sure of herself than I've ever seen her.",
        attribution: 'Rachel, parent of Noa, 13',
      },
      {
        quote: "I didn't know a trail could teach you that much about yourself.",
        attribution: 'Eli, 12',
      },
    ],
  },
  {
    key: 'maya-rosen-studio',
    name: 'Maya Rosen Studio',
    tagline: 'Help turning your idea into a finished thing.',
    overview:
      'Maya is a working artist and filmmaker who mentors one kid at a time through a single ambitious project. She meets weekly, in person or over video, and takes the work seriously from first sketch to opening night. Kids leave with something real they made and can point to.',
    approach:
      'Maya treats every kid like a real artist with a deadline, warm about the person and honest about the work.',
    format: 'hybrid',
    location: 'Los Angeles, CA (or video)',
    priceRange: '$900 to $2,200',
    orgType: 'independent',
    templates: ['make-something-real'],
    verified: true,
    testimonials: [
      {
        quote:
          'Maya never once made my son feel like a kid playing around. She made him feel like a filmmaker.',
        attribution: 'Daniel, parent of Theo, 12',
      },
      {
        quote: 'My comic went from a notebook doodle to something people lined up to read.',
        attribution: 'Priya, 13',
      },
    ],
  },
  {
    key: 'groundwork-youth',
    name: 'Groundwork Youth',
    tagline: 'Turn what you care about into months of real work.',
    overview:
      'Groundwork pairs kids with local nonprofits for a sustained service commitment built around a cause they choose. Coordinators help design a project that lasts a whole season, not a single afternoon. The journey ends with a celebration that includes the community the kid worked alongside.',
    approach:
      'They are convinced that real change comes from showing up again and again, and they build every journey around that.',
    format: 'hybrid',
    location: 'Chicago, IL (or video)',
    priceRange: '$600 to $1,800',
    orgType: 'organization',
    templates: ['make-a-difference'],
    verified: true,
    testimonials: [
      {
        quote:
          "Our daughter stopped asking what her B'Mitzvah would get her and started asking what she could give.",
        attribution: 'Sofia, parent of Ana, 13',
      },
      {
        quote: "The shelter still asks when I'm coming back. That's the part that stuck.",
        attribution: 'Marcus, 13',
      },
    ],
  },
  {
    key: 'jonah-adler-mentoring',
    name: 'Jonah Adler Mentoring',
    tagline: 'A thinking partner for your biggest question.',
    overview:
      'Jonah is a former teacher who guides kids through a self-directed study on a question they choose. Over months of weekly video calls, he helps them read widely, argue carefully, and build a point of view. The journey ends in a talk the kid delivers to a real audience.',
    approach:
      'Jonah never hands over answers, he asks better questions until the kid finds their own.',
    format: 'virtual',
    location: 'Anywhere (video)',
    priceRange: '$700 to $1,600',
    orgType: 'independent',
    templates: ['mind-and-meaning'],
    verified: true,
    testimonials: [
      {
        quote:
          'I watched my kid learn to defend an idea and change his mind in the same conversation.',
        attribution: 'Hana, parent of Sam, 12',
      },
      {
        quote: 'Jonah made me feel like my questions were worth taking seriously.',
        attribution: 'Leah, 13',
      },
    ],
  },
  {
    key: 'open-table-judaism',
    name: 'Open Table Judaism',
    tagline: 'Tradition you get to choose, not inherit.',
    overview:
      "Open Table helps families explore Jewish tradition with no expectation of joining or observing. Kids learn the stories, rituals, and meals behind a B'Mitzvah, then build their own version of the day. It's designed for families who want the roots without the requirements.",
    approach:
      'They lead with invitation over obligation, meeting each family exactly where they already are.',
    format: 'hybrid',
    location: 'Denver, CO (or video)',
    priceRange: '$800 to $2,000',
    orgType: 'organization',
    templates: ['roots-and-rituals', 'my-own-path'],
    verified: true,
    testimonials: [
      {
        quote:
          "We're an interfaith family and always felt like outsiders. Here, nobody asked us to be anything we're not.",
        attribution: 'Chris, parent of Maya, 12',
      },
      {
        quote:
          'I got to keep the parts that felt like us and skip the rest. That was the whole point.',
        attribution: 'Zoe, 13',
      },
    ],
  },
  {
    key: 'north-star-journeys',
    name: 'North Star Journeys',
    tagline: 'For the kid whose idea fits no box.',
    overview:
      "North Star is a new outfit built for fully custom journeys, the ones that don't match any template. A coach helps the kid design a challenge from scratch, find the right guide, and carry it through to a celebration they invent themselves. It's the newest program in our network and still finding its feet.",
    approach:
      "They start from a blank page every time, treating every kid's weird, specific idea as the whole point.",
    format: 'virtual',
    location: 'Anywhere (video)',
    priceRange: '$500 to $1,500',
    orgType: 'organization',
    templates: ['my-own-path'],
    verified: false,
    testimonials: [
      {
        quote:
          "My son's idea was so specific I didn't think anyone could help. They just said, okay, let's build it.",
        attribution: 'Rebecca, parent of Asher, 12',
      },
      {
        quote: 'Nobody told me my plan was too weird. They helped me make it work.',
        attribution: 'Devon, 13',
      },
    ],
  },
]
