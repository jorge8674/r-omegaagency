import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { executeAgent } from "@/lib/api/agentsCrud";
import { listClients } from "@/lib/api/clients";
import { useQuery } from "@tanstack/react-query";
import type { Agent } from "../types";
import { STATUS_DOT, DEPARTMENT_LABELS } from "../types";
import { AgentPerformanceTab } from "./AgentPerformanceTab";
import { AgentLogsTab } from "./AgentLogsTab";

interface Props {
  agent: Agent | null;
  open: boolean;
  onClose: () => void;
}

export function AgentDetailModal({ agent, open, onClose }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [clientId, setClientId] = useState("");
  const [brief, setBrief] = useState("");

  const { data: clientsRaw } = useQuery({
    queryKey: ["clients-for-agent"],
    queryFn: () => listClients(),
    enabled: open,
    staleTime: 60_000,
  });
  const clients = ((clientsRaw as { data?: { id: string; name: string }[] })?.data ?? []);

  const exec = useMutation({
    mutationFn: () => executeAgent(agent!.id, clientId, brief),
    onSuccess: () => {
      toast({ title: "Agente ejecutado" });
      qc.invalidateQueries({ queryKey: ["agent-executions", agent!.id] });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {agent.name}
            <div className={`h-2 w-2 rounded-full ${STATUS_DOT[agent.status]}`} />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="actions">Acciones</TabsTrigger>
          </TabsList>

          {/* TAB 1 — Overview */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Departamento:</span>{" "}
                <Badge variant="secondary">{DEPARTMENT_LABELS[agent.department]}</Badge>
              </div>
              <div><span className="text-muted-foreground">Modelo:</span> {agent.model}</div>
              <div><span className="text-muted-foreground">API Key Env:</span> {agent.api_key_env}</div>
              <div><span className="text-muted-foreground">Última ejecución:</span>{" "}
                {agent.last_execution ? new Date(agent.last_execution).toLocaleString("es-PR") : "—"}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Descripción</h4>
              <p className="text-xs text-muted-foreground">{agent.description}</p>
            </div>
            {agent.responsibilities?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Responsabilidades</h4>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                  {agent.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </TabsContent>

          {/* TAB 2 — Performance */}
          <TabsContent value="performance" className="mt-4">
            <AgentPerformanceTab agent={agent} />
          </TabsContent>

          {/* TAB 3 — Logs */}
          <TabsContent value="logs" className="mt-4">
            <AgentLogsTab agentId={agent.id} />
          </TabsContent>

          {/* TAB 4 — Actions */}
          <TabsContent value="actions" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brief / Instrucción</label>
              <Textarea
                placeholder="Describe la tarea para el agente..."
                value={brief} onChange={(e) => setBrief(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              onClick={() => exec.mutate()}
              disabled={!clientId || !brief || exec.isPending}
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              {exec.isPending ? "Ejecutando..." : "Ejecutar Agente"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
