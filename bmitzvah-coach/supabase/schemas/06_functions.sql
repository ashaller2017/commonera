-- Security-definer helpers so journey-scoped policies do not re-enter RLS on
-- profiles/journeys for every row. Function EXECUTE grants (revoke from public,
-- grant to authenticated) live in the rls_grants migration, since pg-delta does
-- not diff privileges.

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
