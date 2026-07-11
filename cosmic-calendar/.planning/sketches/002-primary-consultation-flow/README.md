---
sketch: 002
name: primary-consultation-flow
question: "Which first-session structure best carries a zero-context user through season reading, Jewish-root discovery, birth profile, and return cadence?"
winner: null
tags: [mobile, onboarding, season-reading, birth-profile, return-cadence]
---

# Sketch 002: Primary Consultation Flow

## Design Question

Which first-session structure best moves a user with no Hebrew-calendar context from the universal hook into a share-worthy season reading, an earned discovery of the Jewish root, a personal birth profile, and a clear reason to return?

This is a disposable flow sketch, not the app implementation. It uses one fixed Tammuz content set so the comparison is about information structure and interaction rather than changing copy.

## How to View

```bash
open .planning/sketches/002-primary-consultation-flow/index.html
```

The sketch is mobile-first at 390 × 844 and scales to tablet and desktop. Use the top tabs to compare variants. The bottom-right sketch toolbar switches theme and viewport and enables style inspection.

## Variants

- **A: Midnight Almanac** — a calm editorial scroll that makes the season reading feel like a page in a premium journal.
- **B: Lunar Instrument** — a sparse, data-forward moon dial that makes Season, Ritual, and Coming Up feel like parts of one living calendar.
- **C: Ember Card Deck** — a compact 9:16 card sequence optimized for tactile progression and share-worthiness.

## Functional Loops

- Enter the season from the universal landing hook.
- Open the source-aware Jewish-calendar discovery layer.
- Enter a birthday, validate it, and render a Hebrew-calendar birth profile using the browser's Hebrew calendar support.
- Open the Friday Pulse state and inspect the upcoming moon moment.
- Share the current reading through the native share sheet when available, with a clipboard fallback.
- Switch variants, themes, and preview widths; toggle style inspection.

## What to Look For

- Which structure makes the reading feel most like something to consult rather than an app to operate?
- Which reveals the Jewish/Kabbalistic grounding as an interesting discovery without making it a prerequisite?
- Which keeps the birthday flow and return cadence visible without competing with the Season Card?
- Which feels most naturally shareable on a phone?

## Content and Source Boundary

- Tammuz energy and ritual are adapted directly from PRD §5.
- Cancer, Reuben, Chet, and sight follow the project's adopted Gra / Arizal-Gra research spine in `.planning/research/MONTH-ATTRIBUTIONS.md`.
- The grounding layer names that lineage instead of presenting the mapping as universal.
- Personalized language is explicitly framed as a reflective prototype, never prediction or fate.
- No explicit Jewish symbols or Divine-name permutations are used.
