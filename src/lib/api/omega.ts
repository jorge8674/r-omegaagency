// 160 lines
import { apiCall } from "./core";

// ─── Nova Data ──────────────────────────────────────────────────────────────
export interface NovaDataResponse {
  data_type: string;
  content: unknown[];
  updated_at: string | null;
}

// ─── Agent Memory ────────────────────────────────────────────────────────────
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

// ─── Omega Dashboard ─────────────────────────────────────────────────────────
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
  type: string;
  description: string;
  timestamp: string;
  client_id?: string | null;
  client_name?: string | null;
  agent_code?: string | null;
  status?: string | null;
  tokens_used?: number | null;
  provider?: string | null;
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

// ─── Org Chart (matches real backend structure) ──────────────────────────────
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

/** Flattened chart — normalized from either API shape */
export interface OrgChart {
  ceo: { id: string; code: string; name: string; status: OrgAgentStatus };
  directors: OrgDirector[];
  total_agents: number;
  total_departments: number;
}

// ─── Backend shape (nested by dept) ─────────────────────────────────────────
interface BackendDirectorEntry {
  agent_code: string;
  name: string;
  status: string;
  description?: string;
  performance_score: number;
  tasks_completed_total: number;
  reports_to?: string;
}

interface BackendOrgChart {
  org_chart?: Record<string, { director: BackendDirectorEntry; sub_agents: BackendDirectorEntry[] }>;
  departments?: string[];
  total_agents?: number;
}

function normalizeOrgChart(raw: BackendOrgChart): OrgChart {
  const deptMap = raw.org_chart ?? {};
  const departments = raw.departments ?? Object.keys(deptMap);

  const directors: OrgDirector[] = departments.filter(d => d !== 'ceo').map((dept) => {
    const entry = deptMap[dept];
    const d = entry?.director;
    const subs = (entry?.sub_agents ?? []).map((s, i) => ({
      id: `${dept}-sub-${i}`,
      code: s.agent_code,
      name: s.name,
      status: (s.status ?? "idle") as OrgAgentStatus,
      description: s.description,
    }));
    return {
      id: dept,
      code: d?.agent_code ?? dept.toUpperCase().slice(0, 5),
      name: d?.name ?? dept,
      department: dept,
      status: (d?.status ?? "idle") as OrgAgentStatus,
      sub_agents: subs,
      tasks_today: 0,
      performance_score: d?.performance_score ?? 0,
    };
  });

  return {
    ceo: { id: "nova", code: "NOVA", name: "Nova CEO", status: "active" },
    directors,
    total_agents: raw.total_agents ?? directors.length,
    total_departments: departments.length,
  };
}

const STATIC_FALLBACK: OrgChart = normalizeOrgChart({
  departments: ["marketing", "tech", "operations", "finance", "community", "futures", "people", "security"],
  total_agents: 58,
  org_chart: {
    marketing:  { director: { agent_code: "ATLAS",    name: "ATLAS — Marketing Director",        status: "active", performance_score: 95, tasks_completed_total: 2847 }, sub_agents: [] },
    tech:       { director: { agent_code: "LUNA",     name: "LUNA — Product & Tech Director",    status: "active", performance_score: 98, tasks_completed_total: 3201 }, sub_agents: [] },
    operations: { director: { agent_code: "REX",      name: "REX — Operations Director",         status: "active", performance_score: 92, tasks_completed_total: 2654 }, sub_agents: [] },
    finance:    { director: { agent_code: "VERA",     name: "VERA — Finance Director",           status: "active", performance_score: 96, tasks_completed_total: 1876 }, sub_agents: [] },
    community:  { director: { agent_code: "KIRA",     name: "KIRA — Community Director",         status: "active", performance_score: 94, tasks_completed_total: 2123 }, sub_agents: [] },
    futures:    { director: { agent_code: "ORACLE",   name: "ORACLE — Futures Director",         status: "idle",   performance_score: 91, tasks_completed_total: 1534 }, sub_agents: [] },
    people:     { director: { agent_code: "SOPHIA",   name: "SOPHIA — People & HR Director",     status: "active", performance_score: 97, tasks_completed_total: 1987 }, sub_agents: [] },
    security:   { director: { agent_code: "SENTINEL", name: "SENTINEL — Security Director",  status: "active", performance_score: 99, tasks_completed_total: 3850 }, sub_agents: [
      { agent_code: "VAULT",         name: "VAULT — Secrets & Keys Manager",        status: "active",   description: "Gestión segura de claves API y secretos del sistema.",        performance_score: 97, tasks_completed_total: 412 },
      { agent_code: "FORTRESS",      name: "FORTRESS — Perimeter Defense",          status: "active",   description: "Monitoreo y defensa del perímetro de red.",                  performance_score: 95, tasks_completed_total: 388 },
      { agent_code: "PULSE_MONITOR", name: "PULSE — System Health Monitor",         status: "active",   description: "Monitoreo continuo de salud del sistema 24/7.",              performance_score: 99, tasks_completed_total: 520 },
      { agent_code: "CIPHER",        name: "CIPHER — Encryption Specialist",        status: "active",   description: "Cifrado end-to-end de datos sensibles.",                     performance_score: 98, tasks_completed_total: 301 },
      { agent_code: "PHANTOM",       name: "PHANTOM — Threat Intelligence",         status: "in_task",  description: "Análisis proactivo de amenazas externas.",                   performance_score: 93, tasks_completed_total: 275 },
      { agent_code: "IRONWALL",      name: "IRONWALL — Access Control",             status: "active",   description: "Control granular de accesos y permisos.",                    performance_score: 96, tasks_completed_total: 348 },
      { agent_code: "TRACE",         name: "TRACE — Audit & Compliance",            status: "active",   description: "Trazabilidad y cumplimiento normativo.",                     performance_score: 94, tasks_completed_total: 290 },
      { agent_code: "SHIELD",        name: "SHIELD — Incident Response",            status: "idle",     description: "Respuesta rápida ante incidentes de seguridad.",             performance_score: 91, tasks_completed_total: 187 },
      { agent_code: "WATCHDOG",      name: "WATCHDOG — Anomaly Detection",          status: "active",   description: "Detección de anomalías y comportamientos inusuales.",        performance_score: 97, tasks_completed_total: 445 },
      { agent_code: "LOCKBOX",       name: "LOCKBOX — Data Classification",         status: "in_task",  description: "Clasificación automática de datos por nivel de sensibilidad.", performance_score: 92, tasks_completed_total: 213 },
      { agent_code: "SENTRY",        name: "SENTRY — API Gateway Guardian",         status: "active",   description: "Protección y validación de todas las llamadas API.",         performance_score: 96, tasks_completed_total: 367 },
      { agent_code: "AEGIS",         name: "AEGIS — Zero Trust Enforcer",           status: "active",   description: "Implementación de arquitectura zero-trust.",                 performance_score: 98, tasks_completed_total: 304 },
    ]},
  },
});

async function getOrgChartWithFallback(): Promise<OrgChart> {
  try {
    const raw = await apiCall<BackendOrgChart>("/omega/org-chart/");
    if (raw?.org_chart || raw?.departments) return normalizeOrgChart(raw);
    return STATIC_FALLBACK;
  } catch {
    return STATIC_FALLBACK;
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────
export const omegaApi = {
  getDashboard:    () => apiCall<OmegaDashboardStats>("/omega/dashboard/"),
  getResellers:    () => apiCall<OmegaReseller[]>("/omega/resellers/"),
  getActivity:     () => apiCall<OmegaActivityResponse>("/omega/activity/"),
  getRevenue:      () => apiCall<OmegaRevenue>("/omega/revenue/"),
  getOrgChart:     () => getOrgChartWithFallback(),
  // Nova dual-storage
  saveNovaData: (data_type: string, content: unknown) =>
    apiCall<{ success: boolean; data_type: string; updated_at: string }>("/nova/data/", "POST", { data_type, content }),
  loadNovaData: (data_type: string) =>
    apiCall<NovaDataResponse>(`/nova/data/?type=${data_type}`, "GET"),
  // Agent Memory
  getAgentMemory: (agent_code: string) =>
    apiCall<AgentMemoryResponse>(`/nova/agent-memory/?agent_code=${agent_code}`, "GET"),
  saveAgentMemory: (agent_code: string, memory_type: string, content: Record<string, unknown>) =>
    apiCall<{ success: boolean; id: string; agent_code: string }>("/nova/agent-memory/", "POST", { agent_code, memory_type, content }),
};
