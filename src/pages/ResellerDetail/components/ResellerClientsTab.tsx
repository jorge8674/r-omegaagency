import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import type { ResellerClient } from "../hooks/useResellerDetail";

interface Props { clients: ResellerClient[]; loading: boolean }

const PLAN_STYLE: Record<string, { label: string; cls: string }> = {
  enterprise: { label: "Enterprise", cls: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
  pro: { label: "Pro", cls: "border-blue-500/50 text-blue-400 bg-blue-500/10" },
  basic: { label: "Basic", cls: "border-border text-muted-foreground bg-muted/30" },
};

export function ResellerClientsTab({ clients, loading }: Props) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>;
  }

  const list = Array.isArray(clients) ? clients : [];

  if (list.length === 0) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <Users className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Sin clientes asignados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {list.map((c) => {
        const ps = PLAN_STYLE[(c.plan ?? "basic").toLowerCase()] ?? PLAN_STYLE.basic;
        const initial = c.name.charAt(0).toUpperCase();
        return (
          <div
            key={c.id}
            onClick={() => navigate(`/clients/${c.id}`)}
            className="flex items-center gap-4 rounded-xl border border-border/30 bg-card/50 px-4 py-3 hover:border-amber-500/20 hover:bg-card/80 transition-colors cursor-pointer"
          >
            <div className="h-9 w-9 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-yellow-400">{initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate">{c.name}</span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${ps.cls}`}>{ps.label}</Badge>
                <div className={`h-2 w-2 rounded-full ${c.active ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
              </div>
              {c.email && <p className="text-xs text-muted-foreground truncate mt-0.5">{c.email}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
