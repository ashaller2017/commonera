SET check_function_bodies = false;
DROP POLICY interest_insert_own ON public.provider_interest;
CREATE FUNCTION public.is_child()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'child'
  );
$function$;
GRANT ALL ON FUNCTION public.is_child() TO authenticated;
CREATE FUNCTION public.is_parent()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'parent'
  );
$function$;
GRANT ALL ON FUNCTION public.is_parent() TO authenticated;
CREATE TABLE public.provider_favorite (child_id uuid NOT NULL, provider_key text NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE public.provider_favorite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_favorite ADD CONSTRAINT provider_favorite_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.provider_favorite ADD CONSTRAINT provider_favorite_pkey PRIMARY KEY (child_id, provider_key);
ALTER TABLE public.provider_favorite ADD CONSTRAINT provider_favorite_provider_key_fkey FOREIGN KEY (provider_key) REFERENCES public.providers(key) ON DELETE CASCADE;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.provider_favorite TO anon;
GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON public.provider_favorite TO authenticated;
GRANT ALL ON public.provider_favorite TO service_role;
CREATE INDEX provider_favorite_provider_key_idx ON public.provider_favorite (provider_key);
CREATE POLICY favorite_admin_read ON public.provider_favorite FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY favorite_delete_own ON public.provider_favorite FOR DELETE TO authenticated USING ((child_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY favorite_insert_own ON public.provider_favorite FOR INSERT TO authenticated WITH CHECK (((child_id = ( SELECT auth.uid() AS uid)) AND public.is_child()));
CREATE POLICY favorite_select_own_or_parent ON public.provider_favorite FOR SELECT TO authenticated USING (((child_id = ( SELECT auth.uid() AS uid)) OR public.is_parent_of(child_id)));
CREATE POLICY interest_insert_own ON public.provider_interest FOR INSERT TO authenticated WITH CHECK (((created_by = ( SELECT auth.uid() AS uid)) AND public.is_parent()));
