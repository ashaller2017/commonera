# Cosmic Calendar

## What This Is

A lunar-wisdom / seasonal-reading web app that tells you what this season holds —
through reflection cards, seasonal archetypes, and tiny rituals. The lead
experience is universal ("what does this season hold?"); the system underneath is
the Hebrew calendar (12 months, each with a zodiac sign, tribe, Hebrew letter,
sense, and energy, rooted in Kabbalistic tradition / Sefer Yetzirah). Built for
culturally Jewish millennials and Gen Z who are into astrology, wellness, or lunar
practices but have never met the Jewish calendar as a living wisdom tradition.

## Core Value

A user with zero knowledge of the Hebrew calendar gets a meaningful, beautiful,
shareable season reading in under 60 seconds — and the Jewish layer lands as a
delightful discovery, never a requirement.

## Business Context

<!-- Sprint prototype for Common Era (CE). Not monetized in this sprint. -->

- **Customer**: Culturally Jewish millennials / Gen Z (astrology/wellness/lunar
  audience); secondary: spiritually curious non-Jews. Persona: "Noa, 22."
- **Revenue model**: N/A this sprint — prototype to validate the concept for CE.
- **Success metric**: Season Card is shared unprompted (≥1 in 5 test users would
  send it to a friend); Jewish layer described as "interesting/surprising," not
  off-putting.
- **Strategy notes**: See `Cosmic Calendar PRD __ COMMON ERA × VIBE CODING.md`.

## Current Milestone: v1.0 Two-Hour Mobile Prototype

**Goal:** Deliver a convincing mobile-first welcome-to-reading prototype that
covers every PRD must-have while keeping final content, assets, and astrology
interaction replaceable.

**Target features:**
- Six-state mobile flow: welcome → zodiac transition → optional birthday →
  conditional personal reveal → current-month reading → moon/Friday upcoming.
- Pre-authored static readings and twelve lightweight birth-month profiles with
  no runtime AI, server, database, login, or account.
- Blue Zodiac visual system, soft vertical settling, `easeInOutCubic` motion,
  screenshot-ready compositions, and reduced-motion parity.
- A mostly-static final return-cadence panel for Friday Pulse and moon moments.

## Requirements

### Validated

- ✓ Zero-login welcome-to-upcoming navigation through either the birthday or skip path — Phase 1

### Active

<!-- Hypotheses until shipped. Sourced from PRD §4 "Must Have" + §6 core flow. -->

- [ ] Season Reading for the auto-detected current Hebrew month — energy/archetype,
      zodiac sign + current moon phase, one tiny ritual, Hebrew month name
      (English primary, Hebrew secondary). Beautiful, readable, screenshot-shareable.
- [ ] Works for someone who has never heard of the Hebrew calendar (no Hebrew in
      the primary hook).
- [ ] Discoverable Kabbalistic grounding — a tappable/info layer explaining what
      the system is and where it comes from (2-3 sentences, surprising not academic).
- [ ] Birthday reading / birth profile — enter birthday → Hebrew birth date, sign,
      tribe, moon phase at birth, Hebrew letter, tikkun framing, personalized reading.
- [ ] "What's coming up" panel — Friday Pulse teaser/countdown (rooted in Shabbat,
      named universally) + next full/new moon date when within ~7 days.

### Out of Scope

<!-- From PRD §4 "Not This Sprint." Reasons prevent re-adding. -->

- Full planetary Mazal chart mapped to Sefirot — requires an astronomy API; strong v2.
- Full Jewish holiday calendar — beyond the season/birth-profile core.
- Time zones — too complex for the sprint.
- Torah / religious / observance content — stay wisdom, not synagogue tone.
- Social / community features — not core to the return mechanic this sprint.
- Prediction / fate-telling — tone is invitation ("this season invites…"), not fortune.
- Login / user accounts — zero-friction is a core value.

## Context

- **Source of truth**: the PRD (`Cosmic Calendar PRD __ COMMON ERA × VIBE CODING.md`)
  defines product requirements, content boundaries, and success criteria. The
  user-approved six-state flow and Blue Zodiac/light-paper direction supersede
  the PRD's suggested screen order and dark visual treatment. The month content
  table remains a starting point, not a locked content spec.
- **Date engine**: `hebcal` npm handles Gregorian→Hebrew conversion for the
  birthday flow and current-month detection.
- **Content model**: PRE-AUTHORED static content (no runtime LLM, no backend). We
  author all readings at build time (AI-assisted, best-judgment research); poetic,
  grounded tone — not academic, not horoscope-generic; rituals specific enough to do
  today. No CE / subject-matter review at this stage — content is flagged revisable.
- **Visual**: the Blue Zodiac fills the welcome, then becomes a persistent circular
  astrology element over a light paper background sampled from the source image.
  White modern-serif welcome copy gives way to dark editorial text, large Hebrew
  letters, constellation line art, and a central moon. No explicit Jewish symbols
  in the primary UI; the Jewish layer remains textual and discoverable.
- **Status**: Phase 1's mobile flow is verified and Phase 2 is ready for content
  and static-data planning. Final product name, production typefaces, Hebrew
  illustration licensing, and the full interactive rotary system remain revisable.

## Constraints

- **Tech stack**: Vite + React + TypeScript static SPA → Cloudflare Pages (`dist/`
  output; no backend) — per `research/STACK.md`. `@hebcal/core` for Hebrew conversion —
  **GPL-2.0, accepted for the internal prototype**; licensing checkpoint (permissive
  alternative or clearance) before any shipping (see `.planning/DECISIONS.md`). Deploy
  guard: keep `.assetsignore`; set Wrangler `assets.directory="./dist"` (never `"."`).
- **Content ownership**: We author all content via best-judgment research of
  Kabbalistic / Sefer Yetzirah sources — no subject-matter expert on hand. Cite
  sources, flag where traditions vary; revisable for future CE review.
- **Platform**: Mobile-first (portrait); season card designed share-ready (9:16).
- **Prototype workflow**: implement one approved mobile direction directly. The
  static zodiac image, placeholder copy, and generic constellation/moon shapes come
  first; content, typed data, visual polish, and the final upcoming panel replace
  them in short passes. Existing sketches remain reference material, not competing
  directions. Lovable is not required.
- **Priority order**: visible flow first; static content/data second; visual/motion
  integration third; moon/upcoming and final QA last. The "backend" is a typed
  client-side data/service boundary only. No auth, database, or server is added.
- **Dependency**: `hebcal` npm for Hebrew date conversion — Why: PRD-specified, avoids
  reimplementing the calendar.
- **Timeline**: approximately two hours for the v1.0 prototype — Why: the user needs
  the entire first experience represented quickly; production hardening is deferred.
- **Auth**: No login / no accounts this sprint — Why: zero-friction is a core value.
  Architect so accounts can be added later; persist the birth profile in `localStorage`.
- **Tone**: Wisdom, not observance; discovery, not declaration — Why: reaches the
  non-observant target audience without feeling religious.
- **UI**: No explicit Jewish symbols in the primary UI — Why: the reveal is textual
  and earned, per PRD visual guidelines.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hebrew calendar is the hidden engine; surfaced as discovery | Serves astrology/wellness audience first; Jewish layer is a delight, not a gate | — Pending |
| Content is PRE-AUTHORED static (no runtime LLM, no backend) | 1-day sprint, no login, content must be consistent and reviewable | — Pending |
| We author all content via best-judgment Kabbalistic research; no CE review yet | No subject-matter expert on hand; cite sources, flag variance, revisable later | — Pending |
| Current month authored richly; other 11 on a shared lighter template | Birthday flow needs all 12; build reusable schema from the rich one | — Pending |
| Must-haves first; architect with full spec (Friday Pulse/moon/browse) in mind | Sprint focus, but don't foreclose the return-mechanic features | — Pending |
| Sharing: design card share-ready (mobile 9:16) first, build share-export after | Design quality is the gate on the distribution mechanic | — Pending |
| Mobile-first; no accounts now (architect for later); `localStorage` for birth profile | "One tap" / IG-story usage; rapid prototype | — Pending |
| Moon phase derived from Hebrew day-of-month (no astronomy lib) | Lunar calendar already encodes it; avoids the v2 astronomy dependency | — Pending |
| Leap-year Adar I/II → single Adar (Pisces); date-only input, no time/timezone | §4 excludes timezones; keep birthday input frictionless | — Pending |
| Use `hebcal` (`@hebcal/core`) for date conversion | PRD-specified; handles leap years / molad | — Pending |
| Opus plans / Codex executes (per CLAUDE.md); stack research → Codex | Dual-runtime GSD orchestration | — Pending |
| Decisions captured; REQUIREMENTS/ROADMAP still pending moodboard (name, palette, type) | Avoid premature scope lock while visuals unresolved | — Pending |
| Stack: Vite + React + TS static SPA → Cloudflare Pages | Smallest stack fitting static / no-backend / mobile-first (research/STACK.md) | — Pending |
| Attribution lineage: Gra / GalEinai (R. Ginsburgh) | Coherent single lineage; matches PRD zodiac; letters + tribes verifiable (research/MONTH-ATTRIBUTIONS.md) | — Pending |
| `@hebcal/core` GPL-2.0 — accepted for internal prototype | Not shipping yet; move fast now, clear license (or swap) before production | ✓ Good (prototype); revisit before ship |
| Prototype workflow: Codex base → v0 directions → Codex worktree finalists → branch previews | Maximizes visual exploration without adding Lovable as another code owner; every variant shares one contract | ✓ Locked |
| Priority: visual prototyping first; backend architecture second | Select the interaction and visual system before implementing real services; keep architecture replaceable through shared adapters | ✓ Locked |
| Six-state mobile flow with optional birthday | Preserves the personal reveal without blocking zero-friction access to the current month | ✓ Locked |
| Continuous vertical page with soft proximity settling | Frames should resolve cleanly without mandatory snapping or scroll hijacking | ✓ Locked |
| `easeInOutCubic` for visual/programmatic transitions | Gives the page one consistent motion language while native touch scrolling remains native | ✓ Locked |
| Motion pacing: 6-second zodiac contraction, 0.5-second settled hold, then an automatic DOB handoff and shared upward reveal | User requested continuity and a slower, meditative rhythm instead of cuts | ✓ Validated in Phase 1 |
| Blue Zodiac plus light paper supersedes original dark PRD treatment | User supplied the visual source and explicitly overrode the original visual specification | ✓ Locked |
| Personal month layer = current month plus birth-month reflection | Creates meaningful personalization without claiming astronomical planetary transits | ✓ Locked |
| Two-hour scope uses screenshot-ready sharing and lightweight content | Meets the PRD core while deferring production export, full browse, and rich content for all twelve months | ✓ Locked |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-11 after Phase 1 completion*
