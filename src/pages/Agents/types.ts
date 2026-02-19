/* ─── Agent types for /agents/ endpoints ──────── */

export type AgentStatus = "active" | "running" | "inactive" | "error";

export type AgentDepartment =
  | "nucleo" | "contenido" | "video"
  | "contexto" | "publicacion" | "analytics";

export interface Agent {
  id: string;
  name: string;
  position: string;
  department: AgentDepartment;
  description: string;
  status: AgentStatus;
  model: string;
  api_key_env: string;
  responsibilities: string[];
  last_execution: string | null;
  total_tasks: number;
  success_rate: number;
  avg_response_time_ms: number;
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

export interface AgentExecuteRequest {
  client_id: string;
  brief: string;
}

export interface AgentsListResponse {
  success: boolean;
  data: Agent[];
  total: number;
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

export const DEPARTMENT_LABELS: Record<string, string> = {
  nucleo: "Núcleo",
  contenido: "Contenido",
  video: "Video",
  contexto: "Contexto",
  publicacion: "Publicación",
  analytics: "Analytics",
};

export const STATUS_DOT: Record<AgentStatus, string> = {
  active: "bg-success",
  running: "bg-warning",
  inactive: "bg-muted-foreground",
  error: "bg-destructive",
};
