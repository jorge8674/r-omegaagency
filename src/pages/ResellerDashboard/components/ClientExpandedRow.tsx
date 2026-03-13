import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import {
  ChevronDown, AlertTriangle, Calendar, Sparkles, MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ResellerClient } from "../types";

const HEALTH_DOT: Record<string, string> = {
  green: "bg-[hsl(var(--success))]",
  yellow: "bg-[hsl(var(--warning))]",
  red: "bg-destructive",
};

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  basic: { label: "Básico", cls: "border-border text-muted-foreground bg-muted/30" },
  basico_97: { label: "Básico", cls: "border-border text-muted-foreground bg-muted/30" },
  pro: { label: "Pro", cls: "border-[hsl(200_80%_50%/0.5)] text-[hsl(200_80%_60%)] bg-[hsl(200_80%_50%/0.1)]" },
  pro_197: { label: "Pro", cls: "border-[hsl(200_80%_50%/0.5)] text-[hsl(200_80%_60%)] bg-[hsl(200_80%_50%/0.1)]" },
  enterprise: { label: "Company", cls: "border-primary/50 text-primary bg-primary/10" },
  enterprise_497: { label: "Company", cls: "border-primary/50 text-primary bg-primary/10" },
  company: { label: "Company", cls: "border-primary/50 text-primary bg-primary/10" },
};

const fmtRev = (n: number) =>
  `$${(n ?? 0).toLocaleString("en-US")}`;

interface Props {
  client: ResellerClient;
  expanded: boolean;
  onToggle: () => void;
}

export function ClientExpandedRow({ client: c, expanded, onToggle }: Props) {
  const navigate = useNavigate();
  const dot = HEALTH_DOT[c.health] ?? HEALTH_DOT.green;
  const planKey = (c.plan ?? "").toLowerCase();
  const pb = PLAN_BADGE[planKey] ?? PLAN_BADGE.basic;
  const alerts = c.alerts ?? [];
  const socialAccounts = c.social_accounts ?? [];
  const upcomingPosts = c.upcoming_posts ?? [];
  const stats = c.stats ?? {
    posts_this_month: 0, connected_accounts: 0,
    total_accounts: 0, revenue_monthly: 0,
  };

  return (
    <div className="rounded-xl border border-border/30 bg-card/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-card/80 transition-colors text-left"
      >
        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${dot}`} />
        <span className="text-sm font-semibold truncate flex-1">{c.name}</span>
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${pb.cls}`}>
          {pb.label}
        </Badge>
        <div className="flex items-center gap-1 shrink-0">
          {socialAccounts.map((sa) => (
            <PlatformIcon
              key={sa.id}
              platform={sa.platform}
              className={`h-4 w-4 ${sa.connected ? "" : "opacity-30"}`}
            />
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground hidden sm:inline whitespace-nowrap">
          {stats.posts_this_month} posts · {stats.connected_accounts}/{stats.total_accounts} redes · {fmtRev(stats.revenue_monthly)}/mes
        </span>
        {alerts.length > 0 && (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 shrink-0">
            {alerts.length}
          </Badge>
        )}
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border/20 px-4 py-4 space-y-4 bg-secondary/10">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Plan: <strong className="text-foreground">{pb.label}</strong></span>
            <span>Revenue: <strong className="text-foreground">{fmtRev(stats.revenue_monthly)}/mes</strong></span>
            <span>Status: <strong className="text-foreground">{c.status}</strong></span>
          </div>

          {upcomingPosts.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Contenido programado</p>
              {upcomingPosts.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-xs rounded-lg bg-background/50 px-3 py-2">
                  <PlatformIcon platform={p.platform} className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate flex-1">{p.text_content}</span>
                  <span className="text-muted-foreground whitespace-nowrap">
                    {p.scheduled_date} {p.scheduled_time}
                  </span>
                  {!p.has_connected_account && (
                    <Badge variant="destructive" className="text-[9px] px-1 py-0">
                      Red no conectada
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {alerts.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Alertas</p>
              {alerts.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.1)] rounded-lg px-3 py-2"
                >
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{a.message}</span>
                </div>
              ))}
            </div>
          )}

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
