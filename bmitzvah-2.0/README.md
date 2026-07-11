# B'Mitzvah 2.0

A child-led B'Mitzvah journey builder, prototyped for the Common Era x Vibe Coding sprint. A kid takes a personality quiz, picks one of six journey templates, names their journey, and drives it from a personal dashboard: milestone map, activity ideas, celebration planner, and a directory of (simulated) vetted guides. Parents create the family account, register their kid's login, and get a calm read-only view of progress.

## Stack

TanStack Start (React, Vite, Nitro) with file-based routing and server functions, Supabase (Postgres, Auth with RLS as the authorization boundary), TanStack Query, Zod at every trust boundary, Tailwind v4 + shadcn-style Base UI components (basecn), Biome, Vitest, pnpm.

## Getting started

```sh
pnpm install
supabase start          # local Supabase stack
pnpm db:migrate         # apply migrations (schema + RLS)
pnpm db:types           # regenerate src/types/database.ts
pnpm dev                # http://localhost:3000
```

`.env` needs `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (server-only), plus `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the browser client. Values for the local stack come from `supabase status`.

## Try the loop

1. Visit `/` and hit "Begin your journey" to create a parent account.
2. On the family dashboard, add your kid: pick a username and password. Kids log in with a username, no email needed.
3. Log out, log back in on the "I'm the kid" tab with those credentials.
4. Take the quiz (about 3 minutes), pick a recommended path, name the journey.
5. Work the dashboard: start milestones, add activity ideas from the bank, sketch the celebration, check the journey card, browse the guide directory and express interest.
6. Log back in as the parent to watch progress. Parents can look, not touch: RLS enforces it.

## Checks

```sh
pnpm check      # biome lint + format gate
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest
```

## Notes

- Provider profiles, stories, and quiz content are AI-generated sample content per the PRD. Providers are simulated; a real integration would go through Ruth, Common Era's vetted provider platform.
- The one service-role code path is kid account creation (`registerKid` in `src/utils/auth.server.ts`), gated on the caller being a verified parent.
