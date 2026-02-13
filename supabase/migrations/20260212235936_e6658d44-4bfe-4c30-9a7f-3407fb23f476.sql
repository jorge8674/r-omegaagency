
-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_org ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit logs for their org"
ON public.audit_logs FOR SELECT TO authenticated
USING (organization_id = public.get_user_org_id(auth.uid()));

CREATE POLICY "Users can insert audit logs for their org"
ON public.audit_logs FOR INSERT TO authenticated
WITH CHECK (organization_id = public.get_user_org_id(auth.uid()));

-- Allow admins to view all profiles in their org (for team management)
CREATE POLICY "Users can view profiles in their org"
ON public.profiles FOR SELECT TO authenticated
USING (organization_id = public.get_user_org_id(auth.uid()));

-- Allow users to view roles
CREATE POLICY "Users can view roles in their org"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id IN (
  SELECT p.user_id FROM public.profiles p
  WHERE p.organization_id = public.get_user_org_id(auth.uid())
));

-- Allow admins to update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update org
CREATE POLICY "Admins can update their org"
ON public.organizations FOR UPDATE TO authenticated
USING (id = public.get_user_org_id(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their org"
ON public.organizations FOR SELECT TO authenticated
USING (id = public.get_user_org_id(auth.uid()));
