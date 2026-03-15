import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Building2, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OmegaUpsell() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Bot,
      title: "Agentes Especializados",
      desc: "45+ agentes entrenados para marketing, ventas, analytics y más",
    },
    {
      icon: Building2,
      title: "Departamentos Completos",
      desc: "Activa departamentos enteros con un solo clic. SENTINEL, ATLAS, RAFA y más",
    },
    {
      icon: TrendingUp,
      title: "ROI Inmediato",
      desc: "Tus clientes obtienen resultados desde el primer día de activación",
    },
  ];

  return (
    <Card className="border-border/30 bg-card/60">
      <CardHeader>
        <CardTitle className="text-base font-display">Expande tu Agencia</CardTitle>
        <p className="text-xs text-muted-foreground">
          Potencia tu agencia con agentes y departamentos especializados de OMEGA
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-border/30 bg-secondary/20 p-4 space-y-2"
            >
              <b.icon className="h-6 w-6 text-amber-400" />
              <p className="text-sm font-semibold">{b.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => navigate("/reseller/marketplace")}
          >
            Ver Agentes y Departamentos <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
