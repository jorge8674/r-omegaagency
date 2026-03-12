import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  total: number;
  pendingCount: number;
  acceptedCount: number;
  declinedCount: number;
  monthlyRevenue: number;
}

export function SolicitudesSummary({ total, pendingCount, acceptedCount, declinedCount, monthlyRevenue }: Props) {
  const items = [
    { label: "Recibidas", value: total, icon: BarChart2, color: "text-primary" },
    { label: "Aceptadas", value: acceptedCount, icon: CheckCircle, color: "text-success" },
    { label: "Declinadas", value: declinedCount, icon: XCircle, color: "text-destructive" },
    { label: "Pendientes", value: pendingCount, icon: Clock, color: "text-chart-4" },
  ];

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <BarChart2 className="h-4 w-4" /> Este mes
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <div>
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
            {item.label === "Pendientes" && pendingCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground text-xs ml-1">{pendingCount}</Badge>
            )}
          </div>
        ))}
        <div className="col-span-2 sm:col-span-4 border-t border-border/40 pt-2">
          <p className="text-xs text-muted-foreground">
            Revenue upsell este mes: <span className="font-semibold text-success">${monthlyRevenue.toLocaleString()}/mes</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
