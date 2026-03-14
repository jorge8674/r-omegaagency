// ─── Agent pricing constants & types ────────────────────
// R-DDD-001: Pure business logic — zero React, zero UI

export const DIRECTOR_CODES = [
  "ATLAS", "LUNA", "REX", "VERA", "KIRA", "ORACLE", "SOPHIA",
];

export const SENTINEL_CODE = "SENTINEL";

export function agentPrice(code: string, role?: string): number {
  if (code === SENTINEL_CODE) return 1320;
  if (DIRECTOR_CODES.includes(code) || role === "director") return 1080;
  return 840;
}

export interface AgentCardData {
  code: string;
  name: string;
  department: string;
  role?: string;
}

export interface DeptData {
  dept: string;
  agents: AgentCardData[];
  total: number;
}
