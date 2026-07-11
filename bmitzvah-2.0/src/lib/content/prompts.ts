import type { ActivityPrompt } from './types'

export const ACTIVITY_PROMPTS: readonly ActivityPrompt[] = [
  {
    id: 'wild-trail-restore',
    template: 'into-the-wild',
    kind: 'do',
    title: 'Trail You Restore',
    description:
      'Adopt a nearby trail and make it your project: clear litter, log the plants and animals you spot, and leave it better than you found it.',
  },
  {
    id: 'wild-pollinator-patch',
    template: 'into-the-wild',
    kind: 'do',
    title: 'Plant A Pollinator Patch',
    description:
      'Grow a small butterfly and bee garden with native flowers and track who shows up.',
  },
  {
    id: 'wild-night-under-stars',
    template: 'into-the-wild',
    kind: 'learn',
    title: 'One Night Under Stars',
    description:
      'Plan a supervised overnight campout and learn to build a safe fire and read a trail map.',
  },
  {
    id: 'wild-grow-and-give',
    template: 'into-the-wild',
    kind: 'give',
    title: 'Grow And Give Garden',
    description: 'Start a vegetable patch and donate the harvest to a food bank.',
  },
  {
    id: 'wild-shelter-makeover',
    template: 'into-the-wild',
    kind: 'give',
    title: 'Shelter Makeover Day',
    description:
      'Volunteer at an animal rescue: make pet toys, walk dogs, and help paint an adoption room.',
  },
  {
    id: 'wild-map-wild-places',
    template: 'into-the-wild',
    kind: 'create',
    title: 'Map Your Wild Places',
    description: 'Build a photo map of local wild spots and write a short field guide to share.',
  },
  {
    id: 'wild-cleanup-crew',
    template: 'into-the-wild',
    kind: 'do',
    title: 'Cleanup Crew You Lead',
    description:
      'Organize a beach, river, or park cleanup with friends and weigh what you haul out.',
  },
  {
    id: 'wild-outdoor-skill',
    template: 'into-the-wild',
    kind: 'learn',
    title: 'Learn One Outdoor Skill',
    description:
      'Pick a real skill like knots, navigation, first aid, or foraging basics, and get good enough to teach it.',
  },
  {
    id: 'real-art-show',
    template: 'make-something-real',
    kind: 'create',
    title: 'Your Own Art Show',
    description:
      'Make a series of pieces, host a show, sell prints, and give the money to a cause.',
  },
  {
    id: 'real-record-song',
    template: 'make-something-real',
    kind: 'create',
    title: 'Write And Record A Song',
    description: 'Write an original song about something you believe in and record it for real.',
  },
  {
    id: 'real-short-film',
    template: 'make-something-real',
    kind: 'create',
    title: 'Short Film You Direct',
    description: 'Script, shoot, and edit a short film or mini documentary about your world.',
  },
  {
    id: 'real-instruments-for-kids',
    template: 'make-something-real',
    kind: 'give',
    title: 'Instruments For Kids',
    description:
      'Collect used instruments and give them to a school music program that needs gear.',
  },
  {
    id: 'real-design-the-look',
    template: 'make-something-real',
    kind: 'create',
    title: 'Design The Whole Look',
    description: 'Design your own invitations, logo, and space so the day looks exactly like you.',
  },
  {
    id: 'real-perform-your-story',
    template: 'make-something-real',
    kind: 'create',
    title: 'Perform Your Story',
    description:
      'Write and perform a monologue, spoken word piece, or short set about becoming who you are.',
  },
  {
    id: 'real-build-real-thing',
    template: 'make-something-real',
    kind: 'create',
    title: 'Build A Real Thing',
    description:
      'Use wood, code, or fabric to build something useful and give it away, like park benches, an app, or blankets.',
  },
  {
    id: 'real-craft-workshop',
    template: 'make-something-real',
    kind: 'do',
    title: 'Teach A Craft Workshop',
    description: 'Run a hands-on craft station and teach younger kids your skill.',
  },
  {
    id: 'diff-community-fridge',
    template: 'make-a-difference',
    kind: 'give',
    title: 'Fill A Community Fridge',
    description: 'Organize food drives and keep a local free fridge or pantry stocked.',
  },
  {
    id: 'diff-bake-fund-cause',
    template: 'make-a-difference',
    kind: 'give',
    title: 'Bake To Fund A Cause',
    description:
      'Run a bake sale or bake-for-change to raise money and attention for something you care about.',
  },
  {
    id: 'diff-care-packages',
    template: 'make-a-difference',
    kind: 'give',
    title: 'Care Packages At Scale',
    description:
      'Assemble hygiene and comfort kits for shelters or hospitals: toiletries, hats, socks, and small games.',
  },
  {
    id: 'diff-cheer-squad',
    template: 'make-a-difference',
    kind: 'do',
    title: 'Cheer Squad For Hospitals',
    description: 'Train to visit sick kids or seniors with games, jokes, and balloon animals.',
  },
  {
    id: 'diff-run-fundraiser',
    template: 'make-a-difference',
    kind: 'do',
    title: 'Run A Real Fundraiser',
    description:
      'Plan a walk, tournament, or event from start to finish and pick where the money goes.',
  },
  {
    id: 'diff-glean-rescue-food',
    template: 'make-a-difference',
    kind: 'give',
    title: 'Glean And Rescue Food',
    description: 'Join a food-rescue crew that harvests extra produce for people who need it.',
  },
  {
    id: 'diff-pen-pal',
    template: 'make-a-difference',
    kind: 'do',
    title: 'Pen Pal With A Purpose',
    description: 'Become a pen pal or tech buddy for homebound seniors.',
  },
  {
    id: 'diff-map-a-problem',
    template: 'make-a-difference',
    kind: 'learn',
    title: "Map A Problem You'd Fix",
    description:
      'Pick one issue in your town, research it, and pitch a small fix to a local group.',
  },
  {
    id: 'mind-deep-dive',
    template: 'mind-and-meaning',
    kind: 'learn',
    title: 'Deep Dive On One Question',
    description:
      'Pick a big question you actually wonder about and spend weeks becoming the expert.',
  },
  {
    id: 'mind-mini-lecture',
    template: 'mind-and-meaning',
    kind: 'learn',
    title: 'Teach A Mini Lecture',
    description: 'Turn what you learned into a short, fun, TED-style talk.',
  },
  {
    id: 'mind-podcast-or-zine',
    template: 'mind-and-meaning',
    kind: 'create',
    title: 'Start A Podcast Or Zine',
    description: 'Interview people and publish what you find out about your topic.',
  },
  {
    id: 'mind-retell-story',
    template: 'mind-and-meaning',
    kind: 'create',
    title: 'Retell An Old Story New',
    description: 'Take an old family or culture story and rewrite it with your own meaning.',
  },
  {
    id: 'mind-working-model',
    template: 'mind-and-meaning',
    kind: 'create',
    title: 'Build A Working Model',
    description:
      'Turn an idea into a real experiment, model, or piece of code that proves your point.',
  },
  {
    id: 'mind-read-a-theme',
    template: 'mind-and-meaning',
    kind: 'learn',
    title: 'Read Across A Whole Theme',
    description: 'Read five books or watch five talks on one theme and map how they connect.',
  },
  {
    id: 'mind-interview-experts',
    template: 'mind-and-meaning',
    kind: 'learn',
    title: 'Interview The Experts',
    description:
      'Find real people who know your topic and interview them for what books leave out.',
  },
  {
    id: 'mind-write-belief',
    template: 'mind-and-meaning',
    kind: 'create',
    title: 'Write What You Believe',
    description: 'Write a short essay or manifesto on one value you have thought hard about.',
  },
  {
    id: 'roots-record-grandparent',
    template: 'roots-and-rituals',
    kind: 'learn',
    title: 'Record A Grandparent',
    description:
      'Interview an older relative on video about their life and save it for the whole family.',
  },
  {
    id: 'roots-family-cookbook',
    template: 'roots-and-rituals',
    kind: 'create',
    title: 'Cook The Family Cookbook',
    description: 'Collect recipes passed down in your family and cook a full meal from them.',
  },
  {
    id: 'roots-family-tree',
    template: 'roots-and-rituals',
    kind: 'learn',
    title: 'Build A Family Tree',
    description:
      'Map your family across countries and faiths and tell the story of how you got here.',
  },
  {
    id: 'roots-story-behind-object',
    template: 'roots-and-rituals',
    kind: 'learn',
    title: 'The Story Behind An Object',
    description: 'Find one meaningful family object and record the story attached to it.',
  },
  {
    id: 'roots-design-ritual',
    template: 'roots-and-rituals',
    kind: 'create',
    title: 'Design Your Own Ritual',
    description:
      'Invent a small ceremony that feels like you, borrowing bits you love: candles, a toast, a walk, a song.',
  },
  {
    id: 'roots-light-and-share',
    template: 'roots-and-rituals',
    kind: 'do',
    title: 'Light And Share Night',
    description:
      'Host a monthly candle-lit dinner where everyone shares a high and a low from the week.',
  },
  {
    id: 'roots-memory-book',
    template: 'roots-and-rituals',
    kind: 'create',
    title: 'Make A Memory Book',
    description: "Build a scrapbook or photo book of your family's people, places, and stories.",
  },
  {
    id: 'roots-where-you-come-from',
    template: 'roots-and-rituals',
    kind: 'learn',
    title: 'Learn Where You Come From',
    description: 'Pick one side of your family and learn its traditions, language, or holidays.',
  },
  {
    id: 'path-remix-journeys',
    template: 'my-own-path',
    kind: 'create',
    title: 'Remix Two Journeys',
    description:
      'Take pieces from two different journeys and blend them into one that is only yours.',
  },
  {
    id: 'path-30-day-challenge',
    template: 'my-own-path',
    kind: 'do',
    title: 'The 30 Day Challenge',
    description:
      'Design a personal challenge, a skill, a streak, or a quest, and document all 30 days.',
  },
  {
    id: 'path-own-rulebook',
    template: 'my-own-path',
    kind: 'create',
    title: 'Build Your Own Rulebook',
    description:
      'Write your own list of what this milestone means and what you will do to earn it.',
  },
  {
    id: 'path-sampler-season',
    template: 'my-own-path',
    kind: 'do',
    title: 'Try A Sampler Season',
    description: 'Try one activity from every other journey and keep the ones that click.',
  },
  {
    id: 'path-passion-project',
    template: 'my-own-path',
    kind: 'create',
    title: 'Passion Into A Project',
    description:
      'Take the thing you are already obsessed with and turn it into your whole journey.',
  },
  {
    id: 'path-mentor-collab',
    template: 'my-own-path',
    kind: 'learn',
    title: 'Collaborate With A Mentor',
    description:
      'Find one adult who does something you admire and learn by doing it alongside them.',
  },
  {
    id: 'path-time-capsule',
    template: 'my-own-path',
    kind: 'create',
    title: 'Make A Time Capsule',
    description: 'Capture who you are right now in a box or a file to open at 18.',
  },
  {
    id: 'path-document-journey',
    template: 'my-own-path',
    kind: 'create',
    title: 'Document The Whole Thing',
    description: 'Vlog, blog, or journal your journey so the process itself is the project.',
  },
]
