import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resellerId: string;
  onSuccess: () => void;
}

export function AddClientModal({ open, onOpenChange, resellerId, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("básico");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      toast({ title: "Campos requeridos", description: "Nombre y email son obligatorios.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/resellers/${resellerId}/clients/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), plan, reseller_id: resellerId }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => "");
        throw new Error(err || "Error al agregar cliente");
      }
      toast({ title: "Cliente agregado", description: `${name} fue registrado exitosamente.` });
      setName("");
      setEmail("");
      setPlan("básico");
      onOpenChange(false);
      onSuccess();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "No se pudo agregar el cliente.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Agregar Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nombre *</Label>
            <Input placeholder="Nombre del cliente" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input type="email" placeholder="email@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="básico">Básico</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
