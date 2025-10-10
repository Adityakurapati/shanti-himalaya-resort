-- Fix security issues by removing the view that exposes auth.users
DROP VIEW IF EXISTS public.pending_admin_requests;

-- Create a security definer function instead to get pending requests
CREATE OR REPLACE FUNCTION public.get_pending_admin_requests()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role app_role,
  approved boolean,
  created_at timestamptz,
  email text,
  user_created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.approved,
    ur.created_at,
    au.email,
    au.created_at as user_created_at
  FROM public.user_roles ur
  JOIN auth.users au ON ur.user_id = au.id
  WHERE ur.approved = false
    AND public.has_role(auth.uid(), 'admin');
$$;
