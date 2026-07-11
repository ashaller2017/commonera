-- One row per auth user. Parents self-register; child rows are created by a
-- server-only admin path, so the insert policy (in the rls_grants migration)
-- only allows parents. RLS/grants live in the migration, not here.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null,
  display_name text not null,
  username text,
  parent_id uuid references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint child_has_parent check ((role = 'child') = (parent_id is not null)),
  constraint child_has_username check (role <> 'child' or username is not null),
  constraint username_format check (username is null or username ~ '^[a-z0-9_]{3,20}$')
);

create unique index profiles_username_key on public.profiles (username);
create index profiles_parent_id_idx on public.profiles (parent_id);

-- Parent-answered facts about a child (timeline, observance). Kept off
-- profiles so that table's narrow column grants stay intact: parents write
-- these rows for their own kids, the kid reads them. Nullable columns mean
-- "not answered yet"; journeys snapshot the values at creation time.
create table public.child_settings (
  child_id uuid primary key references public.profiles (id) on delete cascade,
  timeline text references public.timeline_options (key),
  comfort_level text references public.comfort_options (key),
  updated_at timestamptz not null default now()
);
