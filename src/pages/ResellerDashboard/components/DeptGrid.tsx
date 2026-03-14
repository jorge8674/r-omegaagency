import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";
import type { DeptData } from "../utils/agentPricing";

// ─── Pure presentational grid of departments ────────────
// R-DDD-001: Zero fetch, zero state, zero business logic

interface Props {
  departments: DeptData[];
  onContract: (dept: DeptData) => void;
}

export function DeptGrid({ departments, onContract }: Props) {
  return (
    <div className="space-y-3">
      {departments.map((d) => (
        <div
          key={d.dept}
          className="rounded-xl border border-border/30 bg-secondary/20 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold capitalize">{d.dept}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> {d.agents.length} agentes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] border-amber-500/30 text-amber-300"
              >
                ${d.total.toLocaleString()}/mes
              </Badge>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => onContract(d)}
              >
                <Plus className="h-3 w-3" /> Contratar departamento
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {d.agents.map((a) => (
              <Badge key={a.code} variant="secondary" className="text-[10px]">
                {a.code}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
