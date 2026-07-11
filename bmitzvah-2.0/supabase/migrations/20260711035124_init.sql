SET check_function_bodies = false;
CREATE TYPE public.activity_kind AS ENUM ('do', 'create', 'learn', 'give');
CREATE TYPE public.activity_status AS ENUM ('planned', 'done');
CREATE TYPE public.app_role AS ENUM ('parent', 'child');
CREATE TYPE public.journey_template AS ENUM ('into-the-wild', 'make-something-real', 'make-a-difference', 'mind-and-meaning', 'roots-and-rituals', 'my-own-path');
CREATE TYPE public.milestone_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE public.org_type AS ENUM ('organization', 'independent');
CREATE TYPE public.provider_format AS ENUM ('in-person', 'virtual', 'hybrid');
CREATE TYPE public.quiz_question_kind AS ENUM ('single', 'words');
CREATE FUNCTION public.can_view_journey(jid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1
    from public.journeys j
    join public.profiles p on p.id = j.child_id
    where j.id = jid
      and (j.child_id = (select auth.uid()) or p.parent_id = (select auth.uid()))
  );
$function$;
GRANT ALL ON FUNCTION public.can_view_journey(uuid) TO authenticated;
CREATE FUNCTION public.is_parent_of(child uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1
    from public.profiles p
    where p.id = child
      and p.parent_id = (select auth.uid())
  );
$function$;
GRANT ALL ON FUNCTION public.is_parent_of(uuid) TO authenticated;
CREATE FUNCTION public.owns_journey(jid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1
    from public.journeys j
    where j.id = jid
      and j.child_id = (select auth.uid())
  );
$function$;
GRANT ALL ON FUNCTION public.owns_journey(uuid) TO authenticated;
CREATE TABLE public.activity_prompts (id text NOT NULL, template public.journey_template NOT NULL, kind public.activity_kind NOT NULL, title text NOT NULL, description text DEFAULT ''::text NOT NULL, "position" integer NOT NULL);
ALTER TABLE public.activity_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_prompts ADD CONSTRAINT activity_prompts_pkey PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.activity_prompts TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.activity_prompts TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.activity_prompts TO service_role;
CREATE INDEX activity_prompts_template_idx ON public.activity_prompts (template);
CREATE POLICY activity_prompts_public_read ON public.activity_prompts FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.celebration_plans (journey_id uuid NOT NULL, what text DEFAULT ''::text NOT NULL, who_with text DEFAULT ''::text NOT NULL, where_at text DEFAULT ''::text NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE public.celebration_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.celebration_plans ADD CONSTRAINT celebration_plans_pkey PRIMARY KEY (journey_id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.celebration_plans TO anon;
GRANT ALL ON public.celebration_plans TO authenticated;
GRANT ALL ON public.celebration_plans TO service_role;
CREATE POLICY celebration_select ON public.celebration_plans FOR SELECT TO authenticated USING (public.can_view_journey(journey_id));
CREATE POLICY celebration_update ON public.celebration_plans FOR UPDATE TO authenticated USING (public.owns_journey(journey_id)) WITH CHECK (public.owns_journey(journey_id));
CREATE POLICY celebration_write ON public.celebration_plans FOR INSERT TO authenticated WITH CHECK (public.owns_journey(journey_id));
CREATE TABLE public.comfort_options (key text NOT NULL, label text NOT NULL, helper text NOT NULL, "position" integer NOT NULL);
ALTER TABLE public.comfort_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comfort_options ADD CONSTRAINT comfort_options_pkey PRIMARY KEY (key);
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.comfort_options TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.comfort_options TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.comfort_options TO service_role;
CREATE POLICY comfort_options_public_read ON public.comfort_options FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.journey_activities (id uuid DEFAULT gen_random_uuid() NOT NULL, journey_id uuid NOT NULL, prompt_id text, title text NOT NULL, description text DEFAULT ''::text NOT NULL, status public.activity_status DEFAULT 'planned'::public.activity_status NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE public.journey_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_activities ADD CONSTRAINT journey_activities_pkey PRIMARY KEY (id);
ALTER TABLE public.journey_activities ADD CONSTRAINT journey_activities_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES public.activity_prompts(id) ON DELETE SET NULL;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.journey_activities TO anon;
GRANT ALL ON public.journey_activities TO authenticated;
GRANT ALL ON public.journey_activities TO service_role;
CREATE UNIQUE INDEX journey_activities_prompt_key ON public.journey_activities (journey_id, prompt_id) WHERE prompt_id IS NOT NULL;
CREATE POLICY activities_delete ON public.journey_activities FOR DELETE TO authenticated USING (public.owns_journey(journey_id));
CREATE POLICY activities_select ON public.journey_activities FOR SELECT TO authenticated USING (public.can_view_journey(journey_id));
CREATE POLICY activities_update ON public.journey_activities FOR UPDATE TO authenticated USING (public.owns_journey(journey_id)) WITH CHECK (public.owns_journey(journey_id));
CREATE POLICY activities_write ON public.journey_activities FOR INSERT TO authenticated WITH CHECK (public.owns_journey(journey_id));
CREATE TABLE public.journeys (id uuid DEFAULT gen_random_uuid() NOT NULL, child_id uuid NOT NULL, template public.journey_template NOT NULL, name text NOT NULL, timeline text DEFAULT ''::text NOT NULL, comfort_level text DEFAULT ''::text NOT NULL, quiz_answers jsonb DEFAULT '{}'::jsonb NOT NULL, quiz_scores jsonb DEFAULT '{}'::jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ADD CONSTRAINT journeys_child_id_key UNIQUE (child_id);
ALTER TABLE public.journeys ADD CONSTRAINT journeys_pkey PRIMARY KEY (id);
ALTER TABLE public.celebration_plans ADD CONSTRAINT celebration_plans_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.journeys(id) ON DELETE CASCADE;
ALTER TABLE public.journey_activities ADD CONSTRAINT journey_activities_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.journeys(id) ON DELETE CASCADE;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.journeys TO anon;
GRANT INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.journeys TO authenticated;
GRANT ALL ON public.journeys TO service_role;
CREATE POLICY journeys_insert_own ON public.journeys FOR INSERT TO authenticated WITH CHECK ((child_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY journeys_select_own_or_parent ON public.journeys FOR SELECT TO authenticated USING (((child_id = ( SELECT auth.uid() AS uid)) OR public.is_parent_of(child_id)));
CREATE TABLE public.milestones (id uuid DEFAULT gen_random_uuid() NOT NULL, journey_id uuid NOT NULL, title text NOT NULL, description text DEFAULT ''::text NOT NULL, "position" integer NOT NULL, status public.milestone_status DEFAULT 'todo'::public.milestone_status NOT NULL);
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ADD CONSTRAINT milestones_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.journeys(id) ON DELETE CASCADE;
ALTER TABLE public.milestones ADD CONSTRAINT milestones_journey_id_position_key UNIQUE (journey_id, "position");
ALTER TABLE public.milestones ADD CONSTRAINT milestones_pkey PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.milestones TO anon;
GRANT ALL ON public.milestones TO authenticated;
GRANT ALL ON public.milestones TO service_role;
CREATE POLICY milestones_delete ON public.milestones FOR DELETE TO authenticated USING (public.owns_journey(journey_id));
CREATE POLICY milestones_select ON public.milestones FOR SELECT TO authenticated USING (public.can_view_journey(journey_id));
CREATE POLICY milestones_update ON public.milestones FOR UPDATE TO authenticated USING (public.owns_journey(journey_id)) WITH CHECK (public.owns_journey(journey_id));
CREATE POLICY milestones_write ON public.milestones FOR INSERT TO authenticated WITH CHECK (public.owns_journey(journey_id));
CREATE TABLE public.profiles (id uuid NOT NULL, role public.app_role NOT NULL, display_name text NOT NULL, username text, parent_id uuid, created_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ADD CONSTRAINT child_has_parent CHECK ((role = 'child'::public.app_role) = (parent_id IS NOT NULL));
ALTER TABLE public.profiles ADD CONSTRAINT child_has_username CHECK (role <> 'child'::public.app_role OR username IS NOT NULL);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE public.journeys ADD CONSTRAINT journeys_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT username_format CHECK (username IS NULL OR username ~ '^[a-z0-9_]{3,20}$'::text);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.profiles TO anon;
GRANT INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.profiles TO authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
CREATE UNIQUE INDEX profiles_username_key ON public.profiles (username);
CREATE INDEX profiles_parent_id_idx ON public.profiles (parent_id);
CREATE POLICY profiles_insert_self_parent ON public.profiles FOR INSERT TO authenticated WITH CHECK (((id = ( SELECT auth.uid() AS uid)) AND (role = 'parent'::public.app_role) AND (parent_id IS NULL)));
CREATE POLICY profiles_select_own_or_children ON public.profiles FOR SELECT TO authenticated USING (((id = ( SELECT auth.uid() AS uid)) OR (parent_id = ( SELECT auth.uid() AS uid))));
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING ((id = ( SELECT auth.uid() AS uid))) WITH CHECK ((id = ( SELECT auth.uid() AS uid)));
CREATE TABLE public.provider_interest (id uuid DEFAULT gen_random_uuid() NOT NULL, provider_key text NOT NULL, name text NOT NULL, email text NOT NULL, note text DEFAULT ''::text NOT NULL, created_by uuid NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE public.provider_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_interest ADD CONSTRAINT provider_interest_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.provider_interest ADD CONSTRAINT provider_interest_pkey PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.provider_interest TO anon;
GRANT INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.provider_interest TO authenticated;
GRANT ALL ON public.provider_interest TO service_role;
CREATE INDEX provider_interest_created_by_idx ON public.provider_interest (created_by);
CREATE POLICY interest_insert_own ON public.provider_interest FOR INSERT TO authenticated WITH CHECK ((created_by = ( SELECT auth.uid() AS uid)));
CREATE POLICY interest_select_own ON public.provider_interest FOR SELECT TO authenticated USING ((created_by = ( SELECT auth.uid() AS uid)));
CREATE TABLE public.provider_templates (provider_key text NOT NULL, template public.journey_template NOT NULL, "position" integer DEFAULT 0 NOT NULL);
ALTER TABLE public.provider_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_templates ADD CONSTRAINT provider_templates_pkey PRIMARY KEY (provider_key, template);
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.provider_templates TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.provider_templates TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.provider_templates TO service_role;
CREATE INDEX provider_templates_template_idx ON public.provider_templates (template);
CREATE POLICY provider_templates_public_read ON public.provider_templates FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.provider_testimonials (provider_key text NOT NULL, "position" integer NOT NULL, quote text NOT NULL, attribution text NOT NULL);
ALTER TABLE public.provider_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_testimonials ADD CONSTRAINT provider_testimonials_pkey PRIMARY KEY (provider_key, "position");
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.provider_testimonials TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.provider_testimonials TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.provider_testimonials TO service_role;
CREATE POLICY provider_testimonials_public_read ON public.provider_testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.providers (key text NOT NULL, name text NOT NULL, tagline text NOT NULL, overview text NOT NULL, approach text NOT NULL, format public.provider_format NOT NULL, location text NOT NULL, price_range text NOT NULL, org_type public.org_type NOT NULL, verified boolean DEFAULT false NOT NULL, "position" integer NOT NULL);
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ADD CONSTRAINT providers_pkey PRIMARY KEY (key);
ALTER TABLE public.provider_interest ADD CONSTRAINT provider_interest_provider_key_fkey FOREIGN KEY (provider_key) REFERENCES public.providers(key);
ALTER TABLE public.provider_templates ADD CONSTRAINT provider_templates_provider_key_fkey FOREIGN KEY (provider_key) REFERENCES public.providers(key) ON DELETE CASCADE;
ALTER TABLE public.provider_testimonials ADD CONSTRAINT provider_testimonials_provider_key_fkey FOREIGN KEY (provider_key) REFERENCES public.providers(key) ON DELETE CASCADE;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.providers TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.providers TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.providers TO service_role;
CREATE POLICY providers_public_read ON public.providers FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.quiz_options (id text NOT NULL, question_id text NOT NULL, label text NOT NULL, emoji text NOT NULL, weights jsonb DEFAULT '{}'::jsonb NOT NULL, "position" integer NOT NULL);
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ADD CONSTRAINT quiz_options_pkey PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.quiz_options TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.quiz_options TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.quiz_options TO service_role;
CREATE INDEX quiz_options_question_idx ON public.quiz_options (question_id);
CREATE POLICY quiz_options_public_read ON public.quiz_options FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.quiz_questions (id text NOT NULL, kind public.quiz_question_kind NOT NULL, prompt text NOT NULL, helper text, pick_exactly integer, "position" integer NOT NULL);
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);
ALTER TABLE public.quiz_options ADD CONSTRAINT quiz_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id) ON DELETE CASCADE;
ALTER TABLE public.quiz_questions ADD CONSTRAINT words_have_pick_exactly CHECK ((kind = 'words'::public.quiz_question_kind) = (pick_exactly IS NOT NULL));
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.quiz_questions TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.quiz_questions TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.quiz_questions TO service_role;
CREATE POLICY quiz_questions_public_read ON public.quiz_questions FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.stories (slug text NOT NULL, child_name text NOT NULL, age integer NOT NULL, template public.journey_template NOT NULL, journey_name text NOT NULL, story text NOT NULL, quote text NOT NULL, celebration text NOT NULL, "position" integer NOT NULL);
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ADD CONSTRAINT stories_pkey PRIMARY KEY (slug);
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.stories TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.stories TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.stories TO service_role;
CREATE POLICY stories_public_read ON public.stories FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.template_milestones (template public.journey_template NOT NULL, "position" integer NOT NULL, title text NOT NULL, description text DEFAULT ''::text NOT NULL);
ALTER TABLE public.template_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_milestones ADD CONSTRAINT template_milestones_pkey PRIMARY KEY (template, "position");
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.template_milestones TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.template_milestones TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.template_milestones TO service_role;
CREATE POLICY template_milestones_public_read ON public.template_milestones FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.templates (key public.journey_template NOT NULL, name text NOT NULL, emoji text NOT NULL, tagline text NOT NULL, description text NOT NULL, jewish_lens text NOT NULL, themes text[] DEFAULT '{}'::text[] NOT NULL, celebration_ideas text[] DEFAULT '{}'::text[] NOT NULL, getting_started text[] DEFAULT '{}'::text[] NOT NULL, provider_types text[] DEFAULT '{}'::text[] NOT NULL, "position" integer NOT NULL);
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ADD CONSTRAINT templates_pkey PRIMARY KEY (key);
ALTER TABLE public.activity_prompts ADD CONSTRAINT activity_prompts_template_fkey FOREIGN KEY (template) REFERENCES public.templates(key) ON DELETE CASCADE;
ALTER TABLE public.journeys ADD CONSTRAINT journeys_template_fkey FOREIGN KEY (template) REFERENCES public.templates(key);
ALTER TABLE public.provider_templates ADD CONSTRAINT provider_templates_template_fkey FOREIGN KEY (template) REFERENCES public.templates(key) ON DELETE CASCADE;
ALTER TABLE public.stories ADD CONSTRAINT stories_template_fkey FOREIGN KEY (template) REFERENCES public.templates(key) ON DELETE CASCADE;
ALTER TABLE public.template_milestones ADD CONSTRAINT template_milestones_template_fkey FOREIGN KEY (template) REFERENCES public.templates(key) ON DELETE CASCADE;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.templates TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.templates TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.templates TO service_role;
CREATE POLICY templates_public_read ON public.templates FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.timeline_options (key text NOT NULL, label text NOT NULL, helper text NOT NULL, "position" integer NOT NULL);
ALTER TABLE public.timeline_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_options ADD CONSTRAINT timeline_options_pkey PRIMARY KEY (key);
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.timeline_options TO anon;
GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.timeline_options TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.timeline_options TO service_role;
CREATE POLICY timeline_options_public_read ON public.timeline_options FOR SELECT TO anon, authenticated USING (true);
