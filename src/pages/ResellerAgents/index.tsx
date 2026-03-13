import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Search, Send, ChevronDown, ChevronUp } from "lucide-react";
import { apiCall } from "@/lib/api/core";
import { useToast } from "@/hooks/use-toast";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { omegaApi, type OrgChart } from "@/lib/api/omega";

interface AgentItem {
  code: string;
  name: string;
  department: string;
  role?: string;
  status?: string;
}

export default function ResellerAgents() {
  const { user } = useOmegaAuth();
  const { toast } = useToast();
  const resellerId = user?.reseller_id ?? localStorage.getItem("omega_reseller_id") ?? user?.id ?? "";

  const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const { data: orgChart, isLoading } = useQuery<OrgChart>({
    queryKey: ["org-chart-reseller-agents"],
    queryFn: () => omegaApi.getOrgChart(),
    retry: 1,
    staleTime: 300_000,
  });

  // Group by department
  const deptMap = new Map<string, AgentItem[]>();
  if (orgChart) {
    const dirs = Array.isArray(orgChart.directors) ? orgChart.directors : [];
    for (const d of dirs) {
      if (!d || typeof d !== "object") continue;
      const list: AgentItem[] = [
        { code: d.code, name: d.name, department: d.department, role: "director", status: d.status },
      ];
      const subs = Array.isArray(d.sub_agents) ? d.sub_agents : [];
      for (const sa of subs) {
        if (!sa || typeof sa !== "object") continue;
        list.push({ code: sa.code, name: sa.name, department: d.department, role: "sub_agent", status: sa.status });
      }
      deptMap.set(d.department, list);
    }
  }

  const departments = Array.from(deptMap.entries());

  const handleSubmit = async () => {
    if (!selectedAgent || !msg.trim()) return;
    setSending(true);
    try {
      await apiCall("/upsell/solicitud/", "POST", {
        request_type: "agent_report",
        item_code: selectedAgent.code,
        item_name: `${selectedAgent.name} — Reporte`,
        monthly_price: 0,
        new_monthly_total: 0,
        client_id: resellerId,
        client_message: msg.trim(),
      });
      toast({
        title: "✅ Reporte solicitado",
        description: "Lo recibirás en menos de 24 horas.",
      });
      setSelectedAgent(null);
      setMsg("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          Solicitar Reporte de Agente
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Selecciona un agente o departamento para solicitar un análisis de tu cartera
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {departments.map(([dept, agents]) => {
            const isExpanded = expandedDept === dept;
            return (
              <Card key={dept} className="border-border/30 bg-card/60">
                <CardHeader
                  className="cursor-pointer flex flex-row items-center justify-between py-3"
                  onClick={() => setExpandedDept(isExpanded ? null : dept)}
                >
                  <CardTitle className="text-sm font-display capitalize flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    {dept}
                    <Badge variant="secondary" className="text-[10px] ml-1">
                      {agents.length} agentes
                    </Badge>
                  </CardTitle>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {agents.map((a) => (
                        <div
                          key={a.code}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border/30 bg-secondary/20 p-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{a.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {a.code} · {a.role === "director" ? "Director" : "Agente"}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAgent(a);
                              setMsg("");
                            }}
                          >
                            <Send className="h-3 w-3" /> Solicitar reporte
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Report request modal */}
      <Dialog open={!!selectedAgent} onOpenChange={(v) => !v && setSelectedAgent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              Solicitar reporte de {selectedAgent?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedAgent?.code} · {selectedAgent?.department}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="¿Sobre qué cliente o tema?"
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAgent(null)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!msg.trim() || sending}>
              {sending ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
