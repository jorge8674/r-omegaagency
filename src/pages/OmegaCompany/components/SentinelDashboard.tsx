// 160 lines
import { Shield, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSentinel, type SentinelAgent, type SentinelIssue, type AgentStatus } from "../hooks/useSentinel";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasValidData(lastScan: string | null | undefined): boolean {
  if (!lastScan) return false;
  return new Date(lastScan) > new Date("2024-01-01");
}

function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "PRESIDENCIAL", color: "text-green-500" };
  if (score >= 70) return { label: "ATENCIÓN",     color: "text-yellow-500" };
  return               { label: "CRÍTICO",         color: "text-destructive" };
}

function agentDotColor(status: AgentStatus): string {
  if (status === "pass")    return "bg-green-500";
  if (status === "warning") return "bg-yellow-500";
  return "bg-destructive";
}

function issueBadgeVariant(severity: SentinelIssue["severity"]) {
  if (severity === "CRITICAL") return "destructive" as const;
  return "secondary" as const;
}

function relativeTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: es });
  } catch {
    return "—";
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: SentinelAgent }) {
  return (
    <Card className="bg-card/60 border-border/40">
      <CardContent className="p-3 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full shrink-0 ${agentDotColor(agent.status)}`} />
            <span className="text-sm font-semibold tracking-tight">{agent.name}</span>
          </div>
          {agent.issues_count > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {agent.issues_count} issues
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground pl-4">{relativeTime(agent.last_scan)}</p>
      </CardContent>
    </Card>
  );
}

function DeployBadge({ score }: { score: number }) {
  if (score >= 85) return (
    <div className="flex items-center gap-2 text-green-500 font-bold text-base">
      <CheckCircle2 className="h-5 w-5" /> DEPLOY APROBADO
    </div>
  );
  if (score >= 70) return (
    <div className="flex items-center gap-2 text-yellow-500 font-bold text-base">
      <AlertTriangle className="h-5 w-5" /> REVISAR ANTES
    </div>
  );
  return (
    <div className="flex items-center gap-2 text-destructive font-bold text-base">
      <XCircle className="h-5 w-5" /> DEPLOY BLOQUEADO
    </div>
  );
}

function EmptyState({ onScan, isScanning }: { onScan: () => void; isScanning: boolean }) {
  return (
    <Card className="border-border/40 bg-card/70">
      <CardContent className="p-10 flex flex-col items-center gap-4 text-center">
        <Shield className="h-12 w-12 text-muted-foreground/40" />
        <div className="space-y-1">
          <div className="text-5xl font-black text-muted-foreground/40">—</div>
          <Badge variant="secondary" className="text-xs">SIN DATOS</Badge>
        </div>
        <p className="text-sm text-muted-foreground">No hay scans registrados aún</p>
        <Button
          onClick={onScan}
          disabled={isScanning}
          className="gap-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
          {isScanning ? "Escaneando sistema..." : "🔍 Ejecutar Primer Scan"}
        </Button>
        <Card className="w-full border-border/30 bg-muted/20">
          <CardContent className="p-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Decisión de Deploy</span>
            <span className="text-sm font-bold text-muted-foreground">ESCANEAR PRIMERO</span>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SentinelDashboard() {
  const { status, isLoading, isError, triggerScan, isScanning } = useSentinel();

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-56 w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
      </div>
    </div>
  );

  if (isError || !status) {
    return <EmptyState onScan={() => triggerScan()} isScanning={isScanning} />;
  }

  if (!hasValidData(status.last_scan)) {
    return <EmptyState onScan={() => triggerScan()} isScanning={isScanning} />;
  }

  const { label, color } = scoreLabel(status.security_score);
  const agents = Array.isArray(status.agents) ? status.agents : [];
  const issues = Array.isArray(status.issues) ? status.issues : [];

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/70">
        <CardContent className="p-6 flex flex-col items-center gap-3">
          <Shield className={`h-8 w-8 ${color}`} />
          <div className={`text-6xl font-black ${color}`}>{status.security_score}</div>
          <Badge className={
            status.security_score >= 85 ? "bg-green-500/20 text-green-400 border-green-500/30" :
            status.security_score >= 70 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
            "bg-destructive/20 text-destructive border-destructive/30"
          }>{label}</Badge>
          <p className="text-xs text-muted-foreground">Último scan: {relativeTime(status.last_scan)}</p>
          <Button size="sm" variant="outline" onClick={() => triggerScan()} disabled={isScanning} className="gap-2">
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Escaneando..." : "Escanear Ahora"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agentes de Seguridad</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((agent) => <AgentCard key={agent.name} agent={agent} />)}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Issues Activos</h2>
        {issues.length === 0 ? (
          <div className="flex items-center gap-2 text-green-500 text-sm p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Sistema seguro. 0 issues activos.
          </div>
        ) : (
          <div className="space-y-2">
            {issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-card/50">
                <Badge variant={issueBadgeVariant(issue.severity)} className="text-[10px] shrink-0">{issue.severity}</Badge>
                <span className="text-sm"><span className="font-mono font-semibold">{issue.code}</span>: {issue.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Card className="border-border/40 bg-card/70">
        <CardContent className="p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Decisión de Deploy</span>
          <DeployBadge score={status.security_score} />
        </CardContent>
      </Card>
    </div>
  );
}
