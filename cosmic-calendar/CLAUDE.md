# CLAUDE.md — GSD Operating Instructions

> Validated against open-gsd @opengsd/gsd-core@1.6.1, local scope,
> Claude Code (`.claude/`) + Codex (`.codex/`) runtimes. Commands use the
> `/gsd-` prefix in Claude Code (`$gsd-` in Codex). Run `/gsd-help` for the
> authoritative, version-correct command list.

Project: **Cosmic Calendar** — a lunar-wisdom / seasonal-reading app rooted in
the Hebrew calendar (see `Cosmic Calendar PRD __ COMMON ERA × VIBE CODING.md`).

## Roles (do not collapse)
- **Planning / verification → Opus** (this Claude Code session). Produces and edits
  `.planning/*`, including research *briefs*. Does NOT write implementation code and
  does NOT perform research.
- **Execution + ALL research → Codex.** Per user directive (2026-07-09): every kind
  of research — domain, stack, and content / Kabbalistic sourcing — goes to Codex,
  along with implementation. Atomic commit per task. Does not redefine scope.
  (This overrides the generic GSD "research → Opus" default.)

## Before any GSD work
This is a **greenfield** project — skip `/gsd-map-codebase` (that's for existing
codebases). Bootstrap with:
1. `/gsd-new-project` — fresh-project mode, seeded from the PRD → scaffolds
   `.planning/` (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md).

## Workflow loop (per phase)
discuss → plan → execute → verify
(`/gsd-discuss-phase` → `/gsd-plan-phase` → `/gsd-execute-phase` → `/gsd-verify-work`)

Lightweight lanes: `/gsd-quick` (GSD guarantees, fewer agents) · `/gsd-fast`
(trivial task, inline, no subagents).

## Hard rules
- One atomic git commit per task. Surgical changes only.
- Never touch deployed / source-of-truth files unless the task targets them.
- Major schema/architecture change → STOP, raise a checkpoint:decision.
- Keep the planning session lean (well under 50% context); heavy work in subagents.
- Prefer heredoc (`cat > file << 'EOF'`) over fragile in-place edits for rewrites.

## State files (source of truth — under `.planning/`)
PROJECT.md · REQUIREMENTS.md · ROADMAP.md · STATE.md · PLAN.md · SUMMARY.md
The `.planning/` artifacts ARE the contract between runtimes — never re-derive
from chat. If chat and `.planning/` disagree, trust `.planning/` and `/gsd-help`.

## On resume (fresh session)
Read `STATE.md` → `ROADMAP.md` → current `PLAN.md`. Don't re-derive from chat.

## Deploy guard (revisit once the stack is chosen)
The frontend/deploy stack is not yet chosen. If the platform serves the repo
root as static assets (e.g. a Cloudflare Worker with `assets.directory: "."`),
`.assetsignore` is the ONLY thing keeping GSD/planning files private — verify it
excludes `.claude/ .codex/ .planning/ CLAUDE.md` and the PRD. If the platform
builds to a `dist/`/`build/` output dir instead, this is N/A. A starter
`.assetsignore` already exists in the repo root.
