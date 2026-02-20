// 90 lines
import { useQuery } from "@tanstack/react-query";
import { Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiCall } from "@/lib/api/core";

interface OmegaClient {
  id: string;
  name: string;
  business_name?: string | null;
  plan?: string | null;
  status?: string | null;
  reseller_name?: string | null;
  reseller_id?: string | null;
}

interface ClientsResponse {
  clients: OmegaClient[];
  total: number;
}

const PLAN_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  enterprise: "default",
  pro:        "secondary",
  starter:    "outline",
  basic:      "outline",
};

function StatusDot({ status }: { status?: string | null }) {
  const active = status === "active";
  return (
    <div
      className={`h-2 w-2 rounded-full shrink-0 ${
        active ? "bg-emerald-500" : "bg-muted-foreground/40"
      }`}
    />
  );
}

export function ClientsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["omega-clients"],
    queryFn: () => apiCall<ClientsResponse>("/omega/clients/"),
    staleTime: 60_000,
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const clients = data?.clients ?? [];

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Users2 className="mb-2 h-10 w-10 opacity-30" />
        <p className="text-sm">Sin clientes registrados</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 divide-y divide-border/30">
      {clients.map((c) => {
        const displayName = c.business_name ?? c.name;
        const plan = (c.plan ?? "basic").toLowerCase();
        const badgeVariant = PLAN_BADGE[plan] ?? "outline";
        return (
          <div key={c.id} className="flex items-center gap-3 px-4 py-2.5">
            <StatusDot status={c.status} />
            <span className="flex-1 text-sm font-medium truncate">{displayName}</span>
            {c.reseller_name && (
              <span className="text-[11px] text-muted-foreground hidden sm:block truncate max-w-[120px]">
                {c.reseller_name}
              </span>
            )}
            <Badge variant={badgeVariant} className="text-[10px] capitalize shrink-0">
              {plan}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
