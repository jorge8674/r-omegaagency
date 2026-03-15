import { useState } from "react";
import { Bot, ChevronDown, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export function OmegaAgentsSection() {
  const navigate = useNavigate();
  const { grouped, stats, isLoading } = useAgents();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  const depts = Object.keys(grouped);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
        <Bot className="h-4 w-4 text-primary" />
        <span>
          <span className="font-semibold text-foreground">{stats.active + stats.running}</span>
          /{stats.total} activos
        </span>
        <span
          className="ml-auto cursor-pointer text-xs hover:underline underline-offset-2"
          onClick={() => navigate("/agents")}
        >
          Ver panel completo →
        </span>
      </div>

      {depts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Bot className="mb-2 h-8 w-8 opacity-30" />
          <p className="text-sm">Sin agentes disponibles</p>
        </div>
      ) : (
        <div className="space-y-2">
          {depts.map((dept) => (
            <DeptAccordion key={dept} dept={dept} agents={grouped[dept]} />
          ))}
        </div>
      )}
    </div>
  );
}
