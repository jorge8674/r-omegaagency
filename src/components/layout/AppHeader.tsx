import { useState } from "react";
import { Bell, Moon, Sun, LogOut, User, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { checkBackendHealth, api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const WORKFLOWS = [
  { name: "full_content_pipeline", label: "Full Content Pipeline" },
  { name: "crisis_response", label: "Crisis Response" },
  { name: "weekly_client_report", label: "Weekly Client Report" },
  { name: "trend_to_content", label: "Trend to Content" },
  { name: "competitive_analysis", label: "Competitive Analysis" },
];

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [executingWorkflow, setExecutingWorkflow] = useState<string | null>(null);

  const { data: health } = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => checkBackendHealth(),
    refetchInterval: 30000,
    retry: 1,
  });

  const isOnline = health?.status === "healthy";

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

  const initials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user?.email?.[0]?.toUpperCase() || "U";

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
            <DropdownMenuItem
              key={wf.name}
              onClick={() => handleExecuteWorkflow(wf.name)}
              disabled={!!executingWorkflow}
            >
              {executingWorkflow === wf.name ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="mr-2 h-3.5 w-3.5" />
              )}
              {wf.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon" className="relative h-9 w-9">
        <Bell className="h-4 w-4" />
        <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full gradient-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
          3
        </span>
      </Button>

      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="gradient-primary text-xs font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <User className="mr-2 h-4 w-4" />
            Mi Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
