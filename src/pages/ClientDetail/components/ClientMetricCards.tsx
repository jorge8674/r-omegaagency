import { Card, CardContent } from "@/components/ui/card";
import { Crown, Bot, FileText, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ClientDetailData, ClientAgent, ClientContentItem } from "../hooks/useClientDetail";

interface Props {
  client: ClientDetailData;
  agents: ClientAgent[];
  content: ClientContentItem[];
}

const PLAN_PRICE: Record<string, string> = {
  enterprise: "$780/mes",
  pro: "$380/mes",
  basic: "$120/mes",
};

export function ClientMetricCards({ client, agents, content }: Props) {
  const memberSince = format(new Date(client.created_at), "MMM yyyy", { locale: es });
  const activeAgents = agents.filter((a) => a.status === "active").length;
  const monthContent = content.length;

  const cards = [
    { icon: Crown, label: "Plan", value: client.plan ?? "basic", sub: PLAN_PRICE[client.plan ?? "basic"] ?? "—" },
    { icon: Bot, label: "Agentes", value: `${activeAgents} activos`, sub: `de ${agents.length} asignados` },
    { icon: FileText, label: "Contenido", value: `${monthContent} items`, sub: "este mes" },
    { icon: CalendarDays, label: "Miembro", value: `desde ${memberSince}`, sub: "" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/30 bg-card/60 hover:border-yellow-500/30 transition-colors">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
              <c.icon className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="text-sm font-semibold capitalize truncate">{c.value}</p>
              {c.sub && <p className="text-xs text-muted-foreground">{c.sub}</p>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
