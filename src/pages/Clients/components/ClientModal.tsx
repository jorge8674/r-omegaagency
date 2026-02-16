// src/pages/Clients/components/ClientModal.tsx

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Palette } from "lucide-react";
import { ContextOnboarding } from "@/pages/ContentGenerator/components/ContextOnboarding";
import type {
  ClientProfile, ClientCreate, ClientUpdate,
  ClientPlan, SubscriptionStatus,
} from "@/lib/api/clients";

interface ClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientProfile | null;
  onSubmit: (payload: ClientCreate) => Promise<void>;
  onUpdate: (id: string, payload: ClientUpdate) => Promise<void>;
  isSaving: boolean;
}

export function ClientModal({ open, onOpenChange, client, onSubmit, onUpdate, isSaving }: ClientModalProps) {
  const isEdit = !!client;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState<ClientPlan>("basic");
  const [notes, setNotes] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>("trial");
  const [trialActive, setTrialActive] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState("");
  const [statusActive, setStatusActive] = useState(true);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setPhone(client.phone ?? "");
      setCompany(client.company ?? "");
      setPlan(client.plan);
      setNotes(client.notes ?? "");
      setSubscriptionStatus(client.subscription_status);
      setTrialActive(client.trial_active);
      setTrialEndsAt(client.trial_ends_at ?? "");
      setStatusActive(client.status === "active");
    } else {
      setName(""); setEmail(""); setPassword(""); setPhone("");
      setCompany(""); setPlan("basic"); setNotes("");
      setSubscriptionStatus("trial"); setTrialActive(false);
      setTrialEndsAt(""); setStatusActive(true);
    }
  }, [client, open]);

  const handleSave = async () => {
    if (isEdit) {
      await onUpdate(client.id, {
        name, phone: phone || null, company: company || null,
        plan, notes: notes || null,
        status: statusActive ? "active" : "inactive",
        subscription_status: subscriptionStatus,
        trial_active: trialActive,
      });
    } else {
      await onSubmit({
        name, email, password,
        phone: phone || null, company: company || null,
        plan, notes: notes || null,
      });
    }
    onOpenChange(false);
  };

  const isValid = name.trim().length > 0
    && email.trim().length > 0
    && (isEdit || password.trim().length >= 6);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="context" disabled={!isEdit}>Contexto</TabsTrigger>
            <TabsTrigger value="status" disabled={!isEdit}>Estado</TabsTrigger>
          </TabsList>

          {/* Tab 1 — Info básica */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del cliente" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@ejemplo.com" disabled={isEdit} />
              </div>
              {!isEdit && (
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mín. 6 caracteres" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Empresa S.A." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={plan} onValueChange={(v) => setPlan(v as ClientPlan)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas adicionales..." rows={3} />
            </div>
          </TabsContent>

          {/* Tab 2 — Contexto de Marca */}
          <TabsContent value="context" className="mt-4">
            {isEdit ? (
              <ContextOnboarding clientId={client.id} onSave={() => {}} isSaving={false} />
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Palette className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground text-center">
                    Crea el cliente primero para configurar su contexto de marca
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 3 — Estado */}
          <TabsContent value="status" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Estado de suscripción</Label>
              <Select value={subscriptionStatus} onValueChange={(v) => setSubscriptionStatus(v as SubscriptionStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="past_due">Mora</SelectItem>
                  <SelectItem value="canceled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Trial activo</Label>
              <Switch checked={trialActive} onCheckedChange={setTrialActive} />
            </div>
            <div className="space-y-2">
              <Label>Fin del trial</Label>
              <Input type="date" value={trialEndsAt} onChange={(e) => setTrialEndsAt(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Cliente activo</Label>
              <Switch checked={statusActive} onCheckedChange={setStatusActive} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="gradient-primary" onClick={handleSave} disabled={!isValid || isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
