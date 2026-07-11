-- Provider engagement, in two shapes. A lead (provider_interest) is a name/
-- email/note a parent submits from the unlocked directory to reach out to a
-- guide. A favorite (provider_favorite) is a lightweight signal a child taps
-- ("I'm interested") that reflects to their parent, with no contact fields.
-- Both are write-gated by RLS plus a server-side access re-check; policies live
-- in 07_security.sql.
create table public.provider_interest (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null references public.providers (key),
  name text not null,
  email text not null,
  note text not null default '',
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index provider_interest_created_by_idx on public.provider_interest (created_by);

-- A child's "I'm interested" heart on a guide. Kid-owned, parent-readable (via
-- is_parent_of); the parent acts on it by submitting the lead above. Completion
-- is re-checked in the server function, not encoded in RLS (same as the lead),
-- so a heart could in theory be inserted pre-completion via the API directly:
-- a cosmetic bypass, accepted by precedent. provider_key cascades on delete so
-- an admin removing a guide is never blocked by ephemeral hearts.
create table public.provider_favorite (
  child_id uuid not null references public.profiles (id) on delete cascade,
  provider_key text not null references public.providers (key) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (child_id, provider_key)
);

create index provider_favorite_provider_key_idx on public.provider_favorite (provider_key);
