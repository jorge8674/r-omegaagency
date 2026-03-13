import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Lightbulb, Plus, Users } from "lucide-react";
import { apiCall } from "@/lib/api/core";
import { useToast } from "@/hooks/use-toast";
import { omegaApi, type OrgChart } from "@/lib/api/omega";

// ─── Pricing map ────────────────────────────────────────
const DIRECTOR_CODES = ["ATLAS", "LUNA", "REX", "VERA", "KIRA", "ORACLE", "SOPHIA"];
const SENTINEL_CODE = "SENTINEL";

function agentPrice(code: string, role?: string): number {
  if (code === SENTINEL_CODE) return 1320;
  if (DIRECTOR_CODES.includes(code) || role === "director") return 1080;
  return 840;
}

interface AgentCardData {
  code: string;
  name: string;
  department: string;
  role?: string;
}

// ─── Component ──────────────────────────────────────────
interface Props {
  resellerId: string;
}

export function OmegaUpsell({ resellerId }: Props) {
  const { toast } = useToast();
  const [contractAgent, setContractAgent] = useState<AgentCardData | null>(null);
  const [contractDept, setContractDept] = useState<{ dept: string; agents: AgentCardData[]; total: number } | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { data: orgChart, isLoading } = useQuery<OrgChart>({
    queryKey: ["org-chart-upsell"],
    queryFn: async () => {
      const res = await apiCall<{ data: any }>("/omega/org-chart/", "GET");
      return res.data ?? res;
    },
    retry: 1,
    staleTime: 300_000,
  });

  // Flatten agents — defensive: API may return unexpected shapes
  const allAgents: AgentCardData[] = [];
  const deptMap = new Map<string, AgentCardData[]>();

  if (orgChart) {
    const dirs = Array.isArray(orgChart.directors) ? orgChart.directors : [];
    for (const d of dirs) {
      if (!d || typeof d !== "object") continue;
      const entry: AgentCardData = { code: d.code, name: d.name, department: d.department, role: "director" };
      allAgents.push(entry);
      const list = deptMap.get(d.department) ?? [];
      list.push(entry);
      const subs = Array.isArray(d.sub_agents) ? d.sub_agents : [];
      for (const sa of subs) {
        if (!sa || typeof sa !== "object") continue;
        const sub: AgentCardData = { code: sa.code, name: sa.name, department: d.department, role: "sub_agent" };
        allAgents.push(sub);
        list.push(sub);
      }
      deptMap.set(d.department, list);
    }
  }

  const departments = Array.from(deptMap.entries()).map(([dept, agents]) => ({
    dept,
    agents,
    total: agents.reduce((s, a) => s + agentPrice(a.code, a.role), 0),
  }));

  const submitUpsell = async (payload: Record<string, unknown>) => {
    setSending(true);
    try {
      await apiCall("/upsell/solicitud/", "POST", payload);
      toast({
        title: "✅ Solicitud enviada",
        description: `${(payload.item_name as string)} estará activo en menos de 24 horas.`,
        className: "border-amber-500/30 bg-amber-950/80 text-amber-100",
      });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
      setContractAgent(null);
      setContractDept(null);
      setMessage("");
    }
  };

  const handleAgentContract = () => {
    if (!contractAgent) return;
    submitUpsell({
      request_type: "individual_agent",
      item_code: contractAgent.code,
      item_name: contractAgent.name,
      monthly_price: agentPrice(contractAgent.code, contractAgent.role),
      new_monthly_total: agentPrice(contractAgent.code, contractAgent.role),
      client_id: resellerId,
      client_message: message || undefined,
    });
  };

  const handleDeptContract = () => {
    if (!contractDept) return;
    submitUpsell({
      request_type: "full_department",
      item_code: contractDept.dept,
      item_name: `Departamento ${contractDept.dept}`,
      monthly_price: contractDept.total,
      new_monthly_total: contractDept.total,
      client_id: resellerId,
      client_message: message || undefined,
    });
  };

  if (isLoading) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="pt-6">
          <Skeleton className="h-40 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/30 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            Expande tu Agencia
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Agrega agentes o departamentos para potenciar los resultados de tus clientes
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="agents">
            <TabsList className="bg-secondary/30 border border-border/30 h-8 mb-4">
              <TabsTrigger value="agents" className="text-xs h-7">Por Agente</TabsTrigger>
              <TabsTrigger value="departments" className="text-xs h-7">Por Departamento</TabsTrigger>
            </TabsList>

            <TabsContent value="agents">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allAgents.map((a) => (
                  <div
                    key={a.code}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border/30 bg-secondary/20 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{a.name}</p>
                      <p className="text-[10px] text-muted-foreground">{a.code} · {a.department}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-300">
                        ${agentPrice(a.code, a.role).toLocaleString()}/mes
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1"
                        onClick={() => { setContractAgent(a); setMessage(""); }}
                      >
                        <Plus className="h-3 w-3" /> Agregar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="departments">
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
                        <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-300">
                          ${d.total.toLocaleString()}/mes
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={() => { setContractDept(d); setMessage(""); }}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Agent contract modal */}
      <Dialog open={!!contractAgent} onOpenChange={(v) => !v && setContractAgent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              Agregar {contractAgent?.name} a tu agencia
            </DialogTitle>
            <DialogDescription>
              {contractAgent?.code} · {contractAgent?.department} ·{" "}
              <span className="text-amber-400 font-semibold">
                ${contractAgent ? agentPrice(contractAgent.code, contractAgent.role).toLocaleString() : 0}/mes
              </span>
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mensaje adicional (opcional)"
            className="min-h-[80px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setContractAgent(null)}>Cancelar</Button>
            <Button onClick={handleAgentContract} disabled={sending}>
              {sending ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Department contract modal */}
      <Dialog open={!!contractDept} onOpenChange={(v) => !v && setContractDept(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display capitalize">
              Contratar departamento {contractDept?.dept}
            </DialogTitle>
            <DialogDescription>
              {contractDept?.agents.length} agentes ·{" "}
              <span className="text-amber-400 font-semibold">
                ${contractDept?.total.toLocaleString()}/mes
              </span>
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mensaje adicional (opcional)"
            className="min-h-[80px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setContractDept(null)}>Cancelar</Button>
            <Button onClick={handleDeptContract} disabled={sending}>
              {sending ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
