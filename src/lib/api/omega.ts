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

// API returns { activities: [...], total: N }
export interface OmegaActivity {
  type: string;
  description: string;
  timestamp: string;
  client_id?: string | null;
}

export interface OmegaActivityResponse {
  activities: OmegaActivity[];
  total: number;
}

export interface OmegaRevenue {
  mrr: number;
  arr: number;
  breakdown: { plan: string; count: number; revenue: number }[];
}

export type OrgAgentStatus = "active" | "online" | "in_task" | "idle" | "in_training" | "inactive" | "error";

export interface OrgSubAgent {
  id: string;
  code: string;
  name: string;
  status: OrgAgentStatus;
  description?: string;
}

export interface OrgDirector {
  id: string;
  code: string;
  name: string;
  department: string;
  status: OrgAgentStatus;
  sub_agents: OrgSubAgent[];
  tasks_today: number;
  performance_score: number;
}

export interface OrgChart {
  ceo: {
    id: string;
    code: string;
    name: string;
    status: OrgAgentStatus;
  };
  directors: OrgDirector[];
  total_agents: number;
  total_departments: number;
}

export const omegaApi = {
  getDashboard: () => apiCall<OmegaDashboardStats>("/omega/dashboard/"),
  getResellers: () => apiCall<OmegaReseller[]>("/omega/resellers/"),
  getActivity: () => apiCall<OmegaActivityResponse>("/omega/activity/"),
  getRevenue: () => apiCall<OmegaRevenue>("/omega/revenue/"),
  getOrgChart: () => apiCall<OrgChart>("/omega/org-chart/"),
};
