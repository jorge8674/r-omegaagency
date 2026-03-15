import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { omegaApi } from "@/lib/api/omega";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { MarketplaceDirectorCard } from "./MarketplaceDirectorCard";
import type { MarketplaceAgent } from "../hooks/useMarketplace";

interface Props {
  isAgentActive: (code: string) => boolean;
  onSolicitar: (a: MarketplaceAgent) => void;
}

export function MarketplaceOrgChart({ isAgentActive, onSolicitar }: Props) {
  const [fetchedAt, setFetchedAt] = useState(new Date());

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["marketplace-org-chart"],
    queryFn: () => omegaApi.getOrgChart(),
    retry: 0,
    staleTime: 60_000,
  });

  const handleRefresh = () => { refetch(); setFetchedAt(new Date()); };

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;
  }

  const directors = data?.directors ?? [];
  const totalAgents = data?.total_agents ?? directors.reduce((s, d) => s + 1 + d.sub_agents.length, 0);
  const totalDepts = data?.total_departments ?? directors.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{totalAgents}</span> agentes |{" "}
          <span className="font-semibold text-foreground">{totalDepts}</span> departamentos
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(fetchedAt, { addSuffix: true, locale: es })}
          </span>
          <Button size="sm" variant="outline" className="h-6 gap-1 px-2 text-xs" onClick={handleRefresh}>
            <RefreshCw className="h-3 w-3" /> Actualizar
          </Button>
        </div>
      </div>

      {/* NOVA — CEO */}
      {data?.ceo && (
        <div className="flex justify-center">
          <div className="rounded-xl border-2 border-yellow-500/60 bg-yellow-500/10 px-6 py-3 text-center shadow-sm shadow-yellow-500/10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-yellow-400" />
              <span className="font-mono text-sm font-bold text-yellow-400">{data.ceo.code}</span>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-[9px]">CEO</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{data.ceo.name}</p>
            <div className="mt-1.5 flex items-center justify-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400">Online 24/7</span>
            </div>
          </div>
        </div>
      )}

      {directors.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {directors.map((d) => (
            <MarketplaceDirectorCard
              key={d.id}
              director={d}
              locked={!isAgentActive(d.code)}
              isAgentActive={isAgentActive}
              onSolicitar={onSolicitar}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Crown className="mb-2 h-8 w-8 opacity-20" />
          <p className="text-sm">Sin datos del org chart</p>
        </div>
      )}
    </div>
  );
}
