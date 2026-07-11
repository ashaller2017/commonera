-- Enums. Declarative: pg-delta manages these. Append new values at the end;
-- reordering produces noisy diffs.

-- Account roles. Parents self-register; children are created server-side;
-- admins (CommonEra operators) are provisioned out-of-band. Append-only.
create type public.app_role as enum ('parent', 'child', 'admin');

-- The six journey templates. This is the shared key across the whole catalog
-- (templates, milestones, prompts, providers, stories) and the journeys a kid
-- creates. Kept as an enum so the generated TypeScript types carry the union.
create type public.journey_template as enum (
  'into-the-wild',
  'make-something-real',
  'make-a-difference',
  'mind-and-meaning',
  'roots-and-rituals',
  'my-own-path'
);

create type public.milestone_status as enum ('todo', 'in_progress', 'done');
create type public.activity_status as enum ('planned', 'done');

-- Catalog enums.
create type public.activity_kind as enum ('do', 'create', 'learn', 'give');
create type public.provider_format as enum ('in-person', 'virtual', 'hybrid');
create type public.org_type as enum ('organization', 'independent');
create type public.quiz_question_kind as enum ('single', 'words');
