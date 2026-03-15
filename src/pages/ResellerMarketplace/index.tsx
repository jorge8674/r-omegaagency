import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Store } from "lucide-react";
import { useMarketplace } from "./hooks/useMarketplace";
import { AgentMarketCard } from "./components/AgentMarketCard";
import { SolicitarModal } from "./components/SolicitarModal";

export default function ResellerMarketplace() {
  const h = useMarketplace();
  const [deptFilter, setDeptFilter] = useState("all");

  const filtered = deptFilter === "all"
    ? h.agents
    : h.agents.filter((a) => a.department === deptFilter);

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-xl font-display flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Marketplace de Agentes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Activa agentes y departamentos para potenciar tu agencia
        </p>
      </div>

      {h.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <Tabs value={deptFilter} onValueChange={setDeptFilter}>
          <TabsList className="bg-secondary/30 border border-border/30 h-8 mb-4 flex-wrap">
            <TabsTrigger value="all" className="text-xs h-7">Todos</TabsTrigger>
            {h.departments.map((d) => (
              <TabsTrigger key={d} value={d} className="text-xs h-7 capitalize">
                {d}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={deptFilter} forceMount>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((a) => (
                <AgentMarketCard
                  key={a.code}
                  agent={a}
                  onSolicitar={h.setSelected}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <SolicitarModal
        agent={h.selected}
        onClose={() => h.setSelected(null)}
        onSubmit={h.submitSolicitud}
        sending={h.sending}
      />
    </div>
  );
}
