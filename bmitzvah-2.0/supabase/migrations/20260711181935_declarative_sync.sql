SET check_function_bodies = false;
CREATE FUNCTION public.parent_notification_email()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select u.email
  from public.profiles me
  join auth.users u on u.id = me.parent_id
  where me.id = (select auth.uid());
$function$;
GRANT ALL ON FUNCTION public.parent_notification_email() TO authenticated;
