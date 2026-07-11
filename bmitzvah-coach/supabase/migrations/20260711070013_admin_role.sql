SET check_function_bodies = false;
ALTER TYPE public.app_role ADD VALUE 'admin' AFTER 'child';
CREATE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$function$;
GRANT ALL ON FUNCTION public.is_admin() TO authenticated;
GRANT DELETE, INSERT, UPDATE ON public.activity_prompts TO authenticated;
CREATE POLICY activity_prompts_admin_write ON public.activity_prompts TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY celebration_admin_read ON public.celebration_plans FOR SELECT TO authenticated USING (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.comfort_options TO authenticated;
CREATE POLICY comfort_options_admin_write ON public.comfort_options TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY activities_admin_read ON public.journey_activities FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY journeys_admin_read ON public.journeys FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY milestones_admin_read ON public.milestones FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY profiles_admin_read ON public.profiles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY interest_admin_read ON public.provider_interest FOR SELECT TO authenticated USING (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.provider_templates TO authenticated;
CREATE POLICY provider_templates_admin_write ON public.provider_templates TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.provider_testimonials TO authenticated;
CREATE POLICY provider_testimonials_admin_write ON public.provider_testimonials TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.providers TO authenticated;
CREATE POLICY providers_admin_write ON public.providers TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.quiz_options TO authenticated;
CREATE POLICY quiz_options_admin_write ON public.quiz_options TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.quiz_questions TO authenticated;
CREATE POLICY quiz_questions_admin_write ON public.quiz_questions TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.stories TO authenticated;
CREATE POLICY stories_admin_write ON public.stories TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.template_milestones TO authenticated;
CREATE POLICY template_milestones_admin_write ON public.template_milestones TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.templates TO authenticated;
CREATE POLICY templates_admin_write ON public.templates TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT DELETE, INSERT, UPDATE ON public.timeline_options TO authenticated;
CREATE POLICY timeline_options_admin_write ON public.timeline_options TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
