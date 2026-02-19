import { apiCall } from "./core";

export interface NovaDataResponse {
  data_type: string;
  content: unknown[];
  updated_at: string | null;
}

export interface AgentMemory {
  id: string;
  agent_code: string;
  memory_type: string;
  content: Record<string, unknown>;
  updated_at: string;
}

export interface AgentMemoryResponse {
  agent_code: string;
  total: number;
  memories: AgentMemory[];
}


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

const FALLBACK_ORG_CHART: OrgChart = {
  ceo: { id: "nova", code: "NOVA", name: "Nova CEO", status: "active" },
  directors: [
    { id: "atlas",  code: "ATLAS",  name: "Marketing Director",  department: "marketing",  status: "active",  sub_agents: [], tasks_today: 0, performance_score: 0 },
    { id: "luna",   code: "LUNA",   name: "Tech Director",       department: "tech",       status: "active",  sub_agents: [], tasks_today: 0, performance_score: 0 },
    { id: "rex",    code: "REX",    name: "Operations Director", department: "operations", status: "idle",    sub_agents: [], tasks_today: 0, performance_score: 0 },
    { id: "vera",   code: "VERA",   name: "Finance Director",    department: "finance",    status: "idle",    sub_agents: [], tasks_today: 0, performance_score: 0 },
    { id: "kira",   code: "KIRA",   name: "Community Director",  department: "community",  status: "active",  sub_agents: [], tasks_today: 0, performance_score: 0 },
    { id: "oracle", code: "ORACLE", name: "Futures Director",    department: "futures",    status: "idle",    sub_agents: [], tasks_today: 0, performance_score: 0 },
    { id: "sophia", code: "SOPHIA", name: "People Director",     department: "people",     status: "active",  sub_agents: [], tasks_today: 0, performance_score: 0 },
  ],
  total_agents: 38,
  total_departments: 7,
};

async function getOrgChartWithFallback(): Promise<OrgChart> {
  try {
    return await apiCall<OrgChart>("/omega/org-chart/");
  } catch {
    return FALLBACK_ORG_CHART;
  }
}

export const omegaApi = {
  getDashboard:  () => apiCall<OmegaDashboardStats>("/omega/dashboard/"),
  getResellers:  () => apiCall<OmegaReseller[]>("/omega/resellers/"),
  getActivity:   () => apiCall<OmegaActivityResponse>("/omega/activity/"),
  getRevenue:    () => apiCall<OmegaRevenue>("/omega/revenue/"),
  getOrgChart:   () => getOrgChartWithFallback(),
  // Nova dual-storage
  saveNovaData:  (data_type: string, content: unknown) =>
    apiCall<{ success: boolean; data_type: string; updated_at: string }>("/nova/data/", "POST", { data_type, content }),
  loadNovaData:  (data_type: string) =>
    apiCall<NovaDataResponse>(`/nova/data/?type=${data_type}`, "GET"),
  // Agent Memory
  getAgentMemory: (agent_code: string) =>
    apiCall<AgentMemoryResponse>(`/nova/agent-memory/?agent_code=${agent_code}`, "GET"),
  saveAgentMemory: (agent_code: string, memory_type: string, content: Record<string, unknown>) =>
    apiCall<{ success: boolean; id: string; agent_code: string }>("/nova/agent-memory/", "POST", { agent_code, memory_type, content }),
};
