import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { ChevronDown, AlertTriangle, Calendar, Sparkles, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ResellerClient } from "../types";

const HEALTH_DOT: Record<string, string> = {
  green: "bg-emerald-500",
  yellow: "bg-yellow-400",
  red: "bg-destructive",
};

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  basico_97: { label: "Básico", cls: "border-border text-muted-foreground bg-muted/30" },
  pro_197: { label: "Pro", cls: "border-blue-500/50 text-blue-400 bg-blue-500/10" },
  enterprise_497: { label: "Company", cls: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
};

interface Props {
  client: ResellerClient;
  expanded: boolean;
  onToggle: () => void;
}

export function ClientExpandedRow({ client: c, expanded, onToggle }: Props) {
  const navigate = useNavigate();
  const dot = HEALTH_DOT[c.health] ?? HEALTH_DOT.green;
  const pb = PLAN_BADGE[(c.plan ?? "").toLowerCase()] ?? PLAN_BADGE.basico_97;
  const alertCount = c.alerts.length;

  return (
    <div className="rounded-xl border border-border/30 bg-card/50 overflow-hidden">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-card/80 transition-colors text-left"
      >
        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${dot}`} />
        <span className="text-sm font-semibold truncate flex-1">{c.name}</span>
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${pb.cls}`}>{pb.label}</Badge>
        <div className="flex items-center gap-1 shrink-0">
          {c.social_accounts.map((sa) => (
            <PlatformIcon key={sa.id} platform={sa.platform} className={`h-4 w-4 ${sa.connected ? "" : "opacity-30"}`} />
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground hidden sm:inline whitespace-nowrap">
          {c.stats.posts_this_month} posts · {c.stats.connected_accounts}/{c.stats.total_accounts} redes · ${c.stats.revenue_monthly}/mes
        </span>
        {alertCount > 0 && (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 shrink-0">{alertCount}</Badge>
        )}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-border/20 px-4 py-4 space-y-4 bg-secondary/10">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Plan: <strong className="text-foreground">{pb.label}</strong></span>
            <span>Revenue: <strong className="text-foreground">${c.stats.revenue_monthly}/mes</strong></span>
            <span>Status: <strong className="text-foreground">{c.status}</strong></span>
          </div>

          {/* Upcoming posts */}
          {c.upcoming_posts.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Contenido programado</p>
              {c.upcoming_posts.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-xs rounded-lg bg-background/50 px-3 py-2">
                  <PlatformIcon platform={p.platform} className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate flex-1">{p.text_content}</span>
                  <span className="text-muted-foreground whitespace-nowrap">{p.scheduled_date} {p.scheduled_time}</span>
                  {!p.has_connected_account && (
                    <Badge variant="destructive" className="text-[9px] px-1 py-0">Red no conectada</Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Alerts */}
          {c.alerts.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Alertas</p>
              {c.alerts.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{a.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate("/content-lab")}>
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Generar contenido
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/calendar")}>
              <Calendar className="h-3.5 w-3.5 mr-1" /> Calendario
            </Button>
            <Button size="sm" variant="outline">
              <MessageCircle className="h-3.5 w-3.5 mr-1" /> NOVA
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
