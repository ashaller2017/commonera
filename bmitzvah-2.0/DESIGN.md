# Design

Visual system for B'Mitzvah 2.0. Register: product. Mood sentence: a summer-camp lake at golden hour, teal water and campfire warmth, energy that feels earned rather than assigned.

## Color

Strategy: committed on child surfaces (the chosen journey's color carries identity across the dashboard), restrained on parent surfaces (tinted neutrals, teal primary, color reserved for the kids' journey chips). Body background is pure white; warmth lives in the brand colors and type, never in a cream surface.

Core tokens (OKLCH):

- `--background`: oklch(1 0 0), pure white
- `--foreground` (ink): oklch(0.22 0.015 200)
- `--muted-foreground`: oklch(0.45 0.02 200), 4.5:1+ on white
- `--surface`: oklch(0.965 0.01 180), teal-tinted panel
- `--border`: oklch(0.90 0.012 190)
- `--primary`: oklch(0.52 0.11 180), deep lake teal; white text on fills
- `--primary-strong`: oklch(0.44 0.10 180), hover
- `--accent` (celebration gold): oklch(0.86 0.11 85) pale honey, ink text on it; `--accent-deep`: oklch(0.46 0.09 75) for gold text/icons on white

Per-template identities, hues spaced 30°+ apart. Each template gets `base` (chips, fills, white text), `soft` (L 0.95, C 0.035 tint background), `deep` (L 0.34, C 0.09 text on soft):

- into-the-wild: hue 150 forest, base oklch(0.52 0.12 150)
- make-something-real: hue 355 magenta, base oklch(0.58 0.16 355)
- make-a-difference: hue 25 tomato, base oklch(0.55 0.16 25)
- mind-and-meaning: hue 265 indigo, base oklch(0.50 0.13 265)
- roots-and-rituals: hue 70 candlelight amber, base oklch(0.58 0.12 70)
- my-own-path: hue 305 violet, base oklch(0.54 0.14 305)

Rules: white text on all base fills (Helmholtz-Kohlrausch), deep-on-soft for tinted panels, never gray text on tinted backgrounds (use the hue's own deep). No side-stripe borders, no gradient text, no glassmorphism.

## Typography

Pairing on the serif/sans contrast axis:

- Display: Fraunces (variable, optical size + wonk), weights 550 to 640, for hero, journey names, section heads. Letter-spacing never tighter than -0.03em. `text-wrap: balance` on h1 to h3.
- Body/UI: Nunito Sans (variable), 400 to 800. Body 16px/1.6, max 70ch.

Both self-hosted via @fontsource-variable packages. No CDN fonts.

## Shape and space

- Radius scale: 10px (inputs), 16px (panels), 24px (feature tiles), 999px (pills, buttons). Generous roundness is the playful register; type keeps it from going childish.
- Spacing: 4px base; sections breathe at 96 to 128px on landing, 24 to 40px in app.
- Buttons are pills. Primary = teal fill, white text. Template-colored fills only on child journey surfaces.

## Motion

CSS-only. Ease-out-quart (`cubic-bezier(0.25, 1, 0.5, 1)`), 150 to 350ms. Quiz steps slide-fade 16px; milestone completion does a single scale-settle pop (1 to 1.06 to 1) plus color fill, no bounce. Progress bars animate width 400ms. Every animation has a `prefers-reduced-motion: reduce` alternative (crossfade or none). No scroll-triggered reveal gating; content is visible by default.

## Components

Base UI primitives via basecn (shadcn-style, `src/components/ui/*`): button, input, label, textarea, select, dialog, tabs, progress, badge. Composed app components live in `src/components/`. Cards only where a card is truly the right affordance; milestone map is a connected path list, not a card grid.

## Voice in UI

Second person, smart-older-sibling. Buttons say what happens ("Start my journey", "Mark it done"), never "Submit". Errors are human ("That username's taken, try another"). No exclamation-point pileups, no institutional language, no em dashes.
