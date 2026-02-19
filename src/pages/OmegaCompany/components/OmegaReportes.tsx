import { CheckCircle2, GitCommit, Wrench, Plus, RefreshCw } from "lucide-react";

interface Change {
  label: string;
  items: string[];
  type: "fix" | "new" | "refactor" | "update";
}

interface Report {
  session: string;
  date: string;
  changes: Change[];
}

const TYPE_ICON: Record<Change["type"], React.ElementType> = {
  fix:      Wrench,
  new:      Plus,
  refactor: RefreshCw,
  update:   GitCommit,
};

const TYPE_COLOR: Record<Change["type"], string> = {
  fix:      "text-amber-400 bg-amber-400/10 border-amber-400/20",
  new:      "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  refactor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  update:   "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const TYPE_LABEL: Record<Change["type"], string> = {
  fix: "Fix", new: "Nuevo", refactor: "Refactor", update: "Update",
};

const REPORTS: Report[] = [
  {
    session: "Sesión actual — Chip Nav OMEGA Company",
    date: "Hoy",
    changes: [
      {
        label: "Barra de chips en OMEGA Company",
        type: "new",
        items: [
          "OmegaCompany/index.tsx: chips Resumen · Resellers · Agentes · Organización · Actividad",
          "Navegación entre secciones sin scroll (tab-based)",
          "Ícono Cpu en el header + Lucide icons por sección",
        ],
      },
      {
        label: "OmegaAgentsSection revertida",
        type: "refactor",
        items: [
          "Eliminados chips de búsqueda/filtro que se añadieron por error",
          "Vuelve al acordeón compacto por departamento",
        ],
      },
    ],
  },
  {
    session: "OMEGA Organization — Org Chart visual",
    date: "Hace 2 sesiones",
    changes: [
      {
        label: "OmegaOrgChart.tsx (nuevo, 178L)",
        type: "new",
        items: [
          "NOVA CEO: card dorada centrada con badge CEO y dot Online 24/7",
          "7 Directores en grid (ATLAS, LUNA, REX, VERA, KIRA, ORACLE, SOPHIA)",
          "Colores por departamento: marketing→naranja, tech→azul, ops→verde, etc.",
          "Acordeón por director → lista de sub-agentes con dot de estado",
          "Tooltip con descripción en sub-agentes",
          "Botón Actualizar + timestamp relativo (date-fns/es)",
        ],
      },
      {
        label: "src/lib/api/omega.ts",
        type: "update",
        items: [
          "getOrgChart(): GET /omega/org-chart/",
          "Interfaces OrgChart, OrgDirector, OrgSubAgent, OrgAgentStatus",
        ],
      },
    ],
  },
  {
    session: "4 Fixes — OMEGA Company Dashboard",
    date: "Hace 3 sesiones",
    changes: [
      {
        label: "FIX 1 — $NaN en MRR/ARR",
        type: "fix",
        items: [
          "RevenueCards.tsx: Number(n ?? 0) en todos los campos numéricos",
          "Muestra $0 en lugar de $NaN cuando backend retorna undefined",
        ],
      },
      {
        label: "FIX 2 — OmegaAgentsSection (nuevo, 130L)",
        type: "new",
        items: [
          "Reutiliza useAgents hook — sin queries duplicadas",
          "Acordeones por departamento con dot de salud (verde/amarillo/rojo)",
          "Link 'Ver panel completo →' navega a /agents",
        ],
      },
      {
        label: "FIX 3 — Activity Feed badges semánticos",
        type: "fix",
        items: [
          "content_generated → naranja 'Contenido'",
          "agent_execution → azul 'Agente'",
          "post_scheduled → verde 'Programado'",
          "video_generated → morado 'Video'",
        ],
      },
      {
        label: "FIX 4 — Null safety en cards",
        type: "fix",
        items: [
          "data?.clients?.total ?? 0, data?.resellers?.trial ?? 0",
          "Optional chaining en todos los campos de RevenueCards",
        ],
      },
    ],
  },
  {
    session: "Sidebar — eliminar indicador duplicado",
    date: "Hace 4 sesiones",
    changes: [
      {
        label: "AppSidebar.tsx",
        type: "fix",
        items: [
          "Eliminado footer 'Sistema activo / Sin conexión' del sidebar",
          "El indicador ya existe en el AppHeader — se eliminó la duplicación",
        ],
      },
    ],
  },
];

function ChangeBlock({ change }: { change: Change }) {
  const Icon = TYPE_ICON[change.type];
  const color = TYPE_COLOR[change.type];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${color}`}>
          <Icon className="h-2.5 w-2.5" />
          {TYPE_LABEL[change.type]}
        </span>
        <span className="text-xs font-medium text-foreground">{change.label}</span>
      </div>
      <ul className="ml-4 space-y-0.5">
        {change.items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <CheckCircle2 className="h-2.5 w-2.5 mt-0.5 shrink-0 text-muted-foreground/50" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OmegaReportes() {
  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        Historial de cambios realizados en las últimas 4 sesiones de desarrollo.
      </p>

      {REPORTS.map((report, ri) => (
        <div key={ri} className="rounded-xl border border-border/40 bg-muted/5 overflow-hidden">
          {/* Session header */}
          <div className="flex items-center gap-3 border-b border-border/30 bg-muted/10 px-4 py-2.5">
            <GitCommit className="h-4 w-4 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">{report.session}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{report.date}</span>
          </div>

          {/* Changes */}
          <div className="divide-y divide-border/20">
            {report.changes.map((change, ci) => (
              <div key={ci} className="px-4 py-3">
                <ChangeBlock change={change} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
