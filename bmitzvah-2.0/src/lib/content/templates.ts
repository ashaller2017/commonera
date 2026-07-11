import type { JourneyTemplate } from './types'

export const TEMPLATES: readonly JourneyTemplate[] = [
  {
    key: 'into-the-wild',
    name: 'Into the Wild',
    emoji: '🌲',
    tagline: 'Your big day belongs outside.',
    description:
      'This journey happens on trails, rivers, and open sky, not in a classroom. You pick a piece of the natural world to explore, protect, or push yourself into. By the end you know it, and yourself, a whole lot better.',
    themes: ['nature', 'outdoors', 'environment', 'adventure'],
    jewishLens:
      "There's an old Jewish idea that we are meant to be caretakers of the earth, not just visitors on it. If that speaks to you, your time outside can be part of that too.",
    celebrationIdeas: [
      'An outdoor ceremony at a favorite park, lake, or trailhead that ends with everyone planting something together.',
      'A campfire or sunrise gathering where you share what a year outdoors taught you.',
    ],
    gettingStarted: [
      'Pick one outdoor spot you can reach easily and go visit it with a notebook.',
      'Text two friends who would actually show up for a hike or a cleanup and set a date.',
      'Find your closest park district or animal shelter online and email to ask what they need.',
    ],
    providerTypes: ['outdoor educators', 'wilderness guides', 'environmental mentors'],
    milestones: [
      {
        title: 'Choose Your Wild',
        description:
          'Pick the landscape or cause that pulls at you, from local trails to the ocean.',
      },
      {
        title: 'Learn the Land',
        description: 'Study your chosen place until you understand how it actually works.',
      },
      {
        title: 'Get Your Hands Dirty',
        description: 'Take on a real outdoor challenge or restoration project over several weeks.',
      },
      {
        title: 'Go Further',
        description:
          'Push into something harder: a longer trek, a solo skill, a bigger commitment.',
      },
      {
        title: 'Share the View',
        description: 'Bring people into what you found and why it matters to you.',
      },
      {
        title: 'Celebrate Outside',
        description: 'Mark the day in the wild, with everyone who cheered you on.',
      },
    ],
  },
  {
    key: 'make-something-real',
    name: 'Make Something Real',
    emoji: '🎨',
    tagline: 'Turn an idea into something people can see.',
    description:
      "This journey is about making: art, music, film, code, a zine, a whole show. You choose what to build, learn the craft, and keep going until it's finished and out in the world. The point isn't perfect, it's real.",
    themes: ['creative', 'performance', 'craft', 'building'],
    jewishLens:
      'Jewish tradition has always treated making beautiful things as a kind of devotion, calling it hiddur, the effort to make something ordinary lovely. Your project can carry that spirit if you want it to.',
    celebrationIdeas: [
      'Turn the celebration into a gallery or premiere night where your work is the main event.',
      'A live set you plan and headline: a band, a DJ booth, or a spoken-word stage.',
    ],
    gettingStarted: [
      'Pick the one medium you already love and set a tiny first deadline, like one piece by Friday.',
      'Follow three makers whose work you love and copy one technique to learn it.',
      'Ask a local cafe, library, or studio if you can show or perform your work there.',
    ],
    providerTypes: ['artists', 'performance coaches', 'maker studios'],
    milestones: [
      {
        title: 'Pick Your Medium',
        description: "Choose the thing you want to make and can't stop thinking about.",
      },
      {
        title: 'Learn the Craft',
        description: 'Find a mentor or method and build the skills the project needs.',
      },
      {
        title: 'Rough First Draft',
        description: 'Make a messy early version so you have something to improve.',
      },
      {
        title: 'Refine It',
        description: "Rework it again and again until it's genuinely yours.",
      },
      {
        title: 'Ready to Show',
        description: 'Get the finished piece polished and set up for an audience.',
      },
      {
        title: 'Opening Night',
        description: 'Unveil your work at a showcase built around what you made.',
      },
    ],
  },
  {
    key: 'make-a-difference',
    name: 'Make a Difference',
    emoji: '✊',
    tagline: 'Leave something better than you found it.',
    description:
      'This journey turns care into action. You find a problem you actually care about, then spend months doing something real about it, not a one-off, a sustained effort. You end up close to the people and place you helped.',
    themes: ['service', 'social impact', 'community', 'justice'],
    jewishLens:
      "There's a Jewish phrase, Tikkun Olam, the idea that the world is unfinished and yours to help repair. This whole journey is basically that idea, if it resonates.",
    celebrationIdeas: [
      'A give-back party: ask for donations to your cause instead of gifts and show guests the impact.',
      'Fold a group service project into the day so everyone leaves having helped.',
    ],
    gettingStarted: [
      'Name the one thing about the world that makes you angry or sad, and start there.',
      'Find one local org already doing that work and ask how a 12 year old can plug in.',
      'Set a small real goal this week, like collecting 50 items or raising your first 50 dollars.',
    ],
    providerTypes: ['service organizations', 'community mentors', 'nonprofit partners'],
    milestones: [
      {
        title: 'Find Your Cause',
        description: 'Choose a problem close to you that you refuse to ignore.',
      },
      {
        title: 'Learn the Real Story',
        description: 'Talk to people living it so you understand what actually helps.',
      },
      {
        title: 'Make a Plan',
        description: 'Design a commitment you can keep for months, not just a day.',
      },
      {
        title: 'Show Up Again',
        description: 'Do the work steadily, even when it stops feeling new.',
      },
      {
        title: 'See Your Impact',
        description: 'Look back at what changed and what you learned doing it.',
      },
      {
        title: 'Celebrate Together',
        description: 'Mark the day with the community you spent months beside.',
      },
    ],
  },
  {
    key: 'mind-and-meaning',
    name: 'Mind & Meaning',
    emoji: '📖',
    tagline: "Chase a question that won't let you go.",
    description:
      "This journey is for the ones who love to think. You pick a real question, big, weird, or personal, and dig into it for months like your own private investigation. At the end you don't just have an answer, you have a point of view.",
    themes: ['learning', 'ideas', 'independent study', 'philosophy'],
    jewishLens:
      "Jewish learning has always prized the question over the easy answer, arguing with the text instead of just accepting it. If you like wrestling with hard ideas, you're in good company.",
    celebrationIdeas: [
      'A salon evening where you present your findings and take real questions from guests.',
      'A printed booklet or website of your research handed to everyone who comes.',
    ],
    gettingStarted: [
      'Write down the one question you would stay up late reading about and make it your project.',
      'Get a library card or one strong source this week and start taking notes.',
      'Book one 15 minute interview with someone who knows more than you.',
    ],
    providerTypes: ['tutors', 'subject mentors', 'independent scholars'],
    milestones: [
      {
        title: 'Ask a Big Question',
        description: 'Choose a question that genuinely keeps you up at night.',
      },
      {
        title: 'Gather the Evidence',
        description: 'Read, watch, and collect what people already think about your question.',
      },
      {
        title: 'Go to the Source',
        description: 'Interview people or explore places that bring your question to life.',
      },
      {
        title: 'Form Your View',
        description: 'Wrestle with what you found until you actually believe something.',
      },
      {
        title: 'Make It Make Sense',
        description: 'Shape your thinking into a talk, essay, or project others can follow.',
      },
      {
        title: 'Present and Celebrate',
        description: 'Share your idea with a room, then celebrate what your mind built.',
      },
    ],
  },
  {
    key: 'roots-and-rituals',
    name: 'Roots & Rituals',
    emoji: '🕯️',
    tagline: 'Old traditions, entirely on your terms.',
    description:
      'This journey is for the tradition-curious. You explore the rituals, stories, and recipes your family comes from, and choose which ones feel like yours to keep. Nothing is required, everything is an invitation. You end up with your own version of tradition.',
    themes: ['tradition', 'family', 'heritage', 'story'],
    jewishLens:
      "A B'Mitzvah has always been a moment of stepping into your own place in a long story. Here you get to decide which threads of that story you want to carry forward, and how.",
    celebrationIdeas: [
      'A multi-generation dinner where each generation shares a story or a blessing in their own words.',
      'A display of family photos and objects with the story you collected placed next to each one.',
    ],
    gettingStarted: [
      'Call or sit with one older relative this week and ask them a single question about their childhood.',
      'Pick the family recipe you love most and find out who it came from.',
      'Start a notes file for every family story you hear so none of them get lost.',
    ],
    providerTypes: ['culture guides', 'family ritual mentors', 'independent educators'],
    milestones: [
      {
        title: 'Open the Story',
        description: 'Choose the traditions and family history you want to explore.',
      },
      {
        title: 'Ask Your Elders',
        description: 'Talk to family about the rituals, recipes, and memories they carry.',
      },
      {
        title: 'Try It On',
        description: 'Practice a few traditions firsthand to see which ones feel like yours.',
      },
      {
        title: 'Make It Yours',
        description: 'Adapt what you keep so it fits who you actually are.',
      },
      {
        title: 'Write Your Version',
        description: 'Shape your own ceremony, words, or ritual for the day.',
      },
      {
        title: 'Gather and Celebrate',
        description: 'Bring everyone together for the tradition you built yourself.',
      },
    ],
  },
  {
    key: 'my-own-path',
    name: 'My Own Path',
    emoji: '✨',
    tagline: 'None of these? Build your own.',
    description:
      "Same journey, blank canvas. You get the exact structure everyone else gets, the milestones, the mentor, the celebration, but you fill it with whatever you're actually into. Mash up two ideas, invent a challenge, go somewhere none of the templates go.",
    themes: ['custom', 'independent', 'original', 'hybrid'],
    jewishLens:
      "Becoming B'Mitzvah has always meant taking ownership: standing up and saying this is mine now. Designing your own path from scratch might be the most honest way to do exactly that.",
    celebrationIdeas: [
      'A celebration you fully art-direct, mixing whatever you love: outdoor, music, food, and all.',
      'An unveiling where you reveal the custom thing you built and explain why you did it your way.',
    ],
    gettingStarted: [
      'List five things you love that do not usually go together and look for the overlap.',
      'Steal one idea from each of the other journeys and mix them into a shortlist.',
      'Give your journey a name only you would pick and write it somewhere you will see it.',
    ],
    providerTypes: ['generalist mentors', 'project coaches', 'independent guides'],
    milestones: [
      {
        title: 'Dream It Up',
        description: 'Sketch the journey you actually want, even if it fits no box.',
      },
      {
        title: 'Set Your Challenge',
        description: "Define the real goal you'll have to stretch to reach.",
      },
      {
        title: 'Find Your Guide',
        description: 'Line up a mentor or resource who fits your particular idea.',
      },
      {
        title: 'Build the Middle',
        description: 'Do the months of real work your challenge demands.',
      },
      {
        title: 'Pull It Together',
        description: 'Shape everything you did into something you can share.',
      },
      {
        title: 'Celebrate Your Way',
        description: 'Mark the day exactly how you imagined it from the start.',
      },
    ],
  },
]
