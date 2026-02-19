import { apiCall } from "./core";

export interface OmegaDashboardStats {
  mrr: number;
  arr: number;
  total_clients: number;
  active_clients: number;
  new_clients_this_month: number;
  total_resellers: number;
  active_resellers: number;
  trial_resellers: number;
  content_generated_month: number;
  content_breakdown: Record<string, number>;
  videos_generated: number;
  agent_executions: number;
  agent_success_rate: number;
  top_agents: { name: string; executions: number }[];
}

export interface OmegaReseller {
  id: string;
  agency_name: string;
  slug: string;
  plan: string | null;
  clients_count: number;
  mrr: number;
  status: string;
  white_label_active: boolean | null;
}

export interface OmegaActivity {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  entity: string | null;
}

export interface OmegaRevenue {
  mrr: number;
  arr: number;
  breakdown: { plan: string; count: number; revenue: number }[];
}

export interface OmegaUpcomingPost {
  id: string;
  scheduled_at: string;
  platform: string;
  client_name: string;
  title: string;
  status: string;
}

export const omegaApi = {
  getDashboard: () => apiCall<OmegaDashboardStats>("/omega/dashboard/"),
  getResellers: () => apiCall<OmegaReseller[]>("/omega/resellers/"),
  getActivity: () => apiCall<OmegaActivity[]>("/omega/activity/"),
  getRevenue: () => apiCall<OmegaRevenue>("/omega/revenue/"),
};
