import { useState } from "react";
import { Bell, Moon, Sun, Play, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { checkBackendHealth, api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const WORKFLOWS = [
  { name: "full_content_pipeline", label: "Full Content Pipeline" },
  { name: "crisis_response", label: "Crisis Response" },
  { name: "weekly_client_report", label: "Weekly Client Report" },
  { name: "trend_to_content", label: "Trend to Content" },
  { name: "competitive_analysis", label: "Competitive Analysis" },
];

const roleBadge: Record<string, { label: string; className: string }> = {
  owner: { label: "Super Admin", className: "bg-primary/10 text-primary border-primary/30" },
  reseller: { label: "Agencia", className: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  agent: { label: "Agente", className: "bg-green-500/10 text-green-400 border-green-500/30" },
  client: { label: "Cliente", className: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
};

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useOmegaAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [executingWorkflow, setExecutingWorkflow] = useState<string | null>(null);

  const { data: health } = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => checkBackendHealth(),
    refetchInterval: 30000,
    retry: 1,
  });

  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => api.alerts(),
    refetchInterval: 30000,
    retry: 1,
  });

  const isOnline = health?.status === "healthy";
  const alertsList = alerts?.data?.alerts ?? (Array.isArray(alerts) ? alerts : []);
  const alertCount = alertsList.length || alerts?.data?.active_count || 0;

  const handleExecuteWorkflow = async (workflowName: string) => {
    setExecutingWorkflow(workflowName);
    try {
      await api.executeWorkflow(workflowName, "default", {});
      toast({ title: "✅ Workflow iniciado", description: `${workflowName} ejecutándose...` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setExecutingWorkflow(null);
    }
  };

  const badge = roleBadge[user?.role || ""] || roleBadge.client;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4">
      <SidebarTrigger />

      {/* Backend Status */}
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Backend: {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Role badge */}
      {user && (
        <Badge variant="outline" className={`text-[10px] ${badge.className}`}>
          {badge.label}
        </Badge>
      )}

      <div className="flex-1" />

      {/* Workflow Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Play className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Workflows</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {WORKFLOWS.map((wf) => (
            <DropdownMenuItem key={wf.name} onClick={() => handleExecuteWorkflow(wf.name)} disabled={!!executingWorkflow}>
              {executingWorkflow === wf.name ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
              {wf.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full gradient-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold">Notificaciones</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {alertsList.length > 0 ? (
              alertsList.map((alert: any, i: number) => (
                <div key={i} className="px-4 py-3 border-b border-border/50 last:border-0 hover:bg-secondary/50 transition-colors">
                  <p className="text-sm font-medium">{alert.title || alert.message || JSON.stringify(alert)}</p>
                  {alert.description && <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <p className="text-sm">Sin alertas activas</p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>



    </header>
  );
}
