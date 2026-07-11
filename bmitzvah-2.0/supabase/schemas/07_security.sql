-- RLS, privilege grants, and policies. pg-delta materialises the declarative
-- schema into a shadow database and diffs it, so the revoke/grant/enable-rls/
-- create-policy statements here define the desired access state and round-trip
-- through `supabase db schema declarative sync` like any other object.
--
-- Access model:
--   reference/catalog tables  -> public read (anon + authenticated), no writes
--   profiles                  -> read own + own children; insert self (parent);
--                                update own display_name only
--   journeys                  -> read own or as parent; insert own; permanent
--                                (no update/delete)
--   milestones / activities / -> read if you can view the journey; write if you
--   celebration_plans            own it
--   provider_interest         -> parent inserts own lead; read own
--   provider_favorite         -> child inserts/deletes own heart; parent reads
--                                their children's
--   child_settings            -> parent writes for own kids; kid reads own row

-- ---------------------------------------------------------------------------
-- Security-definer helper grants. Revoke the implicit PUBLIC execute, then hand
-- it only to authenticated so anon cannot call these RLS shortcuts.
-- ---------------------------------------------------------------------------
revoke all on function public.is_parent_of(uuid) from public;
revoke all on function public.owns_journey(uuid) from public;
revoke all on function public.can_view_journey(uuid) from public;
grant execute on function public.is_parent_of(uuid) to authenticated;
grant execute on function public.owns_journey(uuid) to authenticated;
grant execute on function public.can_view_journey(uuid) to authenticated;

revoke all on function public.is_parent() from public;
revoke all on function public.is_child() from public;
grant execute on function public.is_parent() to authenticated;
grant execute on function public.is_child() to authenticated;

revoke all on function public.parent_notification_email() from public;
grant execute on function public.parent_notification_email() to authenticated;

-- ---------------------------------------------------------------------------
-- Reference catalog: read-only public content. RLS on, select granted to the
-- Data API roles, a single permissive read policy, and no write grants.
-- ---------------------------------------------------------------------------
alter table public.templates enable row level security;
alter table public.template_milestones enable row level security;
alter table public.activity_prompts enable row level security;
alter table public.providers enable row level security;
alter table public.provider_testimonials enable row level security;
alter table public.provider_templates enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.timeline_options enable row level security;
alter table public.comfort_options enable row level security;
alter table public.stories enable row level security;

grant select on public.templates to anon, authenticated;
grant select on public.template_milestones to anon, authenticated;
grant select on public.activity_prompts to anon, authenticated;
grant select on public.providers to anon, authenticated;
grant select on public.provider_testimonials to anon, authenticated;
grant select on public.provider_templates to anon, authenticated;
grant select on public.quiz_questions to anon, authenticated;
grant select on public.quiz_options to anon, authenticated;
grant select on public.timeline_options to anon, authenticated;
grant select on public.comfort_options to anon, authenticated;
grant select on public.stories to anon, authenticated;

create policy templates_public_read on public.templates
  for select to anon, authenticated using (true);
create policy template_milestones_public_read on public.template_milestones
  for select to anon, authenticated using (true);
create policy activity_prompts_public_read on public.activity_prompts
  for select to anon, authenticated using (true);
create policy providers_public_read on public.providers
  for select to anon, authenticated using (true);
create policy provider_testimonials_public_read on public.provider_testimonials
  for select to anon, authenticated using (true);
create policy provider_templates_public_read on public.provider_templates
  for select to anon, authenticated using (true);
create policy quiz_questions_public_read on public.quiz_questions
  for select to anon, authenticated using (true);
create policy quiz_options_public_read on public.quiz_options
  for select to anon, authenticated using (true);
create policy timeline_options_public_read on public.timeline_options
  for select to anon, authenticated using (true);
create policy comfort_options_public_read on public.comfort_options
  for select to anon, authenticated using (true);
create policy stories_public_read on public.stories
  for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- User data: grants. anon gets nothing. Everything is authenticated-only; the
-- service-role admin path gets full access on the user tables it maintains.
-- ---------------------------------------------------------------------------

-- profiles: revoke table-wide update first so display_name is provably the only
-- updatable column for authenticated.
grant select, insert on public.profiles to authenticated;
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- journeys: permanent once created (no update/delete for authenticated).
grant select, insert on public.journeys to authenticated;

grant select, insert, update, delete on public.milestones to authenticated;
grant select, insert, update, delete on public.journey_activities to authenticated;
grant select, insert, update, delete on public.celebration_plans to authenticated;
grant select, insert on public.provider_interest to authenticated;
grant select, insert, delete on public.provider_favorite to authenticated;
grant select, insert, update on public.child_settings to authenticated;

grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.journeys to service_role;
grant select, insert, update, delete on public.milestones to service_role;
grant select, insert, update, delete on public.journey_activities to service_role;
grant select, insert, update, delete on public.celebration_plans to service_role;
grant select, insert, update, delete on public.provider_interest to service_role;
grant select, insert, update, delete on public.provider_favorite to service_role;
grant select, insert, update, delete on public.child_settings to service_role;

-- ---------------------------------------------------------------------------
-- User data: RLS.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.journeys enable row level security;
alter table public.milestones enable row level security;
alter table public.journey_activities enable row level security;
alter table public.celebration_plans enable row level security;
alter table public.provider_interest enable row level security;
alter table public.provider_favorite enable row level security;
alter table public.child_settings enable row level security;

create policy profiles_select_own_or_children on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or parent_id = (select auth.uid()));

-- Self-registration is parent-only; child profiles come from the server-only
-- admin path which bypasses RLS deliberately.
create policy profiles_insert_self_parent on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()) and role = 'parent' and parent_id is null);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy journeys_select_own_or_parent on public.journeys
  for select to authenticated
  using (child_id = (select auth.uid()) or public.is_parent_of(child_id));

create policy journeys_insert_own on public.journeys
  for insert to authenticated
  with check (child_id = (select auth.uid()));

create policy milestones_select on public.milestones
  for select to authenticated
  using (public.can_view_journey(journey_id));

create policy milestones_write on public.milestones
  for insert to authenticated
  with check (public.owns_journey(journey_id));

create policy milestones_update on public.milestones
  for update to authenticated
  using (public.owns_journey(journey_id))
  with check (public.owns_journey(journey_id));

create policy milestones_delete on public.milestones
  for delete to authenticated
  using (public.owns_journey(journey_id));

create policy activities_select on public.journey_activities
  for select to authenticated
  using (public.can_view_journey(journey_id));

create policy activities_write on public.journey_activities
  for insert to authenticated
  with check (public.owns_journey(journey_id));

create policy activities_update on public.journey_activities
  for update to authenticated
  using (public.owns_journey(journey_id))
  with check (public.owns_journey(journey_id));

create policy activities_delete on public.journey_activities
  for delete to authenticated
  using (public.owns_journey(journey_id));

create policy celebration_select on public.celebration_plans
  for select to authenticated
  using (public.can_view_journey(journey_id));

create policy celebration_write on public.celebration_plans
  for insert to authenticated
  with check (public.owns_journey(journey_id));

create policy celebration_update on public.celebration_plans
  for update to authenticated
  using (public.owns_journey(journey_id))
  with check (public.owns_journey(journey_id));

create policy interest_insert_own on public.provider_interest
  for insert to authenticated
  with check (created_by = (select auth.uid()) and public.is_parent());

create policy interest_select_own on public.provider_interest
  for select to authenticated
  using (created_by = (select auth.uid()));

-- Favorites: the child owns their hearts (insert/delete); a parent reads their
-- own children's via is_parent_of. Child-only insert mirrors the parent-only
-- lead insert above.
create policy favorite_select_own_or_parent on public.provider_favorite
  for select to authenticated
  using (child_id = (select auth.uid()) or public.is_parent_of(child_id));

create policy favorite_insert_own on public.provider_favorite
  for insert to authenticated
  with check (child_id = (select auth.uid()) and public.is_child());

create policy favorite_delete_own on public.provider_favorite
  for delete to authenticated
  using (child_id = (select auth.uid()));

-- Child settings: the parent answers questions about their kid (write); the
-- kid reads their own row so quiz scoring can use the observance answer.
create policy child_settings_select_own_or_parent on public.child_settings
  for select to authenticated
  using (child_id = (select auth.uid()) or public.is_parent_of(child_id));

create policy child_settings_insert_parent on public.child_settings
  for insert to authenticated
  with check (public.is_parent_of(child_id));

create policy child_settings_update_parent on public.child_settings
  for update to authenticated
  using (public.is_parent_of(child_id))
  with check (public.is_parent_of(child_id));

-- ---------------------------------------------------------------------------
-- Admin (CommonEra operators). is_admin() is the boundary. Admins read all user
-- data (account management) and read/write the whole reference catalog (CMS).
-- Auth operations (reset password, delete account, create admin) are not
-- expressible as RLS and run through the service-role client after an app-level
-- is-admin check, so there are no admin insert/update/delete policies on the
-- user tables here.
-- ---------------------------------------------------------------------------
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Read-all across families for the admin surface. OR'd with the owner policies
-- above, so a normal user is unaffected and an admin sees everyone.
create policy profiles_admin_read on public.profiles
  for select to authenticated using (public.is_admin());
create policy journeys_admin_read on public.journeys
  for select to authenticated using (public.is_admin());
create policy milestones_admin_read on public.milestones
  for select to authenticated using (public.is_admin());
create policy activities_admin_read on public.journey_activities
  for select to authenticated using (public.is_admin());
create policy celebration_admin_read on public.celebration_plans
  for select to authenticated using (public.is_admin());
create policy interest_admin_read on public.provider_interest
  for select to authenticated using (public.is_admin());
create policy favorite_admin_read on public.provider_favorite
  for select to authenticated using (public.is_admin());
create policy child_settings_admin_read on public.child_settings
  for select to authenticated using (public.is_admin());

-- Full write on the reference catalog for admins. Public read stays open via the
-- *_public_read policies; these add insert/update/delete for admins only. Every
-- reference table also needs the write grant (select was granted above).
grant insert, update, delete on public.templates to authenticated;
grant insert, update, delete on public.template_milestones to authenticated;
grant insert, update, delete on public.activity_prompts to authenticated;
grant insert, update, delete on public.providers to authenticated;
grant insert, update, delete on public.provider_testimonials to authenticated;
grant insert, update, delete on public.provider_templates to authenticated;
grant insert, update, delete on public.quiz_questions to authenticated;
grant insert, update, delete on public.quiz_options to authenticated;
grant insert, update, delete on public.timeline_options to authenticated;
grant insert, update, delete on public.comfort_options to authenticated;
grant insert, update, delete on public.stories to authenticated;

create policy templates_admin_write on public.templates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy template_milestones_admin_write on public.template_milestones
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy activity_prompts_admin_write on public.activity_prompts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy providers_admin_write on public.providers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy provider_testimonials_admin_write on public.provider_testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy provider_templates_admin_write on public.provider_templates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy quiz_questions_admin_write on public.quiz_questions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy quiz_options_admin_write on public.quiz_options
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy timeline_options_admin_write on public.timeline_options
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy comfort_options_admin_write on public.comfort_options
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy stories_admin_write on public.stories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
