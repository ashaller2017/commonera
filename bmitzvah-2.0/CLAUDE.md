# CLAUDE.md

Guidance for coding agents working in this repo. Read it before writing code. Match the patterns here over your defaults.

## Stack

- **Framework:** TanStack Start (React, Vite, Nitro). File-based routing via TanStack Router, server functions via `createServerFn`.
- **Data + auth:** Supabase (Postgres, Auth, Storage). Row Level Security is the real authorization boundary, not app code.
- **Client data:** TanStack Query for fetching/caching/mutations on the client.
- **Validation:** Zod at every trust boundary (server function inputs, env, external payloads).
- **Lint/format:** Biome. It is the source of truth for style. Do not hand-format against it.
- **Package manager:** pnpm. Never generate `package-lock.json` or `yarn.lock`.
- **Tests:** Vitest, colocated.
- **Types:** Supabase-generated types are the source of truth for DB shapes (`supabase gen types typescript`). Regenerate them after any schema change; never hand-edit generated types.

If any of the above is wrong for this project, that is a bug in this file. Fix this file first, then follow it.

## Commands

Assumed scripts. Adjust to the actual `package.json` on first read, and update this section if they differ.

```
pnpm dev            # local dev server
pnpm build          # production build
pnpm start          # serve the build
pnpm check          # biome check (lint + format), the gate
pnpm typecheck      # tsc --noEmit
pnpm test           # vitest run
pnpm test:watch     # vitest
pnpm email:dev      # react-email preview server for src/emails/*
pnpm db:types       # supabase gen types typescript --local > src/types/database.ts
pnpm db:migrate     # supabase migration up (apply pending migrations)
pnpm db:reset       # supabase db reset: rebuild local db from migrations + seed.sql
pnpm db:seed:gen    # regenerate supabase/seed.sql from src/lib/content/* (run after editing content)
pnpm db:sync        # generate a migration from supabase/schemas/* (declarative schema workflow)
```

**Before you say a task is done:** `pnpm check && pnpm typecheck && pnpm test` must all pass. Green tests and a clean typecheck are the definition of done, not "it looks right."

## Directory layout

```
src/
  routes/                 # file-based routes (TanStack Router). __root.tsx holds the auth context.
  utils/
    supabase.ts           # server + browser Supabase clients
    *.functions.ts        # createServerFn wrappers (the network boundary)
    *.server.ts           # server-only helpers: DB queries, internal logic. Never imported client-side.
  lib/
    content/              # reference content authored as typed constants: the AUTHORING source of truth.
                          # Projected into the DB by supabase/seed.gen.ts; read at runtime from the DB, not imported.
                          # Types, TEMPLATE_PALETTE (Tailwind literals), and the *_KEYS enums stay here and are imported.
  components/             # presentational + composed UI
  types/
    database.ts           # supabase-generated. Do not edit by hand.
supabase/
  schemas/                # declarative desired-state SQL (pg-delta): structure + RLS + policies + grants.
  migrations/             # generated from schemas/ via `pnpm db:sync`. The applied history; do not hand-edit.
  seed.gen.ts             # generator: projects src/lib/content/* into seed.sql (zero deps, runs on Node).
  seed.sql                # GENERATED reference data. Do not edit by hand; run `pnpm db:seed:gen`.
```

Rule of thumb: pure domain logic in `lib/` (trivially testable), I/O and DB in `*.server.ts`, the RPC surface in `*.functions.ts`, React in `routes/` and `components/`.

## Schema & reference content

- **Schema is declarative.** Edit desired state in `supabase/schemas/*.sql` (pg-delta manages structure, RLS, policies, and grants — all of it). Then `pnpm db:sync` generates a migration, `pnpm db:reset` applies it plus the seed, `pnpm db:types` regenerates `database.ts`. Do not hand-write migrations; do not edit generated migrations. Confirm a clean round-trip with `pnpm db:sync` (it must report "No schema changes found").
- **Reference content: the DB is authoritative; the TS files are first-boot defaults.** Content (templates, milestones, activity-prompt bank, providers, quiz, stories) is edited by CommonEra in the admin panel and lives in the DB. `src/lib/content/*` are the typed default dataset that seeds a fresh DB and the `content.test.ts` target; `pnpm db:seed:gen` regenerates `supabase/seed.sql` from them. The seed is **non-destructive** (`on conflict do nothing`), so re-running it (or a dev `db reset`, which starts from an empty DB) never overwrites admin edits. To change a default in code: edit the TS + regenerate the seed. To change live content: use the admin panel. There is no DB→TS export, so production content diverges from the defaults by design.
- **The app reads content from the DB at runtime**, never from the `src/lib/content/*` data constants. `content.server.ts` maps rows back to the content types; `content.functions.ts` exposes them; the template catalog is delivered app-wide via the root loader and the `useTemplates()` hook; page-specific catalogs come from route loaders.

## Auth (the part to get right)

The production pattern, not the quickstart pattern.

- Use `@supabase/ssr` with a **cookie-based** server client. Session lives in cookies, not localStorage.
- On the server, always read the user with **`supabase.auth.getUser()`**, never `getSession()`. `getUser()` revalidates the JWT against the auth server; `getSession()` only reads the cookie and is spoofable. Authorization decisions use `getUser()`.
- Gate routes in `beforeLoad`, not in components. A protected layout route calls a `fetchUser` server function and redirects if there is no user.
- RLS enforces per-row access at the database. App-level checks are a convenience and a second layer, never the only layer. Assume any query can be called by any authenticated user and let RLS be correct on its own.

`src/utils/supabase.ts` sketch:

```ts
import { createServerClient, createBrowserClient } from '@supabase/ssr'
import { getCookie, setCookie } from '@tanstack/react-start/server' // path can shift by Start version; read cookies off the request

// Server: cookie-bound, RLS-scoped to the signed-in user.
export const getSupabaseServerClient = () =>
  createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => Object.entries(/* parsed request cookies */ {}).map(([name, value]) => ({ name, value: String(value) })),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) => setCookie(name, value, options)),
      },
    },
  )

// Browser: anon key only, RLS still applies.
export const getSupabaseBrowserClient = () =>
  createBrowserClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!)
```

`__root.tsx` context + a guarded route:

```ts
const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  return data.user ? { id: data.user.id, email: data.user.email } : null
})

export const Route = createRootRoute({
  beforeLoad: async () => ({ user: await fetchUser() }),
})

// _authed.tsx (layout route): redirect unauthenticated users
export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
  },
})
```

## Data access

- Reads/writes go through the RLS-scoped server client so the database enforces access. Prefer supabase-js with generated types (`Database` from `src/types/database.ts`) so query results are typed end to end.
- Mutations live in `createServerFn({ method: 'POST' })`, validated with Zod, called from the client via `useServerFn` inside a TanStack Query `useMutation`. Loads call server functions directly from route loaders. **Form submissions are the exception:** they run through the form's own lifecycle, not `useMutation` (see Forms).
- The **service-role key bypasses RLS**. Use it only in explicitly server-only admin paths, never in a code path reachable from the client, and never behind a `VITE_` env var. If a task seems to need the service-role key, stop and flag it rather than reaching for it.

## Forms

Forms use **TanStack Form** with its composition API, wired to the basecn/base-ui field primitives. The kit lives in `src/components/form/`; `login.tsx` and `signup.tsx` are the reference implementations. Never hand-wire controlled inputs (`useState` per field) in a route.

- **Build once, reuse.** `createFormHookContexts` + `createFormHook` (`src/components/form/index.ts`) export `useAppForm` / `withForm` / `withFieldGroup`. The kit ships `field.TextField`, `field.NumberField`, `field.TextareaField`, `field.SelectField`, `field.CheckboxField`, `field.SwitchField`, and `field.RadioGroupField` (used inside `<form.AppField>`), plus `form.SubmitButton` and `form.FormError` (inside `<form.AppForm>`). Each field component is bound via `useFieldContext` and structured after shadcn's tanstack-form design: a `Field` wrapping `FieldLabel` + the control + optional `FieldDescription` + `FieldError`, with `const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid` and `{isInvalid && <FieldError errors={field.state.meta.errors} />}`. Add a new control by building it on a `ui/` primitive that way and registering it in `createFormHook`.
- **Validation is Zod at the form level:** `validators: { onSubmit: schema }` (shadcn's pattern). Field errors come from `field.state.meta.errors` and appear once `isInvalid` is true (touched + invalid), i.e. after a submit attempt.
- **`NumberField` holds a real `number`.** Initialize its field in `defaultValues` to a number or `Number.NaN`, never `''` or `undefined`, so it stays a controlled input and an empty box fails a `z.number()` validator cleanly. `SelectField` / `RadioGroupField` take an `options` array and bind a `string`.
- **Submission is form-owned.** `validators.onSubmitAsync` calls the server function and maps an expected `Result` failure to a form-level error (`return { form: message }`), which `FormError` surfaces via `errorMap.onSubmit`. The top-level `onSubmit` handler runs only on success (e.g. navigation). This is where the react-query `useMutation` rule does not apply.
- **Mirror the server schema on the client.** A server `.validator()` throws on malformed input, so client schemas must be at least as strict as the server's; wrap the server call in try/catch so a rejected validation still resolves to a clean form-level message rather than an unhandled throw.
- **Never disable the submit button on `!canSubmit`.** After a server failure `canSubmit` is false; the retry only works because the button disables on `isSubmitting` alone. Gating on `canSubmit` locks the user out until they edit a field.

## Server function rules

- **Call `createServerFn(...)` literally at the definition site.** Do not wrap it in a factory that returns the builder. If you do, the compiler can no longer strip the handler and its DB/auth import graph from the client bundle, and you ship server code (and secrets) to the browser. This is the sharpest footgun in the stack.
- Server functions take a single `data` argument. Validate it with `.validator(Schema)` using Zod. Untrusted input is untyped until Zod has seen it.
- Split by responsibility: thin `createServerFn` wrapper in `*.functions.ts`, real logic and DB access in `*.server.ts`. The wrapper validates, authorizes, and delegates.
- Return typed error unions for expected failures (see below). Do not leak raw Postgres errors or stack traces across the boundary.

## Email

Transactional email runs through **Resend** with **React Email** templates, server-side only.

- **One sender:** `src/utils/email.server.tsx` wraps Resend and exposes typed helpers (`sendWelcomeEmail`, `sendPasswordResetEmail`, `sendChildMilestoneEmail`, `sendChildFinishedEmail`), rendering a React Email component to HTML + text via `render()`. `deliver()` **never throws**, so callers `await` it without guarding: a failed email must never fail the action that triggered it (signup, marking a milestone done).
- **Local dev needs nothing external.** With no `RESEND_API_KEY`, emails are rendered and logged to the server console (with any link) instead of sent. `RESEND_API_KEY`, `EMAIL_FROM` (a verified-domain sender in prod), and `SITE_URL` (absolute links inside emails) live in `env.server.ts`, all optional in dev.
- **Templates** are React components in `src/emails/` on a shared `components.tsx` layout, each exporting `PreviewProps` (`pnpm email:dev` runs the live preview). Inline-styled and brand-matched by hand: email clients don't support oklch or web fonts, so use the hex/serif fallbacks in `components.tsx`, not the app tokens.
- **Never import `email.server.tsx` or `src/emails/*` from client code** (it reads secrets and pulls in Resend). Server-only; it is `.server.tsx` because it holds JSX.

Flows:

- **Parent password reset** is self-serve: `/forgot-password` → `admin.generateLink({ type: 'recovery' })` → a branded link to `/reset-password?token_hash=…` → `verifyOtp({ token_hash, type: 'recovery' })` + `updateUser({ password })` (the user changes their own password, no service role). The request path is enumeration-safe and refuses children.
- **A parent resets their child's password** from the kid's page via `resetChildPassword`: a parent-owns-child RLS check, then the service-role `updateUserById`. **Children never reset a password** anywhere (synthetic emails, no reset UI).
- **Progress emails** to parents fire only on a real milestone →`done` transition (and journey-finished). The parent's address comes from the `parent_notification_email()` SECURITY DEFINER RPC, so a child never needs `auth.users` access and no service role is used.

## TypeScript conventions

These are the house style. Follow them even when your instinct is more OO or more imperative.

- **`type` over `interface`** for data. Interfaces only when declaration merging is actually needed.
- **Discriminated unions** for state and results. This is the core idiom. Model states as a union tagged on a `type`/`status` field and let the compiler narrow in switches. No boolean soup, no "valid but impossible" states.
- **`readonly` by default.** `readonly` fields, `readonly T[]` for arrays. Update by spreading a new object, never by mutating.
- **Branded types for identifiers and units.** `type UserId = string & { readonly __brand: 'UserId' }`. Do not pass bare `string` where a `UserId` is meant.
- **Money is integer cents as `bigint`, branded** (`type Cents = bigint & { readonly __brand: 'Cents' }`). Never floats for money. Never `number` for money.
- **Result types over throwing for expected failures:**

  ```ts
  type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }
  const ok  = <T>(value: T): Result<T, never> => ({ ok: true, value })
  const err = <E>(error: E): Result<never, E> => ({ ok: false, error })
  ```

  Throwing is reserved for unexpected failures: programmer bugs and infrastructure faults. Expected outcomes (validation failed, not found, forbidden, insufficient funds) are values, not exceptions. `neverthrow` is fine if a file wants the combinators, but a hand-rolled `Result` is the default.
- **Pure functions over methods.** `applyEvent(state, event)` returning a new state, not `state.applyEvent(event)`. Keeps composition and testing trivial.
- **Inject dependencies you want to control in tests.** Time especially: pass `now` in rather than calling `Date.now()` inside the function. No hidden clocks, no hidden randomness.
- Prefer named exports. Reserve default exports for where the framework requires them (route modules).

## Error handling

- Expected failure at the server boundary: return `Result` / a tagged error union that the client can pattern-match. The union is part of the function's type.
- Unexpected failure: let it throw, log it server-side with enough context to reproduce, and surface a generic message to the client. Never return a raw DB error object to the browser.
- Log inputs and versions for anything that drives a real decision, so a result can be reproduced later. Reproducibility over convenience.

## Testing

- Vitest, colocated as `*.test.ts` next to the unit under test.
- `lib/` domain logic should be the bulk of the tests: pure in, pure out, no mocks needed. If something is hard to test, that usually means I/O leaked into logic that should be pure. Fix the seam, do not mock around it.
- Test the discriminated-union transitions and the `Result` branches, including the failure arms. The unhappy paths are the point.
- For anything time- or randomness-dependent, inject the dependency and assert deterministically.

## Security and secrets

- `.env` is never committed. `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (the publishable key is safe to expose, so a `VITE_SUPABASE_PUBLISHABLE_KEY` copy is fine). The secret key (`SUPABASE_SECRET_KEY`, the service-role equivalent) is server-only, never `VITE_`, never in a client-reachable path.
- No secrets in the client bundle. If a value must not reach the browser, it lives only inside a server function handler or a `*.server.ts` module, never imported (even transitively) into client code.
- RLS on for every table with user data. New tables ship with policies in the same migration, not "added later."
- Validate all external input with Zod before it touches the database.

## Working style for agents in this repo

- Direct and concise. Answer or act first, explain after if needed. No preamble, no filler, no performative enthusiasm.
- **No em dashes** in code comments, docs, or prose. Use commas, colons, or periods.
- One polished output over several half-options. Make the call, state the one assumption you made, move on. Do not hand back a menu of variants unless asked.
- Match existing patterns in the file you are editing before importing new ones. Read the surrounding code first.
- No stubs, no `// TODO: implement`, no placeholder logic left behind. Finish the path or say explicitly what is unfinished and why.
- Do not add dependencies casually. Prefer the standard library and what is already installed. If a package is genuinely warranted, name it and why in one line.
- When something is ambiguous and the choice is cheap, pick the sensible default and note it. When it is ambiguous and the choice is expensive or irreversible, ask.

## Picking the right models for workflows and subagents

Rankings, higher = better. Cost reflects what I actually pay, not list price. Intelligence is how hard a problem you can hand the model unsupervised. Taste covers UI/UX, code quality, API design, and copy.

| model    | cost | intelligence | taste |
|----------|------|--------------|-------|
| sonnet-5 | 5    | 5            | 7     |
| opus-4.8 | 4    | 7            | 8     |
| fable-5  | 2    | 9            | 9     |

How to apply:
- These are defaults, not limits. You have standing permission to override them: if a cheaper model's output does not meet the bar, rerun or redo the work with a smarter model without asking. Judge the output, not the price tag. Escalating costs less than shipping mediocre work.
- Cost is a tie-breaker only; when axes conflict for anything that ships, intelligence > taste > cost.
- Bulk/mechanical work (clear-spec implementation, data analysis, migrations): use the cheapest model that clears the bar, sonnet-5.
- Anything user-facing (UI, copy, API design) needs taste >= 7.
- Reviews of plans/implementations: fable-5 or opus-4.8.
- Never use Haiku.
- All of these run via the Agent/Workflow model parameter.
