---
name: verify
description: Build, run, and drive bmitzvah-2.0 end-to-end to verify a change at the real UI surface.
---

# Verifying bmitzvah-2.0 changes

## Prereqs
- Local Supabase must be running (`supabase status` from this dir; DB container is `supabase_db_bmitzvah-coach`). After schema changes: `pnpm db:sync && pnpm db:reset && pnpm db:types`, then a second `pnpm db:sync` must say "No schema changes found".
- `pnpm dev` starts Vite. Port 3000 is often taken by another app on this machine — Vite falls back to **3001**; read the startup output, don't assume.

## Driving the UI
- No Playwright in the repo. Install the `playwright` npm package in a scratch dir and launch with `channel: 'chrome', headless: true` — system Chrome exists, no browser download needed.
- **Hydration race:** TanStack Start SSR pages render before React hydrates; clicking/submitting too early causes native GET form submits (URL grows query params). After every `page.goto(...)`, wait `networkidle` + ~700ms before interacting.
- Auth: parent signs up at `/signup` (labels: "Your name" / "Email" / "Password"); kid logs in at `/login` → tab "I'm the kid" (labels: "Username" / "Password", button "Jump back in"). Switch users with `context.clearCookies()`.
- Base UI Selects: click the trigger (found via `getByLabel`), then `getByRole('option', { name: ... })`. A controlled Select shows the raw value key unless the Root gets an `items` map.
- Quiz options are the only `button[aria-pressed]` elements on the page — answer single-choice questions by clicking one and waiting ~650ms for the auto-advance.

## Evidence
- Screenshots per step to a scratch `shots/` dir.
- DB-side checks: `docker exec supabase_db_bmitzvah-coach psql -U postgres -d postgres -c "..."` (no local psql binary).

## Flows worth driving
- Parent: signup → add kid (2-step dialog: login, then "About ⟨name⟩" with skip) → dashboard nudge for unanswered kids → `/parent/guides` → interest lead.
- Kid: username login → `/kid/guides` (open from day one, favoriting works pre-journey) → quiz (intro → words q + 9 singles → suspense reveal → results → name → guides step) → dashboard.
- Cross-check `journeys.timeline/comfort_level` snapshots and `quiz_scores` in the DB after a quiz run.
