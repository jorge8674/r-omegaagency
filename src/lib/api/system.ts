const SYSTEM_STATS_URL =
  "https://omegaraisen-production-2031.up.railway.app/api/v1/system/stats";

export interface SystemStats {
  total_endpoints: number;
  total_agents: number;
  active_agents: number;
}

export async function getSystemStats(): Promise<SystemStats> {
  const res = await fetch(SYSTEM_STATS_URL);
  if (!res.ok) throw new Error(`System stats error ${res.status}`);
  return res.json();
}
