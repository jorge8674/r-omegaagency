import { BrandingData } from "./useBrandingEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Star } from "lucide-react";

interface Props {
  branding: BrandingData;
  update: <K extends keyof BrandingData>(key: K, value: BrandingData[K]) => void;
}

export function TabSocialProof({ branding, update }: Props) {
  const test = branding.testimonials ?? { active: true, items: [{ name: "", company: "", text: "", rating: 5 }] };
  const logos = branding.client_logos ?? { active: false, items: [] };
  if (!test.items) test.items = [];
  if (!logos.items) logos.items = [];

  const upTest = (v: Partial<typeof test>) => update("testimonials", { ...test, ...v });
  const upLogos = (v: Partial<typeof logos>) => update("client_logos", { ...logos, ...v });

  const setTestItem = (i: number, k: string, v: string | number) => {
    const items = [...test.items]; items[i] = { ...items[i], [k]: v }; upTest({ items });
  };
  const setLogoItem = (i: number, k: string, v: string) => {
    const items = [...logos.items]; items[i] = { ...items[i], [k]: v }; upLogos({ items });
  };

  return (
    <div className="space-y-6">
      {/* Testimonios */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">Testimonios</CardTitle>
          <Switch checked={test.active} onCheckedChange={(v) => upTest({ active: v })} />
        </CardHeader>
        <CardContent className={`space-y-4 ${!test.active ? "opacity-40 pointer-events-none" : ""}`}>
          {test.items.map((item, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Testimonio {i + 1}</span>
                {test.items.length > 1 && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"
                    onClick={() => upTest({ items: test.items.filter((_, j) => j !== i) })}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Nombre" value={item.name} onChange={(e) => setTestItem(i, "name", e.target.value)} />
                <Input placeholder="Empresa" value={item.company} onChange={(e) => setTestItem(i, "company", e.target.value)} />
              </div>
              <Textarea placeholder="Testimonio..." value={item.text} onChange={(e) => setTestItem(i, "text", e.target.value)} rows={2} />
              <Select value={String(item.rating)} onValueChange={(v) => setTestItem(i, "rating", Number(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {"★".repeat(r)}{"☆".repeat(5 - r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          {test.items.length < 6 && (
            <Button variant="outline" size="sm" className="w-full border-dashed"
              onClick={() => upTest({ items: [...test.items, { name: "", company: "", text: "", rating: 5 }] })}>
              <Plus className="h-4 w-4 mr-1" /> Agregar Testimonio
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Logos de Clientes */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">Logos de Clientes</CardTitle>
          <Switch checked={logos.active} onCheckedChange={(v) => upLogos({ active: v })} />
        </CardHeader>
        <CardContent className={`space-y-3 ${!logos.active ? "opacity-40 pointer-events-none" : ""}`}>
          {logos.items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input placeholder="URL del logo" value={item.url} onChange={(e) => setLogoItem(i, "url", e.target.value)} className="flex-1" />
              <Input placeholder="Nombre (alt)" value={item.name} onChange={(e) => setLogoItem(i, "name", e.target.value)} className="w-40" />
              <Button variant="ghost" size="icon" className="shrink-0 text-destructive"
                onClick={() => upLogos({ items: logos.items.filter((_, j) => j !== i) })}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {logos.items.length < 8 && (
            <Button variant="outline" size="sm" className="w-full border-dashed"
              onClick={() => upLogos({ items: [...logos.items, { url: "", name: "" }] })}>
              <Plus className="h-4 w-4 mr-1" /> Agregar Logo
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
