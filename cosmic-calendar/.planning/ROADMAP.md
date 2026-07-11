# Roadmap: Cosmic Calendar

## Overview

Milestone v1.0 compresses the PRD's core experience into five short delivery
boundaries: first make the entire mobile journey navigable, then make its readings
real, apply the approved visual assets, complete the moon/Friday return cadence,
and finally import the separately developed zodiac rotor. Production hardening and
nice-to-have experiences remain explicitly deferred.

## Phases

- [x] **Phase 1: Mobile Flow Skeleton** - Complete the placeholder welcome, optional birthday, personal, month, and upcoming journey. (completed 2026-07-11)
- [x] **Phase 2: Content & Static Data** - Make all twelve current-month readings and one shared birthday-derived Personal Thread deterministic and meaningful. (completed 2026-07-11)
- [x] **Phase 3: Visual Assets & Typography** - Apply the light-paper system, Vollkorn titles, Lalou Hebrew glyphs, and real constellation elements without changing the current zodiac motion. (completed 2026-07-11)
- [ ] **Phase 4: Upcoming & QA** - Finish the moon/Friday return panel and verify both mobile paths.
- [ ] **Phase 5: Zodiac Rotor Integration** - Import the separately developed rotor component and complete the final motion treatment.

## Phase Details

### Phase 1: Mobile Flow Skeleton

**Goal**: Users can traverse the complete placeholder experience through either the birthday or skip path.
**Depends on**: Nothing (first phase)
**Requirements**: FLOW-01, FLOW-02, FLOW-03, FLOW-04, FLOW-05
**Success Criteria** (what must be TRUE):

  1. Welcome phrases appear sequentially over the full-screen Blue Zodiac placeholder.
  2. User can advance to optional birthday input or skip directly to the month placeholder.
  3. A submitted birthday reveals the personal placeholder; skipping removes that section.
  4. Personal, month, and upcoming placeholders form one continuous softly settling mobile page without login.

**Plans**: 1/1 plans complete
**UI hint**: yes

Plans:

- [x] 01-01-PLAN.md
- [x] 01-01: Build and validate the six-state mobile wireframe.

### Phase 2: Content & Static Data

**Goal**: Users receive a complete reading for the current Hebrew month and a coherent Personal Thread for any valid birthday.
**Depends on**: Phase 1
**Requirements**: CAL-01, READ-01, READ-02, PROF-01, PROF-02, DATA-01, COPY-01, DATA-02
**Success Criteria** (what must be TRUE):

  1. The current Hebrew month is detected and displays every required reading field plus a concrete ritual.
  2. Any valid birthday returns its Hebrew date and one compact template-derived Personal Thread, including Adar normalization.
  3. The Jewish/Kabbalistic grounding is discoverable while the primary hook remains universal.
  4. Identical dates produce identical immediate, non-predictive results without a server.

**Plans**: Implemented inline at `e9d9677`; verification pending
**UI hint**: yes

Plans:

- [x] 02-01: Add the typed calendar/content model and replace placeholder copy. (inline implementation)

### Phase 3: Visual Assets & Typography

**Goal**: Users experience the approved visual direction as a coherent, screenshot-ready mobile composition using the real type, glyph, and constellation assets.
**Depends on**: Phase 1; may overlap Phase 2 and integrate after its content slots stabilize
**Requirements**: VIS-01, VIS-02, VIS-03, VIS-04
**Success Criteria** (what must be TRUE):

  1. The existing Blue Zodiac image treatment remains intact while the surrounding interface uses the matching light-paper background.
  2. Vollkorn titles, Lalou Hebrew glyphs, and the corresponding constellation PNGs read as separate intentional elements.
  3. Personal and month compositions remain legible and complete in a 9:16 screenshot.
  4. This phase does not import or alter the separate zodiac rotor prototype.

**Plans**: 1/1 plans complete
**UI hint**: yes

Plans:

- [x] 03-01-PLAN.md
- [x] 03-01: Integrate Vollkorn, Lalou glyphs, and all twelve constellation assets while preserving the existing zodiac treatment.

### Phase 03.1: Client feedback — copy, glyph, and month-page visual magic (INSERTED)

**Goal:** [Urgent work - to be planned]
**Requirements**: TBD
**Depends on:** Phase 3
**Plans:** 0 plans

Plans:

- [ ] TBD (run /gsd-plan-phase 03.1 to break down)

### Phase 4: Upcoming & QA

**Goal**: Users finish on a credible return-cadence panel and can complete either path reliably.
**Depends on**: Phases 2 and 3
**Requirements**: UP-01, UP-02, QA-01, QA-02
**Success Criteria** (what must be TRUE):

  1. The final section communicates the next Friday Pulse or current Friday state.
  2. It presents the symbolic current moon and a relevant upcoming new/full moon window.
  3. Both birthday and skip paths work on target mobile viewports without clipping or scroll traps.
  4. Essential controls work by touch and keyboard with reduced-motion parity.

**Plans**: 1 plan
**UI hint**: yes

Plans:

- [ ] 04-01: Complete the upcoming panel and run final mobile/accessibility QA.

### Phase 5: Zodiac Rotor Integration

**Goal**: Users experience the separately developed zodiac rotor as the persistent astrology element without regressing the completed mobile flow.
**Depends on**: Phases 3 and 4
**Requirements**: MOT-01, MOT-02
**Success Criteria** (what must be TRUE):

  1. The component from `codex/rotor-prototype` is imported selectively without merging unrelated prototype code.
  2. One persistent zodiac renderer supports the full-screen, full-width, and top-arc compositions.
  3. Motion uses the approved easing and reduced-motion mode removes large spatial movement.
  4. Both mobile paths are rechecked after integration.

**Plans**: 1 plan
**UI hint**: yes

Plans:

- [ ] 05-01: Import and adapt the isolated rotor component, then rerun motion/mobile QA.

## Progress

**Execution Order:** Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Mobile Flow Skeleton | 1/1 | Complete    | 2026-07-11 |
| 2. Content & Static Data | 1/1 | Complete | 2026-07-11 |
| 3. Visual Assets & Typography | 1/1 | Complete | 2026-07-11 |
| 4. Upcoming & QA | 0/1 | Not started | - |
| 5. Zodiac Rotor Integration | 0/1 | Not started | - |
