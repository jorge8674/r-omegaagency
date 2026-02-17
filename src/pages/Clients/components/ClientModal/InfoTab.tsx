// src/pages/Clients/components/ClientModal/InfoTab.tsx
// Responsabilidad: Campos de perfil básico + estado/suscripción + save propio

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type {
  ClientProfile, ClientCreate, ClientUpdate,
  ClientPlan, SubscriptionStatus,
} from "@/lib/api/clients";

interface InfoTabProps {
  client: ClientProfile | null;
  onSubmit: (payload: ClientCreate) => Promise<ClientProfile | undefined>;
  onUpdate: (id: string, payload: ClientUpdate) => Promise<void>;
  isSaving: boolean;
  onCreated: (client: ClientProfile) => void;
  onUpdated: () => void;
}

export function InfoTab({
  client, onSubmit, onUpdate, isSaving, onCreated, onUpdated,
}: InfoTabProps) {
  const isEdit = !!client;
  const { toast } = useToast();

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
  }, [client]);

  const handleSave = useCallback(async () => {
    try {
      if (isEdit && client) {
        await onUpdate(client.id, {
          name, phone: phone || null, company: company || null,
          plan, notes: notes || null,
          status: statusActive ? "active" : "inactive",
          subscription_status: subscriptionStatus,
          trial_active: trialActive,
        });
        onUpdated();
      } else {
        const result = await onSubmit({
          name, email, password,
          phone: phone || null, company: company || null,
          plan, notes: notes || null,
        });
        if (result) {
          onCreated(result);
        }
      }
    } catch (error: unknown) {
      let errorMessage = error instanceof Error ? error.message : "Error desconocido";
      try {
        const jsonStart = errorMessage.indexOf("{");
        if (jsonStart !== -1) {
          const parsed = JSON.parse(errorMessage.slice(jsonStart));
          if (parsed?.detail && Array.isArray(parsed.detail)) {
            const fieldMessages: Record<string, string> = {
              password: "La contraseña debe tener al menos 8 caracteres",
              email: "El email no es válido",
              name: "El nombre es requerido",
              plan: "El plan no es válido",
            };
            const firstError = parsed.detail[0];
            const field = firstError?.loc?.[firstError.loc.length - 1];
            errorMessage = fieldMessages[field] || firstError?.msg || errorMessage;
          } else if (typeof parsed?.detail === "string") {
            errorMessage = parsed.detail;
          }
        }
      } catch { /* usa mensaje original */ }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  }, [isEdit, client, name, email, password, phone, company, plan, notes, statusActive, subscriptionStatus, trialActive, onUpdate, onSubmit, onCreated, onUpdated, toast]);

  const isValid = name.trim().length > 0
    && email.trim().length > 0
    && (isEdit || password.trim().length >= 6);

  return (
    <div className="space-y-4 mt-4">
      {/* Perfil básico */}
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
        <Label>Notas</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas adicionales..." rows={3} />
      </div>

      {/* Estado y suscripción — siempre visible */}
      <Separator />
      <p className="text-sm font-medium text-muted-foreground">Estado y suscripción</p>

      <div className="space-y-2">
        <Label>Estado de suscripción</Label>
        <Select value={subscriptionStatus} onValueChange={(v) => setSubscriptionStatus(v as SubscriptionStatus)}>
          <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
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

      {/* Save button — self-contained */}
      <div className="flex justify-end pt-2">
        <Button className="gradient-primary" onClick={handleSave} disabled={!isValid || isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Guardar Cambios" : "Crear Cuenta"}
        </Button>
      </div>
    </div>
  );
}
