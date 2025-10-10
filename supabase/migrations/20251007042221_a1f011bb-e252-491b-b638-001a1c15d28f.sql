-- Add approved column to user_roles
ALTER TABLE public.user_roles ADD COLUMN approved boolean DEFAULT false;

-- Update existing admin roles to be approved
UPDATE public.user_roles SET approved = true WHERE role = 'admin';

-- Create a view for pending admin requests
CREATE OR REPLACE VIEW public.pending_admin_requests AS
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
WHERE ur.approved = false;

-- Grant access to the view
GRANT SELECT ON public.pending_admin_requests TO authenticated;
