import { apiCall } from "./core";
import type {
  AgentsListResponse,
  AgentDetailResponse,
  AgentExecutionsResponse,
  AgentLogsResponse,
} from "@/pages/Agents/types";

/* ─── CRUD agents endpoints ──────────────────── */

export function listAgents(): Promise<AgentsListResponse> {
  return apiCall<AgentsListResponse>("/agents/");
}

export function getAgent(id: string): Promise<AgentDetailResponse> {
  return apiCall<AgentDetailResponse>(`/agents/${id}/`);
}

export function executeAgent(
  id: string,
  clientId: string,
  brief: string,
  platform?: string,
): Promise<{ success: boolean; data: unknown }> {
  return apiCall(`/agents/${id}/execute/`, "POST", {
    client_id: clientId,
    input_data: { brief, platform: platform || "instagram" },
  });
}

export function getAgentExecutions(
  id: string,
): Promise<AgentExecutionsResponse> {
  return apiCall<AgentExecutionsResponse>(`/agents/${id}/executions/`);
}

export function getAgentLogs(id: string): Promise<AgentLogsResponse> {
  return apiCall<AgentLogsResponse>(`/agents/${id}/logs/`);
}
