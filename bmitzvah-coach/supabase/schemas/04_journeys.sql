-- One journey per child. A chosen path is permanent: the unique child_id plus
-- the absence of update/delete grants/policies (see the rls_grants migration)
-- means a kid picks once and builds on it.
create table public.journeys (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null unique references public.profiles (id) on delete cascade,
  template public.journey_template not null references public.templates (key),
  name text not null,
  timeline text not null default '',
  comfort_level text not null default '',
  quiz_answers jsonb not null default '{}',
  quiz_scores jsonb not null default '{}',
  -- Unguessable public share id, minted at creation. Nullable so non-app inserts
  -- are allowed; the app always sets it. The slug is the only key to the public
  -- share card, so it must stay unique.
  share_slug text unique,
  created_at timestamptz not null default now()
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys (id) on delete cascade,
  title text not null,
  description text not null default '',
  position int not null,
  status public.milestone_status not null default 'todo',
  unique (journey_id, position)
);

create table public.journey_activities (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys (id) on delete cascade,
  prompt_id text references public.activity_prompts (id) on delete set null,
  title text not null,
  description text not null default '',
  status public.activity_status not null default 'planned',
  created_at timestamptz not null default now()
);

-- A prompt from the bank can only be added to a journey once.
create unique index journey_activities_prompt_key
  on public.journey_activities (journey_id, prompt_id)
  where prompt_id is not null;

create table public.celebration_plans (
  journey_id uuid primary key references public.journeys (id) on delete cascade,
  what text not null default '',
  who_with text not null default '',
  where_at text not null default '',
  updated_at timestamptz not null default now()
);
