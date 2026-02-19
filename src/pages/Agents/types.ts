/* ─── Agent types for /agents/ endpoints ──────── */

export type AgentStatus = "active" | "running" | "inactive" | "error";

export type AgentDepartment =
  | "núcleo" | "contenido" | "video"
  | "contexto" | "publicación" | "analytics";

export interface Agent {
  id: string;
  agent_id: string;
  name: string;
  description: string;
  department: AgentDepartment;
  category: string;
  status: AgentStatus;
  version: string;
  capabilities: string[];
  config: Record<string, unknown>;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  success_rate: number;
  avg_execution_time_ms: number;
  last_executed_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentExecution {
  id: string;
  agent_id: string;
  status: "success" | "error" | "running";
  started_at: string;
  completed_at: string | null;
  duration_ms: number;
  input_summary: string;
  output_summary: string;
}

export interface AgentLogEntry {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

export interface AgentsListResponse {
  items: Agent[];
}

export interface AgentDetailResponse {
  success: boolean;
  data: Agent;
}

export interface AgentExecutionsResponse {
  success: boolean;
  data: AgentExecution[];
}

export interface AgentLogsResponse {
  success: boolean;
  data: AgentLogEntry[];
}

/* ─── Department labels & colors ─────────────── */

export const DEPARTMENTS: AgentDepartment[] = [
  "núcleo", "contenido", "video", "contexto", "publicación", "analytics",
];

export const DEPARTMENT_LABELS: Record<string, string> = {
  núcleo: "Núcleo",
  contenido: "Contenido",
  video: "Video",
  contexto: "Contexto",
  publicación: "Publicación",
  analytics: "Analytics",
};

export const STATUS_DOT: Record<AgentStatus, string> = {
  active: "bg-emerald-500",
  running: "bg-amber-400 animate-pulse",
  inactive: "bg-muted-foreground",
  error: "bg-destructive",
};
