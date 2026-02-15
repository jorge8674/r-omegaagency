// ─── Reseller Core ────────────────────────────────────────
export type ResellerStatus = "active" | "suspended" | "pending" | "cancelled";

export interface ResellerBase {
  id: string;
  agency_name: string;
  owner_name: string;
  owner_email: string;
  slug: string;
  status: ResellerStatus;
  white_label_active: boolean;
  omega_commission_rate: number;
  monthly_revenue_reported: number;
  stripe_account_id: string | null;
  stripe_customer_id: string | null;
  clients_migrated: boolean;
  suspend_switch: boolean;
  payment_due_date: string | null;
  days_overdue: number;
  created_at: string;
  updated_at: string;
}

export interface ResellerCreateRequest {
  agency_name: string;
  owner_name: string;
  owner_email: string;
  slug: string;
}

export interface ResellerStatusUpdate {
  status?: ResellerStatus;
  suspend_switch?: boolean;
  white_label_active?: boolean;
}

// ─── Reseller Dashboard ──────────────────────────────────
export interface ResellerKpis {
  total: number;
  active: number;
  with_mora: number;
}

export interface ResellerListResponse {
  resellers: ResellerBase[];
  kpis: ResellerKpis;
}

export interface ResellerDashboardResponse {
  reseller: ResellerBase;
  clients_count: number;
  agents_count: number;
  monthly_revenue: number;
  active_campaigns: number;
}

// ─── Reseller Branding ───────────────────────────────────
export type HeroMediaType = "image" | "video" | "none";
export type PricingPeriod = "monthly" | "annual";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface LegalPage {
  title: string;
  content: string;
}

export interface BrandingService {
  name: string;
  description: string;
  icon?: string;
}

export interface BrandingMetric {
  label: string;
  value: string;
}

export interface BrandingProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface BrandingTestimonial {
  name: string;
  company: string;
  text: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  period: PricingPeriod;
  features: string[];
  cta_text: string;
  highlighted: boolean;
}

export interface ResellerBrandingPayload {
  agency_tagline: string | null;
  badge_text: string | null;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  hero_media_url: string | null;
  hero_media_type: HeroMediaType;
  hero_cta_text: string | null;
  footer_email: string | null;
  footer_phone: string | null;
  social_links: SocialLink[];
  pain_items: string[];
  solution_items: string[];
  services: BrandingService[];
  metrics: BrandingMetric[];
  process_steps: BrandingProcessStep[];
  testimonials: BrandingTestimonial[];
  legal_pages: LegalPage[];
  pricing_plans: PricingPlan[];
}

// ─── Reseller Agents ─────────────────────────────────────
export type AgentStatus = "active" | "inactive" | "pending";

export interface ResellerAgent {
  id: string;
  name: string;
  email: string;
  reseller_id: string;
  status: AgentStatus;
  hourly_rate: number | null;
  created_at: string;
}

// ─── Reseller Clients ────────────────────────────────────
export interface ResellerClient {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  plan: string | null;
  active: boolean;
  reseller_id: string;
}
