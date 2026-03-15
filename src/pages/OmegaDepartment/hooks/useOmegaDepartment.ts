// useOmegaDepartment — reports + sentinel-aware score
import { useQuery } from "@tanstack/react-query";
import { omegaApi, type OrgDirector, type OrgSubAgent } from "@/lib/api/omega";
import { apiCall } from "@/lib/api/core";

export interface DeptReport {
  id: string;
  department: string;
  director: string;
  content: string;
  createdAt: string;
  format: "markdown";
  client_id?: string | null;
  client_name?: string | null;
}

interface SentinelScan {
  agent_code?: string;
  scan_type?: string;
  security_score?: number;
  created_at?: string;
  triggered_by?: string;
}

interface SentinelScoreResult {
  avgScore: number;
  count: number;
  agentScores: Record<string, number | null>;
}

const STORAGE_KEY = "omega_reports";

export function loadReports(): DeptReport[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as DeptReport[];
  } catch { return []; }
}

export function saveReport(report: DeptReport): void {
  const list = loadReports();
  if (!list.find((r) => r.id === report.id)) {
    list.unshift(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    omegaApi.saveNovaData("reports", list).catch(() => {});
  }
}

export function deleteReport(id: string): void {
  const list = loadReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const API_BASE = import.meta.env.VITE_API_URL || "https://omegaraisen-production-2031.up.railway.app/api/v1";

export async function generateReportFromBackend(
  director: OrgDirector,
  dept: string
): Promise<string> {
  try {
    const token = localStorage.getItem("omega_token");
    const res = await fetch(`${API_BASE}/omega/department-report/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ department: dept, requested_by: "Ibrain" }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data?.markdown) return data.markdown;
    throw new Error("No content");
  } catch {
    return generateMarkdownLocal(director, dept);
  }
}

const SENTINEL_AGENTS = ["VAULT", "PULSE_MONITOR", "DB_GUARDIAN"];

async function fetchSentinelScores(): Promise<SentinelScoreResult> {
  try {
    const res = await apiCall<{ scans?: SentinelScan[]; items?: SentinelScan[] }>(
      "/sentinel/history/?limit=10"
    );
    const scans = res?.scans ?? res?.items ?? [];
    const scores = scans
      .map((s) => s.security_score)
      .filter((s): s is number => s != null);
    const avg = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const agentScores: Record<string, number | null> = {};
    for (const agent of SENTINEL_AGENTS) {
      const match = scans.find((s) => {
        const key = (s.agent_code ?? s.scan_type ?? "").toUpperCase();
        return key.includes(agent) || key.includes(agent.replace("_", ""));
      });
      agentScores[agent] = match?.security_score ?? null;
    }
    return { avgScore: avg, count: scores.length, agentScores };
  } catch {
    return { avgScore: 0, count: 0, agentScores: {} };
  }
}

async function generateMarkdownLocal(director: OrgDirector, dept: string): Promise<string> {
  const now = new Date();
  const date = now.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const time = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  const activeCount = director.sub_agents.filter((a: OrgSubAgent) =>
    ["active", "online", "in_task"].includes(a.status)
  ).length;
  const healthPct = Math.round(
    (director.sub_agents.filter((a: OrgSubAgent) => ["active", "online"].includes(a.status)).length /
      Math.max(director.sub_agents.length, 1)) * 100
  );
  const isSecurity = dept.toLowerCase() === "security";
  const sentinelData = isSecurity ? await fetchSentinelScores() : null;

  const agentsTable = director.sub_agents.length > 0
    ? director.sub_agents
        .map((a: OrgSubAgent) => {
          const score = sentinelData
            ? (sentinelData.agentScores[a.code] ?? "—")
            : director.performance_score;
          return `| ${a.code} | ${a.name} | ${a.status} | ${score} |`;
        })
        .join("\n")
    : "| — | Sin sub-agentes registrados | — | — |";

  const scoreLabel = sentinelData
    ? sentinelData.count > 0
      ? `${sentinelData.avgScore}/100 (promedio de ${sentinelData.count} scans)`
      : "Sin datos de scan"
    : `${director.performance_score}/100`;

  return `# Reporte — ${director.code} (${dept.charAt(0).toUpperCase() + dept.slice(1)})

**Generado:** ${date} a las ${time}
**Solicitado por:** Ibrain

## Resumen

- **Director:** ${director.code} · ${director.name}
- **Departamento:** ${dept.charAt(0).toUpperCase() + dept.slice(1)}
- **Sub-agentes:** ${activeCount} activos / ${director.sub_agents.length} total
- **${isSecurity ? "Average Security Score" : "Performance promedio"}:** ${scoreLabel}

## Estado de Agentes

| Código | Nombre | Status | Score |
|--------|--------|--------|-------|
${agentsTable}

## Métricas Clave

- Tasa de salud: ${healthPct}%
- Tasks hoy: ${director.tasks_today}

## Notas

_Consultar feed de actividad en el panel OMEGA → Actividad._
`;
}

export function useOmegaDepartment(dept: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["omega-org-chart"],
    queryFn: () => omegaApi.getOrgChart(),
    staleTime: 120_000,
    retry: 0,
  });

  const director = data?.directors.find(
    (d) => d.department.toLowerCase() === dept.toLowerCase()
  ) ?? null;

  return { director, isLoading, refetch };
}
