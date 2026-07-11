-- Reference catalog: templates, their milestones and activity prompts, the
-- provider directory, the quiz, and inspiration stories. This is read-only
-- content for the app. The rows are authored in src/lib/content/* and loaded
-- via supabase/seed.sql (a generated projection of that source of truth).
--
-- RLS, grants, and the public read policies for these tables live in the
-- migration supabase/migrations/*_rls_grants.sql, because pg-delta does not
-- diff policies or privileges. Structure only lives here.

-- The six starting-point templates. Themes/celebration_ideas/getting_started/
-- provider_types are ordered text arrays. `position` fixes catalog order.
create table public.templates (
  key public.journey_template primary key,
  name text not null,
  emoji text not null,
  tagline text not null,
  description text not null,
  jewish_lens text not null,
  themes text[] not null default '{}',
  celebration_ideas text[] not null default '{}',
  getting_started text[] not null default '{}',
  provider_types text[] not null default '{}',
  position int not null
);

-- Six milestones per template, seeded into a kid's journey on creation.
create table public.template_milestones (
  template public.journey_template not null
    references public.templates (key) on delete cascade,
  position int not null,
  title text not null,
  description text not null default '',
  primary key (template, position)
);

-- The activity prompt bank. The kid dashboard loads the ~8 matched to their
-- chosen template, plus the rest as "more ideas".
create table public.activity_prompts (
  id text primary key,
  template public.journey_template not null
    references public.templates (key) on delete cascade,
  kind public.activity_kind not null,
  title text not null,
  description text not null default '',
  position int not null
);
create index activity_prompts_template_idx on public.activity_prompts (template);

-- Simulated provider directory (the reward at the end of the loop).
create table public.providers (
  key text primary key,
  name text not null,
  tagline text not null,
  overview text not null,
  approach text not null,
  format public.provider_format not null,
  location text not null,
  price_range text not null,
  org_type public.org_type not null,
  verified boolean not null default false,
  position int not null
);

create table public.provider_testimonials (
  provider_key text not null references public.providers (key) on delete cascade,
  position int not null,
  quote text not null,
  attribution text not null,
  primary key (provider_key, position)
);

-- Which templates each provider serves (many-to-many). `position` orders a
-- provider's templates; position 0 is its primary template (drives accent color
-- in the directory).
create table public.provider_templates (
  provider_key text not null references public.providers (key) on delete cascade,
  template public.journey_template not null
    references public.templates (key) on delete cascade,
  position int not null default 0,
  primary key (provider_key, template)
);
create index provider_templates_template_idx on public.provider_templates (template);

-- The personality quiz. `words` questions carry pick_exactly; `single` do not.
create table public.quiz_questions (
  id text primary key,
  kind public.quiz_question_kind not null,
  prompt text not null,
  helper text,
  pick_exactly int,
  position int not null,
  constraint words_have_pick_exactly check ((kind = 'words') = (pick_exactly is not null))
);

-- Options carry per-template scoring weights as jsonb (partial map of
-- journey_template -> small int). Scoring runs in TS over these weights.
create table public.quiz_options (
  id text primary key,
  question_id text not null references public.quiz_questions (id) on delete cascade,
  label text not null,
  emoji text not null,
  weights jsonb not null default '{}',
  position int not null
);
create index quiz_options_question_idx on public.quiz_options (question_id);

-- Setup choices shown after the quiz.
create table public.timeline_options (
  key text primary key,
  label text not null,
  helper text not null,
  position int not null
);

create table public.comfort_options (
  key text primary key,
  label text not null,
  helper text not null,
  position int not null
);

-- One inspiration story per template for the landing and stories pages.
create table public.stories (
  slug text primary key,
  child_name text not null,
  age int not null,
  template public.journey_template not null
    references public.templates (key) on delete cascade,
  journey_name text not null,
  story text not null,
  quote text not null,
  celebration text not null,
  position int not null
);
