import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiCall } from "@/lib/api/core";
import type { SubBrand } from "../hooks/useSubBrands";

interface Props {
  brands: SubBrand[];
  activeBrandId: string | null;
  onSelect: (id: string) => void;
  clientId: string;
}

export default function BrandSelector({ brands, activeBrandId, onSelect, clientId }: Props) {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);

  // Don't render if fewer than 2 brands
  if (brands.length < 2) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSending(true);
    try {
      await apiCall("/upsell/solicitud/", "POST", {
        client_id: clientId,
        item_code: "nueva_marca",
        item_name: "Nueva Marca",
        monthly_price: 0,
        new_monthly_total: 0,
        details: { brand_name: name.trim(), description: description.trim() },
      });
      toast({ title: "✅ Solicitud enviada", description: "Te contactaremos en 24 horas." });
      setModalOpen(false);
      setName("");
      setDescription("");
    } catch {
      toast({ title: "Error", description: "No se pudo enviar la solicitud.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 pb-2">
          {brands.slice(0, 5).map((brand) => {
            const isActive = brand.id === activeBrandId;
            return (
              <button
                key={brand.id}
                onClick={() => onSelect(brand.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium
                  whitespace-nowrap transition-all shrink-0
                  ${isActive
                    ? "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-400 shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }
                `}
              >
                {brand.logo_url && (
                  <img src={brand.logo_url} alt="" className="h-5 w-5 rounded-full object-cover" />
                )}
                {brand.name}
              </button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1 text-xs"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" /> Agregar marca
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Add Brand Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar nueva marca</DialogTitle>
            <DialogDescription>
              ¿Quieres gestionar otra marca desde esta cuenta? Nuestro equipo la configurará en 24 horas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Nombre de la nueva marca</Label>
              <Input
                id="brand-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mi otra marca"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-desc">Descripción breve (opcional)</Label>
              <Textarea
                id="brand-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descripción del negocio..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!name.trim() || sending}>
              {sending ? "Enviando..." : "Solicitar agregar marca"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
