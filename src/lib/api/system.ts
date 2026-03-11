import { apiCall } from "./core";

export interface SystemStats {
  total_endpoints: number;
  total_agents: number;
  active_agents: number;
}

export async function getSystemStats(): Promise<SystemStats> {
  return apiCall<SystemStats>("/system/stats");
}