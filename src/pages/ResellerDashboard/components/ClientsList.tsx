import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search } from "lucide-react";
import { ClientExpandedRow } from "./ClientExpandedRow";
import type { ResellerClient } from "../types";

interface Props {
  clients: ResellerClient[];
  activeCount: number;
  loading: boolean;
  onAddClient: () => void;
}

type FilterKey = "all" | "alerts" | "basico" | "pro";

export function ClientsList({ clients, activeCount, loading, onAddClient }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = clients ?? [];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => (c.name ?? "").toLowerCase().includes(q) || (c.email ?? "").toLowerCase().includes(q));
    }
    if (filter === "alerts") list = list.filter((c) => (c.alerts ?? []).length > 0);
    if (filter === "basico") list = list.filter((c) => (c.plan ?? "").toLowerCase().includes("basico"));
    if (filter === "pro") list = list.filter((c) => (c.plan ?? "").toLowerCase().includes("pro"));
    return list;
  }, [clients, search, filter]);

  if (loading) {
    return (
      <Card className="border-border/30 bg-card/60">
        <CardContent className="pt-6 space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 bg-card/60">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Mis Clientes ({activeCount} activos)
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 w-40 text-sm"
            />
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground" onClick={onAddClient}>
            <Plus className="h-4 w-4 mr-1" /> Nuevo Cliente
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterKey)}>
          <TabsList className="bg-secondary/30 border border-border/30 h-8">
            <TabsTrigger value="all" className="text-xs h-7">Todos</TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs h-7">Con alertas</TabsTrigger>
            <TabsTrigger value="basico" className="text-xs h-7">Básico</TabsTrigger>
            <TabsTrigger value="pro" className="text-xs h-7">Pro</TabsTrigger>
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-muted-foreground">
            <Users className="h-10 w-10 opacity-30 mb-2" />
            <p className="text-sm">Sin clientes en esta vista</p>
          </div>
        ) : (
          filtered.map((c) => (
            <ClientExpandedRow
              key={c.id}
              client={c}
              expanded={expandedId === c.id}
              onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
