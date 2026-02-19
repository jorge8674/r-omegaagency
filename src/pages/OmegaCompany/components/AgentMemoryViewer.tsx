// 118 lines
import { useState, useEffect, useCallback } from "react";
import { Brain, Plus, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { omegaApi, type AgentMemory } from "@/lib/api/omega";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AGENTS = ["NOVA", "ATLAS", "LUNA", "REX", "VERA", "KIRA", "ORACLE", "SOPHIA"] as const;
type AgentCode = typeof AGENTS[number];

const AGENT_COLORS: Record<AgentCode, string> = {
  NOVA: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  ATLAS: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  LUNA: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  REX: "text-green-400 bg-green-500/10 border-green-500/30",
  VERA: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  KIRA: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  ORACLE: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  SOPHIA: "text-pink-400 bg-pink-500/10 border-pink-500/30",
};

export function AgentMemoryViewer() {
  const [selected, setSelected] = useState<AgentCode>("NOVA");
  const [memories, setMemories] = useState<AgentMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const load = useCallback(async (code: AgentCode) => {
    setLoading(true);
    try {
      const res = await omegaApi.getAgentMemory(code);
      setMemories(res.memories.slice(0, 10));
      setTotal(res.total);
    } catch {
      setMemories([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(selected); }, [selected, load]);

  const handleAddMemory = async () => {
    const content = window.prompt("Contenido de la memoria (JSON o texto):");
    if (!content) return;
    try {
      await omegaApi.saveAgentMemory(selected, "manual", { note: content });
      toast({ title: "Memoria guardada", description: `Nueva memoria añadida a ${selected}` });
      load(selected);
    } catch {
      toast({ title: "Error", description: "No se pudo guardar la memoria", variant: "destructive" });
    }
  };

  const colorCls = AGENT_COLORS[selected];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Memoria de Agentes
          </span>
          {total > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {total} total
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select value={selected} onValueChange={(v) => setSelected(v as AgentCode)}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGENTS.map((a) => (
                <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => load(selected)}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={handleAddMemory}>
            <Plus className="h-3 w-3" />
            Añadir
          </Button>
        </div>
      </div>

      {/* Memory Timeline */}
      {loading ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : memories.length === 0 ? (
        <p className="text-xs text-muted-foreground py-6 text-center">Sin memorias para {selected}</p>
      ) : (
        <div className="space-y-2">
          {memories.map((m) => (
            <div key={m.id} className={`rounded-lg border px-3 py-2.5 ${colorCls}`}>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 border-current`}>
                  {m.memory_type}
                </Badge>
                <span className="ml-auto flex items-center gap-1 text-[9px] opacity-60">
                  <Clock className="h-2.5 w-2.5" />
                  {format(new Date(m.updated_at), "dd MMM, HH:mm", { locale: es })}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed line-clamp-2 text-foreground">
                {typeof m.content === "object" ? JSON.stringify(m.content).slice(0, 120) : String(m.content)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
