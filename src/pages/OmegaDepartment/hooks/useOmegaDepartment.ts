// 78 lines
import { useQuery } from "@tanstack/react-query";
import { omegaApi, type OrgDirector, type OrgSubAgent } from "@/lib/api/omega";

export interface DeptReport {
  id: string;
  department: string;
  director: string;
  content: string;
  createdAt: string;
  format: "markdown";
}

const STORAGE_KEY = "omega_reports";

export function loadReports(): DeptReport[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as DeptReport[];
  } catch { return []; }
}

export function saveReport(report: DeptReport): void {
  const list = loadReports();
  // Avoid duplicates
  if (!list.find((r) => r.id === report.id)) {
    list.unshift(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // Dual-persist (silent)
    omegaApi.saveNovaData("reports", list).catch(() => {});
  }
}

export function deleteReport(id: string): void {
  const list = loadReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}


export function generateMarkdown(director: OrgDirector, dept: string): string {
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
  const agentsTable = director.sub_agents.length > 0
    ? director.sub_agents
        .map((a: OrgSubAgent) => `| ${a.code} | ${a.name} | ${a.status} | ${director.performance_score} |`)
        .join("\n")
    : "| — | Sin sub-agentes registrados | — | — |";

  return `# Reporte — ${director.code} (${dept.charAt(0).toUpperCase() + dept.slice(1)})

**Generado:** ${date} a las ${time}
**Solicitado por:** Ibrain

## Resumen

- **Director:** ${director.code} · ${director.name}
- **Departamento:** ${dept.charAt(0).toUpperCase() + dept.slice(1)}
- **Sub-agentes:** ${activeCount} activos / ${director.sub_agents.length} total
- **Performance promedio:** ${director.performance_score}/100

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
