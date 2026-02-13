
-- AI providers catalog
CREATE TABLE public.ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view providers" ON public.ai_providers FOR SELECT TO authenticated USING (true);

-- Seed providers
INSERT INTO public.ai_providers (name, slug, description, capabilities) VALUES
  ('Google Gemini', 'gemini', 'Textos, imágenes y video (VEO3). Multimodal avanzado.', ARRAY['text', 'image', 'video']),
  ('OpenAI GPT + DALL-E', 'openai', 'Generación de textos y creación de imágenes con DALL-E.', ARRAY['text', 'image']),
  ('ElevenLabs', 'elevenlabs', 'Generación de voz y audio para videos y podcasts.', ARRAY['audio', 'voice']),
  ('Runway ML', 'runway', 'Generación y edición de video con IA.', ARRAY['video', 'image']),
  ('Midjourney', 'midjourney', 'Creación de imágenes artísticas de alta calidad.', ARRAY['image']),
  ('Anthropic Claude', 'claude', 'Textos largos, análisis y razonamiento avanzado.', ARRAY['text']),
  ('Stability AI', 'stability', 'Generación de imágenes con Stable Diffusion.', ARRAY['image']),
  ('Lovable AI', 'lovable', 'IA integrada sin costo adicional. Textos e imágenes básicas.', ARRAY['text', 'image']);

-- Client AI configuration
CREATE TABLE public.client_ai_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  package TEXT NOT NULL DEFAULT 'basic' CHECK (package IN ('basic', 'pro', 'enterprise')),
  monthly_budget NUMERIC(10,2) DEFAULT 0,
  budget_used NUMERIC(10,2) DEFAULT 0,
  active_providers TEXT[] NOT NULL DEFAULT '{"lovable"}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id)
);

ALTER TABLE public.client_ai_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org ai config" ON public.client_ai_config
  FOR SELECT USING (organization_id = get_user_org_id(auth.uid()));

CREATE POLICY "Editors+ can manage org ai config" ON public.client_ai_config
  FOR ALL USING (
    organization_id = get_user_org_id(auth.uid()) 
    AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
  );

-- Organization-level API keys for providers
CREATE TABLE public.org_ai_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  provider_slug TEXT NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, provider_slug)
);

ALTER TABLE public.org_ai_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage org ai keys" ON public.org_ai_keys
  FOR ALL USING (
    organization_id = get_user_org_id(auth.uid()) 
    AND has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Editors can view org ai keys" ON public.org_ai_keys
  FOR SELECT USING (
    organization_id = get_user_org_id(auth.uid())
    AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
  );

-- Triggers for updated_at
CREATE TRIGGER update_client_ai_config_updated_at
  BEFORE UPDATE ON public.client_ai_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_org_ai_keys_updated_at
  BEFORE UPDATE ON public.org_ai_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Index for performance
CREATE INDEX idx_client_ai_config_client ON public.client_ai_config(client_id);
CREATE INDEX idx_org_ai_keys_org ON public.org_ai_keys(organization_id);
