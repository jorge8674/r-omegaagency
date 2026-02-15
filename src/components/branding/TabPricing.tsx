import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Star, X } from "lucide-react";

interface PricingPlan {
  name: string;
  price: number;
  period: "mes" | "año";
  description: string;
  features: string[];
  is_popular: boolean;
}

interface Props {
  plans: PricingPlan[];
  onChange: (plans: PricingPlan[]) => void;
}

export function TabPricing({ plans, onChange }: Props) {
  const addPlan = () => {
    onChange([...plans, { name: "", price: 0, period: "mes", description: "", features: [""], is_popular: false }]);
  };

  const updatePlan = (idx: number, field: keyof PricingPlan, value: any) => {
    const updated = [...plans];
    (updated[idx] as any)[field] = value;
    onChange(updated);
  };

  const removePlan = (idx: number) => {
    onChange(plans.filter((_, i) => i !== idx));
  };

  const addFeature = (planIdx: number) => {
    const updated = [...plans];
    updated[planIdx].features = [...updated[planIdx].features, ""];
    onChange(updated);
  };

  const updateFeature = (planIdx: number, featIdx: number, value: string) => {
    const updated = [...plans];
    updated[planIdx].features[featIdx] = value;
    onChange(updated);
  };

  const removeFeature = (planIdx: number, featIdx: number) => {
    const updated = [...plans];
    updated[planIdx].features = updated[planIdx].features.filter((_, i) => i !== featIdx);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {plans.map((plan, idx) => (
        <Card key={idx} className={`glass relative ${plan.is_popular ? "border-primary/40" : ""}`}>
          {plan.is_popular && (
            <div className="absolute -top-3 left-4">
              <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-display font-semibold flex items-center gap-1">
                <Star className="h-3 w-3" /> Más Popular
              </span>
            </div>
          )}
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-display">Plan {idx + 1}</CardTitle>
            <Button variant="ghost" size="sm" className="text-destructive h-8" onClick={() => removePlan(idx)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input placeholder="Básico" value={plan.name} onChange={(e) => updatePlan(idx, "name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Precio</Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="97" value={plan.price || ""} onChange={(e) => updatePlan(idx, "price", Number(e.target.value))} className="flex-1" />
                  <Select value={plan.period} onValueChange={(v) => updatePlan(idx, "period", v)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mes">/mes</SelectItem>
                      <SelectItem value="año">/año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input placeholder="Para negocios que empiezan" value={plan.description} onChange={(e) => updatePlan(idx, "description", e.target.value)} />
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label>Features</Label>
              {plan.features.map((feat, fi) => (
                <div key={fi} className="flex gap-2">
                  <Input placeholder="Feature incluida" value={feat} onChange={(e) => updateFeature(idx, fi, e.target.value)} className="flex-1" />
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-muted-foreground" onClick={() => removeFeature(idx, fi)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addFeature(idx)} className="w-full">
                <Plus className="h-4 w-4 mr-1" /> Añadir Feature
              </Button>
            </div>

            {/* Popular toggle */}
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <Switch checked={plan.is_popular} onCheckedChange={(v) => updatePlan(idx, "is_popular", v)} />
              <Label className="text-sm">Plan Popular (badge destacado)</Label>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addPlan} className="w-full border-dashed">
        <Plus className="h-4 w-4 mr-2" /> Añadir Plan
      </Button>
    </div>
  );
}