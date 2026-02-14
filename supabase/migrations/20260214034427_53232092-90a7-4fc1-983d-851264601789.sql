
-- ============================================
-- OMEGA FASE 2 — MULTI-TENANT RESELLER SYSTEM
-- ============================================

-- TABLA: resellers
CREATE TABLE IF NOT EXISTS resellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  agency_name VARCHAR NOT NULL,
  owner_email VARCHAR NOT NULL UNIQUE,
  owner_name VARCHAR NOT NULL,
  stripe_account_id VARCHAR,
  stripe_customer_id VARCHAR,
  white_label_active BOOLEAN DEFAULT false,
  status VARCHAR DEFAULT 'active',
  omega_commission_rate DECIMAL DEFAULT 0.30,
  monthly_revenue_reported DECIMAL DEFAULT 0,
  payment_due_date DATE,
  days_overdue INT DEFAULT 0,
  suspend_switch BOOLEAN DEFAULT false,
  clients_migrated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: reseller_branding
CREATE TABLE IF NOT EXISTS reseller_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID REFERENCES resellers(id) ON DELETE CASCADE,
  logo_url VARCHAR,
  hero_media_url VARCHAR,
  hero_media_type VARCHAR DEFAULT 'image',
  primary_color VARCHAR DEFAULT '38 85% 55%',
  secondary_color VARCHAR DEFAULT '225 12% 14%',
  agency_tagline VARCHAR,
  badge_text VARCHAR DEFAULT 'Boutique Creative Agency',
  hero_cta_text VARCHAR DEFAULT 'Comenzar',
  pain_items JSONB DEFAULT '[]',
  solution_items JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '[]',
  process_steps JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]',
  footer_email VARCHAR,
  footer_phone VARCHAR,
  social_links JSONB DEFAULT '[]',
  legal_pages JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: reseller_agents
CREATE TABLE IF NOT EXISTS reseller_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID REFERENCES resellers(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  hourly_rate DECIMAL,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODIFICAR clients (agregar campos MultiOMEGA + reseller)
-- Nota: 'plan' ya existe en clients, no se re-agrega
ALTER TABLE clients 
  ADD COLUMN IF NOT EXISTS reseller_id UUID REFERENCES resellers(id) NULL,
  ADD COLUMN IF NOT EXISTS white_label_plan VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS monthly_budget_total DECIMAL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS budget_operative_60 DECIMAL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS budget_reserve_40 DECIMAL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS human_supervision BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS human_hours_package VARCHAR DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR,
  ADD COLUMN IF NOT EXISTS trial_active BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_resellers_slug ON resellers(slug);
CREATE INDEX IF NOT EXISTS idx_resellers_status ON resellers(status);
CREATE INDEX IF NOT EXISTS idx_reseller_branding_reseller_id ON reseller_branding(reseller_id);
CREATE INDEX IF NOT EXISTS idx_clients_reseller_id ON clients(reseller_id);

-- TRIGGERS updated_at
DROP TRIGGER IF EXISTS update_resellers_updated_at ON resellers;
CREATE TRIGGER update_resellers_updated_at
  BEFORE UPDATE ON resellers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reseller_branding_updated_at ON reseller_branding;
CREATE TRIGGER update_reseller_branding_updated_at
  BEFORE UPDATE ON reseller_branding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS para resellers (admin OMEGA puede todo, reseller ve solo su registro)
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all resellers"
  ON resellers FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Reseller can view own record"
  ON resellers FOR SELECT
  USING (owner_email = (SELECT auth.jwt()->>'email'));

-- RLS para reseller_branding
ALTER TABLE reseller_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all branding"
  ON reseller_branding FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Reseller can manage own branding"
  ON reseller_branding FOR ALL
  USING (reseller_id IN (
    SELECT id FROM resellers WHERE owner_email = (SELECT auth.jwt()->>'email')
  ));

-- RLS para reseller_agents
ALTER TABLE reseller_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all agents"
  ON reseller_agents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Reseller can manage own agents"
  ON reseller_agents FOR ALL
  USING (reseller_id IN (
    SELECT id FROM resellers WHERE owner_email = (SELECT auth.jwt()->>'email')
  ));

-- Storage bucket para reseller media
INSERT INTO storage.buckets (id, name, public)
VALUES ('reseller-media', 'reseller-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view reseller media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reseller-media');

CREATE POLICY "Authenticated users can upload reseller media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'reseller-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update reseller media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'reseller-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete reseller media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'reseller-media' AND auth.role() = 'authenticated');
