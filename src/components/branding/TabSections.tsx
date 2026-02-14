import { BrandingData } from "./useBrandingEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, X } from "lucide-react";

interface Props {
  branding: BrandingData;
  update: <K extends keyof BrandingData>(key: K, value: BrandingData[K]) => void;
}

function Repeater<T>({ items, max, onAdd, onRemove, renderItem }: {
  items: T[]; max: number; onAdd: () => void; onRemove: (i: number) => void;
  renderItem: (item: T, i: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 space-y-2">{renderItem(item, i)}</div>
          {items.length > 1 && (
            <Button variant="ghost" size="icon" className="shrink-0 mt-1 text-destructive" onClick={() => onRemove(i)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      {items.length < max && (
        <Button variant="outline" size="sm" onClick={onAdd} className="w-full border-dashed">
          <Plus className="h-4 w-4 mr-1" /> Agregar
        </Button>
      )}
    </div>
  );
}

export function TabSections({ branding, update }: Props) {
  const { pain_section: pain, solutions_section: sol, services_section: svc, metrics_section: met, process_section: proc } = branding;

  const upPain = (v: Partial<typeof pain>) => update("pain_section", { ...pain, ...v });
  const upSol = (v: Partial<typeof sol>) => update("solutions_section", { ...sol, ...v });
  const upSvc = (v: Partial<typeof svc>) => update("services_section", { ...svc, ...v });
  const upMet = (v: Partial<typeof met>) => update("metrics_section", { ...met, ...v });
  const upProc = (v: Partial<typeof proc>) => update("process_section", { ...proc, ...v });

  const setPainItem = (i: number, text: string) => {
    const items = [...pain.items]; items[i] = { ...items[i], text }; upPain({ items });
  };
  const setSolItem = (i: number, k: string, v: string) => {
    const items = [...sol.items]; items[i] = { ...items[i], [k]: v }; upSol({ items });
  };
  const setSvcItem = (i: number, k: string, v: string) => {
    const items = [...svc.items]; items[i] = { ...items[i], [k]: v }; upSvc({ items });
  };
  const setMetItem = (i: number, k: string, v: string) => {
    const items = [...met.items]; items[i] = { ...items[i], [k]: v }; upMet({ items });
  };
  const setProcItem = (i: number, k: string, v: string) => {
    const items = [...proc.items]; items[i] = { ...items[i], [k]: v }; upProc({ items });
  };

  const sectionHeader = (label: string, active: boolean, toggle: (v: boolean) => void) => (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium">{label}</span>
      <Switch checked={active} onCheckedChange={toggle} />
    </div>
  );

  return (
    <Accordion type="single" collapsible className="space-y-3">
      {/* DOLOR */}
      <AccordionItem value="pain" className="border border-border rounded-lg px-4">
        <AccordionTrigger className={!pain.active ? "opacity-50" : ""}>😓 Dolor</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {sectionHeader("Sección activa", pain.active, (v) => upPain({ active: v }))}
          <Input placeholder="Título" value={pain.title} onChange={(e) => upPain({ title: e.target.value })} />
          <Textarea placeholder="Descripción" value={pain.description} onChange={(e) => upPain({ description: e.target.value })} />
          <Repeater items={pain.items} max={4}
            onAdd={() => upPain({ items: [...pain.items, { text: "", emoji: "😓" }] })}
            onRemove={(i) => upPain({ items: pain.items.filter((_, j) => j !== i) })}
            renderItem={(item, i) => <Input placeholder={`Punto de dolor ${i + 1}`} value={item.text} onChange={(e) => setPainItem(i, e.target.value)} />}
          />
        </AccordionContent>
      </AccordionItem>

      {/* SOLUCIONES */}
      <AccordionItem value="solutions" className="border border-border rounded-lg px-4">
        <AccordionTrigger className={!sol.active ? "opacity-50" : ""}>💡 Soluciones</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {sectionHeader("Sección activa", sol.active, (v) => upSol({ active: v }))}
          <Input placeholder="Título" value={sol.title} onChange={(e) => upSol({ title: e.target.value })} />
          <Repeater items={sol.items} max={4}
            onAdd={() => upSol({ items: [...sol.items, { title: "", description: "" }] })}
            onRemove={(i) => upSol({ items: sol.items.filter((_, j) => j !== i) })}
            renderItem={(item, i) => (<>
              <Input placeholder="Título" value={item.title} onChange={(e) => setSolItem(i, "title", e.target.value)} />
              <Textarea placeholder="Descripción" value={item.description} onChange={(e) => setSolItem(i, "description", e.target.value)} rows={2} />
            </>)}
          />
        </AccordionContent>
      </AccordionItem>

      {/* SERVICIOS */}
      <AccordionItem value="services" className="border border-border rounded-lg px-4">
        <AccordionTrigger className={!svc.active ? "opacity-50" : ""}>🛠 Servicios</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {sectionHeader("Sección activa", svc.active, (v) => upSvc({ active: v }))}
          <Input placeholder="Título" value={svc.title} onChange={(e) => upSvc({ title: e.target.value })} />
          <Repeater items={svc.items} max={6}
            onAdd={() => upSvc({ items: [...svc.items, { name: "", description: "", price: "" }] })}
            onRemove={(i) => upSvc({ items: svc.items.filter((_, j) => j !== i) })}
            renderItem={(item, i) => (<>
              <Input placeholder="Nombre del servicio" value={item.name} onChange={(e) => setSvcItem(i, "name", e.target.value)} />
              <Textarea placeholder="Descripción" value={item.description} onChange={(e) => setSvcItem(i, "description", e.target.value)} rows={2} />
              <Input placeholder="Precio (opcional)" value={item.price} onChange={(e) => setSvcItem(i, "price", e.target.value)} />
            </>)}
          />
        </AccordionContent>
      </AccordionItem>

      {/* MÉTRICAS */}
      <AccordionItem value="metrics" className="border border-border rounded-lg px-4">
        <AccordionTrigger className={!met.active ? "opacity-50" : ""}>📊 Métricas</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {sectionHeader("Sección activa", met.active, (v) => upMet({ active: v }))}
          <Repeater items={met.items} max={4}
            onAdd={() => upMet({ items: [...met.items, { number: "", label: "" }] })}
            onRemove={(i) => upMet({ items: met.items.filter((_, j) => j !== i) })}
            renderItem={(item, i) => (
              <div className="flex gap-2">
                <Input placeholder="150+" value={item.number} onChange={(e) => setMetItem(i, "number", e.target.value)} className="w-28" />
                <Input placeholder="Clientes activos" value={item.label} onChange={(e) => setMetItem(i, "label", e.target.value)} className="flex-1" />
              </div>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      {/* PROCESO */}
      <AccordionItem value="process" className="border border-border rounded-lg px-4">
        <AccordionTrigger className={!proc.active ? "opacity-50" : ""}>🔄 Proceso</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {sectionHeader("Sección activa", proc.active, (v) => upProc({ active: v }))}
          <Input placeholder="Título" value={proc.title} onChange={(e) => upProc({ title: e.target.value })} />
          <Repeater items={proc.items} max={6}
            onAdd={() => upProc({ items: [...proc.items, { step: proc.items.length + 1, title: "", description: "" }] })}
            onRemove={(i) => upProc({ items: proc.items.filter((_, j) => j !== i).map((it, j) => ({ ...it, step: j + 1 })) })}
            renderItem={(item, i) => (<>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-primary bg-primary/10 rounded px-2 py-1">Paso {item.step}</span>
                <Input placeholder="Título del paso" value={item.title} onChange={(e) => setProcItem(i, "title", e.target.value)} className="flex-1" />
              </div>
              <Textarea placeholder="Descripción" value={item.description} onChange={(e) => setProcItem(i, "description", e.target.value)} rows={2} />
            </>)}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
