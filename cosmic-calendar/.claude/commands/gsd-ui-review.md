---
name: gsd-ui-review
description: Retroactive 6-pillar visual audit of implemented frontend code
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Agent
  - AskUserQuestion
requires: [phase]
---
<objective>
Conduct a retroactive 6-pillar visual audit. Produces UI-REVIEW.md with
graded assessment (1-4 per pillar). Works on any project.
Output: {phase_num}-UI-REVIEW.md
</objective>

<execution_context>
@/Users/tyler.linahan/Desktop/_Repos/_Clients/CE-CosmicCal/cosmic-calendar/.claude/gsd-core/workflows/ui-review.md
@/Users/tyler.linahan/Desktop/_Repos/_Clients/CE-CosmicCal/cosmic-calendar/.claude/gsd-core/references/ui-brand.md
</execution_context>

<context>
Phase: $ARGUMENTS — optional, defaults to last completed phase.
</context>

<process>
Execute end-to-end.
Preserve all workflow gates.
</process>
