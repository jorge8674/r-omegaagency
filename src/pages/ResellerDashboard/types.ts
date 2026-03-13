/* ResellerDashboard types — API response shapes */

export interface ResellerProfile {
  id: string;
  email: string;
  name: string;
  company: string;
  plan: string;
  reseller_plan: string;
  max_clients: number;
  active_clients: number;
  payment_status: "active" | "overdue" | "warning" | "ok" | "upcoming";
}

export interface ResellerKpis {
  mrr_generated: number;
  mrr_prev_month: number;
  mrr_delta: number;
  total_posts_month: number;
  active_alerts: number;
  healthy_clients: number;
  warning_clients: number;
  critical_clients: number;
}

export interface ClientSocialAccount {
  id: string;
  platform: string;
  connected: boolean;
  username: string;
}

export interface ClientUpcomingPost {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  text_content: string;
  status: string;
  platform: string;
  has_connected_account: boolean;
}

export interface ClientAlert {
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
}

export interface ClientStats {
  posts_this_month: number;
  connected_accounts: number;
  total_accounts: number;
  revenue_monthly: number;
  plan: string;
}

export interface ResellerClient {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  health: "green" | "yellow" | "red";
  social_accounts: ClientSocialAccount[];
  upcoming_posts: ClientUpcomingPost[];
  stats: ClientStats;
  alerts: ClientAlert[];
  last_activity_days: number;
}

export interface UpsellOpportunity {
  client_id: string;
  client_name: string;
  type: "near_limit" | "onboarding" | "churn_risk";
  message: string;
  cta: string;
  potential_revenue_min: number;
  potential_revenue_max: number;
}

export interface AgentReport {
  id: string;
  agent_code: string;
  agent_type: string;
  client_name: string;
  summary: string;
  created_at: string;
}

export interface ResellerHomeData {
  profile: ResellerProfile;
  kpis: ResellerKpis;
  clients: ResellerClient[];
  agent_reports: AgentReport[];
  upsell_opportunities: UpsellOpportunity[];
}

export interface ResellerUpsellPayload {
  client_id: string;
  client_name: string;
  reseller_id: string;
  request_type: string;
  item_name: string;
  monthly_price: number;
  reseller_message?: string;
}
