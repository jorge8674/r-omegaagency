import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Métricas y reportes de rendimiento</p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-1">Analytics</h3>
          <p className="text-sm text-muted-foreground">Los datos analíticos aparecerán cuando conectes cuentas sociales</p>
        </CardContent>
      </Card>
    </div>
  );
}
