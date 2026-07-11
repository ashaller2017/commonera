-- Security-definer helpers so journey-scoped policies do not re-enter RLS on
-- profiles/journeys for every row. Function EXECUTE grants (revoke from public,
-- grant to authenticated) live alongside the other privilege statements in
-- 07_security.sql.

create function public.is_parent_of(child uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = child
      and p.parent_id = (select auth.uid())
  );
$$;

create function public.owns_journey(jid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.journeys j
    where j.id = jid
      and j.child_id = (select auth.uid())
  );
$$;

create function public.can_view_journey(jid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.journeys j
    join public.profiles p on p.id = j.child_id
    where j.id = jid
      and (j.child_id = (select auth.uid()) or p.parent_id = (select auth.uid()))
  );
$$;

-- True when the current user is a CommonEra operator. Backs the admin read
-- policies on user data and the write policies on the reference catalog.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

-- True when the current user is a parent. Backs the lead-insert policy: only a
-- parent submits a provider_interest lead, never a child.
create function public.is_parent()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'parent'
  );
$$;

-- True when the current user is a child. Backs the favorite-insert policy: only
-- a child hearts a guide.
create function public.is_child()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'child'
  );
$$;

-- The current child's parent's email, used to send parents progress notifications. SECURITY
-- DEFINER so it can read auth.users; scoped to the caller's own parent so a child can only ever
-- reach their own parent's address, nobody else's.
create function public.parent_notification_email()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select u.email
  from public.profiles me
  join auth.users u on u.id = me.parent_id
  where me.id = (select auth.uid());
$$;
