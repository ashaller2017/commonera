# Codex Research Brief — Cosmic Calendar

> **Ownership:** Research → **Codex**. Opus (planning) wrote this brief; Codex executes it.
> **Read `.planning/PROJECT.md` and `.planning/DECISIONS.md` FIRST.** Do not re-derive or
> re-litigate decisions already captured there. Write each output to `.planning/research/`
> and make one atomic commit per file. If a finding contradicts a captured decision,
> **flag it** (don't silently resolve it).

## Ground rules

- **Sensitivity:** This represents a living Kabbalistic / Jewish tradition for a
  non-expert team with **no CE / subject-matter review yet**. For every attribution:
  **cite the source**, **flag where traditions diverge** (don't paper over variants),
  and assign a **confidence** level. Wisdom framing, not observance. Where sources
  conflict, present the main variants and recommend one with rationale — never invent.
- **Prefer standard references:** Sefer Yetzirah (Aryeh Kaplan's translation is the
  common English standard); Rabbi Yitzchak Ginsburgh / inner.org; Chabad.org. **Note
  the recension** — the month↔letter and (especially) tribe orderings differ between
  the Gra/Ari and other versions.

## Task 1 — Month attributions → `.planning/research/MONTH-ATTRIBUTIONS.md`

Authoritative table for all 12 Hebrew months. Suggested columns:

| Hebrew month | Gregorian span | Mazal (zodiac) | Tribe | Hebrew letter (glyph + name) | Sense / faculty | Source(s) | Confidence |

Requirements:
- All 12 months, Nisan → Adar. Note leap-year handling: per DECISIONS.md we collapse
  **Adar I / Adar II → one Adar (Pisces)** — but document the traditional treatment.
- **Cross-check the zodiac column against PRD §5** and flag any disagreement (the PRD
  explicitly invited review of its attributions).
- Optional extra column: the Sefer Yetzirah "permutation of the divine name" per month
  — include **only if well-sourced**.
- End with a **"Variance & sources"** section: where orderings differ (esp. tribes),
  which recension you followed, and why.

**Provided source material (start here):**
- `.planning/research/sources/mazaroth-betemunah-org.md` — a user-provided Orthodox/
  Midrashic source (betemunah.org). Enriches the **meaning / scriptural-root** layer
  (the "merit of the months" midrash) and cosmology — but has **no Hebrew letters or
  senses**, sparse tribes, and its automated capture had a month-alignment error. Read
  its caveat box and **verify against the live URL**. For the letter/sense/full-tribe
  system, pull from Sefer Yetzirah sources (Aryeh Kaplan; inner.org).

## Task 2 — Stack & feasibility → `.planning/research/STACK.md`

Given the **locked constraints** (pre-authored static content, **NO backend**,
mobile-first, no accounts, `hebcal` / `@hebcal/core`), give a prescriptive 2026 stack:

- **Framework** for a small static mobile-first SPA (e.g., Vite + React vs. Astro vs.
  SvelteKit-static) — recommend one, with rationale + current versions.
- **Hosting** for a static SPA, and how the deploy guard (`.assetsignore`, see
  `CLAUDE.md`) applies to the chosen host.
- **`@hebcal/core`**: Gregorian→Hebrew conversion, current-month detection, leap-year
  (Adar I/II) handling, and whether it exposes **molad / lunar-day** data so we can
  derive **moon phase from the Hebrew day-of-month** (the chosen approach — confirm
  feasibility; **no astronomy library**).
- **Share-image export on mobile**: how to turn the season card into a 9:16 shareable
  image (e.g., html-to-image / canvas, Web Share API `files`), with pitfalls.

## Task 3 (optional) — Pitfalls → `.planning/research/PITFALLS.md`

Hebrew date edge cases (sunset boundary, leap years), Hebrew RTL + large single-letter
typography with **deploy-licensable** Hebrew webfonts, and mobile share-sheet gotchas.

## Out of scope for this brief

- Writing the reading **copy** (archetype paragraphs, tikkun, grounding text) — separate
  authoring step, decided later.
- Final **name, palette, typeface** — moodboard (user).
