/* Block 5 — Upsell Section (conditional on plan) */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Building2, Sparkles } from "lucide-react";
import { AGENT_CATALOG } from "../constants";
import type { UpsellPayload } from "../types";

interface Props {
  plan: string;
  clientId: string;
  onRequestUpsell: (payload: Omit<UpsellPayload, "client_id" | "current_plan">) => void;
  onOpenCatalog: () => void;
}

export default function UpsellSection({ plan, clientId, onRequestUpsell, onOpenCatalog }: Props) {
  if (plan === "basic") return <BasicUpsell onRequestUpsell={onRequestUpsell} onOpenCatalog={onOpenCatalog} />;
  if (plan === "pro") return <ProUpsell onRequestUpsell={onRequestUpsell} />;
  if (plan === "enterprise") return <EnterpriseUpsell onRequestUpsell={onRequestUpsell} />;
  return null;
}

function BasicUpsell({ onRequestUpsell, onOpenCatalog }: Pick<Props, "onRequestUpsell" | "onOpenCatalog">) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* NOVA Dedicada */}
      <Card className="bg-card border-chart-3/20">
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Brain className="h-5 w-5 text-chart-3" /> NOVA trabaja para ti mientras duermes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Monitorea tu competencia y genera contenido proactivamente.</p>
          <ul className="text-sm space-y-1">
            <li className="text-success">✓ Mensajes ilimitados</li>
            <li className="text-success">✓ 24/7 activa</li>
            <li className="text-success">✓ 2 competidores</li>
          </ul>
          <p className="text-lg font-bold text-primary">$5,000/mes</p>
          <Button className="w-full" onClick={() => onRequestUpsell({
            request_type: "plan_upgrade", item_name: "NOVA Dedicada",
            item_code: "NOVA", monthly_price: 2500, new_monthly_total: 5000,
          })}>
            Solicitar activación
          </Button>
        </CardContent>
      </Card>

      {/* Agentes */}
      <Card className="bg-card border-primary/20">
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Zap className="h-5 w-5 text-primary" /> Añade especialistas a tu equipo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Cada agente resuelve un área específica.</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {AGENT_CATALOG.filter((a) => ["ATLAS","VERA","ORACLE"].includes(a.code)).map((a) => (
              <li key={a.code}>{a.name} — ${a.price.toLocaleString()}/mes</li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" onClick={onOpenCatalog}>
            Ver todos los agentes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProUpsell({ onRequestUpsell }: Pick<Props, "onRequestUpsell">) {
  const directors = AGENT_CATALOG.filter((a) => a.role.toLowerCase().includes("director"));
  return (
    <Card className="bg-card border-primary/20">
      <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5 text-primary" /> Activa tu departamento completo de IA</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          {directors.map((d) => (
            <span key={d.code}>{d.name} ${d.price.toLocaleString()}</span>
          ))}
        </div>
        <Button className="w-full" onClick={() => onRequestUpsell({
          request_type: "full_department", item_name: "Company Team",
          item_code: "COMPANY", monthly_price: 10000, new_monthly_total: 10000,
        })}>
          Solicitar mi equipo
        </Button>
      </CardContent>
    </Card>
  );
}

function EnterpriseUpsell({ onRequestUpsell }: Pick<Props, "onRequestUpsell">) {
  return (
    <Card className="bg-card border-primary/20">
      <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="h-5 w-5 text-primary" /> SOPHIA puede crear agentes para tu industria</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">¿Necesitas un agente especializado en tu sector? SOPHIA lo diseña en 48 horas.</p>
        <Button className="w-full" onClick={() => onRequestUpsell({
          request_type: "custom_agent", item_name: "Agente Personalizado",
          item_code: "CUSTOM", monthly_price: 0, new_monthly_total: 0,
        })}>
          Solicitar agente personalizado
        </Button>
      </CardContent>
    </Card>
  );
}
