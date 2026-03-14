import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb } from "lucide-react";
import { agentPrice } from "../utils/agentPricing";
import { useOmegaUpsell } from "../hooks/useOmegaUpsell";
import { AgentGrid } from "./AgentGrid";
import { DeptGrid } from "./DeptGrid";

// ─── Orchestrator — zero business logic ─────────────────

interface Props { resellerId: string }

export function OmegaUpsell({ resellerId }: Props) {
  const h = useOmegaUpsell(resellerId);

  if (h.isLoading) {
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
              <AgentGrid agents={h.allAgents} onContract={(a) => { h.setContractAgent(a); h.setMessage(""); }} />
            </TabsContent>
            <TabsContent value="departments">
              <DeptGrid departments={h.departments} onContract={(d) => { h.setContractDept(d); h.setMessage(""); }} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!h.contractAgent} onOpenChange={(v) => !v && h.setContractAgent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Agregar {h.contractAgent?.name} a tu agencia</DialogTitle>
            <DialogDescription>
              {h.contractAgent?.code} · {h.contractAgent?.department} ·{" "}
              <span className="text-amber-400 font-semibold">
                ${h.contractAgent ? agentPrice(h.contractAgent.code, h.contractAgent.role).toLocaleString() : 0}/mes
              </span>
            </DialogDescription>
          </DialogHeader>
          <Textarea value={h.message} onChange={(e) => h.setMessage(e.target.value)} placeholder="Mensaje adicional (opcional)" className="min-h-[80px]" />
          <DialogFooter>
            <Button variant="outline" onClick={() => h.setContractAgent(null)}>Cancelar</Button>
            <Button disabled={h.sending} onClick={() => { if (!h.contractAgent) return; h.submitUpsell({ request_type: "individual_agent", item_code: h.contractAgent.code, item_name: h.contractAgent.name, monthly_price: agentPrice(h.contractAgent.code, h.contractAgent.role), new_monthly_total: agentPrice(h.contractAgent.code, h.contractAgent.role), client_id: h.resellerId, client_message: h.message || undefined }); }}>
              {h.sending ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!h.contractDept} onOpenChange={(v) => !v && h.setContractDept(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display capitalize">Contratar departamento {h.contractDept?.dept}</DialogTitle>
            <DialogDescription>
              {h.contractDept?.agents.length} agentes ·{" "}
              <span className="text-amber-400 font-semibold">${h.contractDept?.total.toLocaleString()}/mes</span>
            </DialogDescription>
          </DialogHeader>
          <Textarea value={h.message} onChange={(e) => h.setMessage(e.target.value)} placeholder="Mensaje adicional (opcional)" className="min-h-[80px]" />
          <DialogFooter>
            <Button variant="outline" onClick={() => h.setContractDept(null)}>Cancelar</Button>
            <Button disabled={h.sending} onClick={() => { if (!h.contractDept) return; h.submitUpsell({ request_type: "full_department", item_code: h.contractDept.dept, item_name: `Departamento ${h.contractDept.dept}`, monthly_price: h.contractDept.total, new_monthly_total: h.contractDept.total, client_id: h.resellerId, client_message: h.message || undefined }); }}>
              {h.sending ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
