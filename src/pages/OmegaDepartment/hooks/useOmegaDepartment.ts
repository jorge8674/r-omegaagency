// 65 lines
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
  list.unshift(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function deleteReport(id: string): void {
  const list = loadReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function generateMarkdown(director: OrgDirector, dept: string): string {
  const date = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const agentsTable = director.sub_agents
    .map((a: OrgSubAgent) => `| ${a.name} | ${a.code} | ${a.status} | — | — |`)
    .join("\n");

  return `# Reporte — ${director.name} — ${date}

## Resumen del Departamento

- **Departamento:** ${dept.charAt(0).toUpperCase() + dept.slice(1)}
- **Director:** ${director.code} · ${director.name}
- **Tasks hoy:** ${director.tasks_today}
- **Performance:** ${director.performance_score}/100

## Estado de Agentes

| Agente | Código | Status | Tasks | Score |
|--------|--------|--------|-------|-------|
${agentsTable}

## Actividad Reciente

_Consultar feed de actividad en el panel OMEGA._

## Métricas Clave

- Agentes activos: ${director.sub_agents.filter((a) => ["active","online","in_task"].includes(a.status)).length}/${director.sub_agents.length}
- Tasa de salud: ${Math.round((director.sub_agents.filter((a) => ["active","online"].includes(a.status)).length / Math.max(director.sub_agents.length, 1)) * 100)}%
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
