import {
  type Hue,
  makeEmojiSticker,
  type SceneComponent,
  TEMPLATE_HUE,
} from '@/components/quiz/scene-kit'
import type { TemplateKey } from '@/lib/content/types'
import {
  Q2CookScene,
  Q2HelpScene,
  Q2MakeScene,
  Q2MixScene,
  Q2OutsideScene,
  Q2RabbitHoleScene,
  Q3BackstageScene,
  Q3CampingScene,
  Q3PlanOwnScene,
  Q3RelativesScene,
  Q3ScienceScene,
  Q3VolunteeringScene,
  Q4DifferentScene,
  Q4IdeaScene,
  Q4IncludeScene,
  Q4OrganizeScene,
  Q4ResearchScene,
  Q5ArtScene,
  Q5DebateScene,
  Q5FoodScene,
  Q5OutdoorScene,
  Q5OwnClubScene,
  Q5VolunteerScene,
} from './q2-q5'
import {
  Q6ArtScene,
  Q6CausesScene,
  Q6FactsScene,
  Q6MapScene,
  Q6MixScene,
  Q6PhotosScene,
  Q7BetterScene,
  Q7FiguredScene,
  Q7MadeScene,
  Q7OutdoorsScene,
  Q7OwnWayScene,
  Q7TraditionScene,
  Q8EditScene,
  Q8EventScene,
  Q8FireScene,
  Q8HowScene,
  Q8RandomScene,
  Q8RecipeScene,
  Q9AdventurousScene,
  Q9DifferenceScene,
  Q9FamilyScene,
  Q9SurpriseScene,
  Q9TaughtScene,
  Q9UnforgettableScene,
  Q10HelpedScene,
  Q10OutsideScene,
  Q10ShowScene,
  Q10TableScene,
  Q10UnderstandingScene,
  Q10YourWayScene,
} from './q6-q10'
import {
  IntoTheWildTemplateScene,
  MakeADifferenceTemplateScene,
  MakeSomethingRealTemplateScene,
  MindAndMeaningTemplateScene,
  MyOwnPathTemplateScene,
  RootsAndRitualsTemplateScene,
} from './templates'
import {
  AdventurousScene,
  BoldScene,
  CaringScene,
  CozyScene,
  CreativeScene,
  CuriousScene,
  DreamerScene,
  FunnyScene,
  LoyalScene,
  OrganizedScene,
  ThoughtfulScene,
  WildScene,
} from './words'

// Every quiz option's illustration, keyed by its stable option id, with the
// hue of the option's dominant-weight journey — so each answer's color
// quietly hints at where it leads. Quiz content is admin-editable: any id
// not in here falls back to an animated emoji sticker (sceneEntryFor).

export type SceneEntry = {
  readonly scene: SceneComponent
  readonly hue: Hue
}

const entry = (scene: SceneComponent, hue: Hue): SceneEntry => ({ scene, hue })

export const OPTION_SCENES: Record<string, SceneEntry> = {
  // Q1 words
  'q1-adventurous': entry(AdventurousScene, 'wild'),
  'q1-wild': entry(WildScene, 'wild'),
  'q1-creative': entry(CreativeScene, 'real'),
  'q1-funny': entry(FunnyScene, 'real'),
  'q1-caring': entry(CaringScene, 'diff'),
  'q1-organized': entry(OrganizedScene, 'diff'),
  'q1-curious': entry(CuriousScene, 'mind'),
  'q1-thoughtful': entry(ThoughtfulScene, 'mind'),
  'q1-cozy': entry(CozyScene, 'roots'),
  'q1-loyal': entry(LoyalScene, 'roots'),
  'q1-dreamer': entry(DreamerScene, 'path'),
  'q1-bold': entry(BoldScene, 'path'),
  // Q2 free Saturday
  'q2-outside': entry(Q2OutsideScene, 'wild'),
  'q2-make': entry(Q2MakeScene, 'real'),
  'q2-help': entry(Q2HelpScene, 'diff'),
  'q2-rabbit-hole': entry(Q2RabbitHoleScene, 'mind'),
  'q2-cook': entry(Q2CookScene, 'roots'),
  'q2-mix': entry(Q2MixScene, 'path'),
  // Q3 weekend trip
  'q3-camping': entry(Q3CampingScene, 'wild'),
  'q3-backstage': entry(Q3BackstageScene, 'real'),
  'q3-volunteering': entry(Q3VolunteeringScene, 'diff'),
  'q3-science': entry(Q3ScienceScene, 'mind'),
  'q3-relatives': entry(Q3RelativesScene, 'roots'),
  'q3-plan-own': entry(Q3PlanOwnScene, 'path'),
  // Q4 take the lead
  'q4-organize': entry(Q4OrganizeScene, 'diff'),
  'q4-idea': entry(Q4IdeaScene, 'real'),
  'q4-research': entry(Q4ResearchScene, 'mind'),
  'q4-include': entry(Q4IncludeScene, 'diff'),
  'q4-different': entry(Q4DifferentScene, 'path'),
  // Q5 after-school club
  'q5-outdoor': entry(Q5OutdoorScene, 'wild'),
  'q5-art': entry(Q5ArtScene, 'real'),
  'q5-volunteer': entry(Q5VolunteerScene, 'diff'),
  'q5-debate': entry(Q5DebateScene, 'mind'),
  'q5-food': entry(Q5FoodScene, 'roots'),
  'q5-own-club': entry(Q5OwnClubScene, 'path'),
  // Q6 empty wall
  'q6-map': entry(Q6MapScene, 'wild'),
  'q6-art': entry(Q6ArtScene, 'real'),
  'q6-causes': entry(Q6CausesScene, 'diff'),
  'q6-facts': entry(Q6FactsScene, 'mind'),
  'q6-photos': entry(Q6PhotosScene, 'roots'),
  'q6-mix': entry(Q6MixScene, 'path'),
  // Q7 proud of
  'q7-outdoors': entry(Q7OutdoorsScene, 'wild'),
  'q7-made': entry(Q7MadeScene, 'real'),
  'q7-better': entry(Q7BetterScene, 'diff'),
  'q7-figured': entry(Q7FiguredScene, 'mind'),
  'q7-tradition': entry(Q7TraditionScene, 'roots'),
  'q7-own-way': entry(Q7OwnWayScene, 'path'),
  // Q8 would you rather learn
  'q8-fire': entry(Q8FireScene, 'wild'),
  'q8-edit': entry(Q8EditScene, 'real'),
  'q8-event': entry(Q8EventScene, 'diff'),
  'q8-how': entry(Q8HowScene, 'mind'),
  'q8-recipe': entry(Q8RecipeScene, 'roots'),
  'q8-random': entry(Q8RandomScene, 'path'),
  // Q9 story of the big day
  'q9-adventurous': entry(Q9AdventurousScene, 'wild'),
  'q9-unforgettable': entry(Q9UnforgettableScene, 'real'),
  'q9-difference': entry(Q9DifferenceScene, 'diff'),
  'q9-taught': entry(Q9TaughtScene, 'mind'),
  'q9-family': entry(Q9FamilyScene, 'roots'),
  'q9-surprise': entry(Q9SurpriseScene, 'path'),
  // Q10 best part when done
  'q10-outside': entry(Q10OutsideScene, 'wild'),
  'q10-show': entry(Q10ShowScene, 'real'),
  'q10-helped': entry(Q10HelpedScene, 'diff'),
  'q10-understanding': entry(Q10UnderstandingScene, 'mind'),
  'q10-table': entry(Q10TableScene, 'roots'),
  'q10-your-way': entry(Q10YourWayScene, 'path'),
}

export const TEMPLATE_SCENES: Record<TemplateKey, SceneComponent> = {
  'into-the-wild': IntoTheWildTemplateScene,
  'make-something-real': MakeSomethingRealTemplateScene,
  'make-a-difference': MakeADifferenceTemplateScene,
  'mind-and-meaning': MindAndMeaningTemplateScene,
  'roots-and-rituals': RootsAndRitualsTemplateScene,
  'my-own-path': MyOwnPathTemplateScene,
}

// The six hues, in template order, for rotating a fallback hue by index.
const HUE_ROTATION: readonly Hue[] = ['wild', 'real', 'diff', 'mind', 'roots', 'path']

// Scene lookup with a graceful fallback: admin-authored options the library
// has never seen get an animated emoji sticker in a rotating hue.
export function sceneEntryFor(optionId: string, emoji: string, index: number): SceneEntry {
  const known = OPTION_SCENES[optionId]
  if (known) return known
  const hue = HUE_ROTATION[index % HUE_ROTATION.length] ?? 'path'
  return { scene: makeEmojiSticker(emoji, hue), hue }
}

export function templateScene(template: TemplateKey): SceneEntry {
  return { scene: TEMPLATE_SCENES[template], hue: TEMPLATE_HUE[template] }
}
