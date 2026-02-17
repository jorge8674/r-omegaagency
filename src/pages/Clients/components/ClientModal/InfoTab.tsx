// src/pages/Clients/components/ClientModal/InfoTab.tsx
// Responsabilidad: Campos de perfil básico + estado/suscripción

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { ClientPlan, SubscriptionStatus } from "@/lib/api/clients";

interface InfoTabProps {
  isEdit: boolean;
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
  company: string;
  onCompanyChange: (v: string) => void;
  plan: ClientPlan;
  onPlanChange: (v: ClientPlan) => void;
  notes: string;
  onNotesChange: (v: string) => void;
  subscriptionStatus: SubscriptionStatus;
  onSubscriptionStatusChange: (v: SubscriptionStatus) => void;
  trialActive: boolean;
  onTrialActiveChange: (v: boolean) => void;
  trialEndsAt: string;
  onTrialEndsAtChange: (v: string) => void;
  statusActive: boolean;
  onStatusActiveChange: (v: boolean) => void;
}

export function InfoTab({
  isEdit, name, onNameChange, email, onEmailChange,
  password, onPasswordChange, phone, onPhoneChange,
  company, onCompanyChange, plan, onPlanChange,
  notes, onNotesChange, subscriptionStatus, onSubscriptionStatusChange,
  trialActive, onTrialActiveChange, trialEndsAt, onTrialEndsAtChange,
  statusActive, onStatusActiveChange,
}: InfoTabProps) {
  return (
    <div className="space-y-4 mt-4">
      {/* Perfil básico */}
      <div className="space-y-2">
        <Label>Nombre *</Label>
        <Input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Nombre del cliente" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="email@ejemplo.com" disabled={isEdit} />
        </div>
        {!isEdit && (
          <div className="space-y-2">
            <Label>Password *</Label>
            <Input type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)} placeholder="Mín. 6 caracteres" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Teléfono</Label>
          <Input value={phone} onChange={(e) => onPhoneChange(e.target.value)} placeholder="+1 234 567 890" />
        </div>
        <div className="space-y-2">
          <Label>Empresa</Label>
          <Input value={company} onChange={(e) => onCompanyChange(e.target.value)} placeholder="Empresa S.A." />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Plan</Label>
        <Select value={plan} onValueChange={(v) => onPlanChange(v as ClientPlan)}>
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
        <Textarea value={notes} onChange={(e) => onNotesChange(e.target.value)} placeholder="Notas adicionales..." rows={3} />
      </div>

      {/* Estado — solo visible en edición */}
      {isEdit && (
        <>
          <Separator />
          <p className="text-sm font-medium text-muted-foreground">Estado y suscripción</p>

          <div className="space-y-2">
            <Label>Estado de suscripción</Label>
            <Select value={subscriptionStatus} onValueChange={(v) => onSubscriptionStatusChange(v as SubscriptionStatus)}>
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
            <Switch checked={trialActive} onCheckedChange={onTrialActiveChange} />
          </div>
          <div className="space-y-2">
            <Label>Fin del trial</Label>
            <Input type="date" value={trialEndsAt} onChange={(e) => onTrialEndsAtChange(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Cliente activo</Label>
            <Switch checked={statusActive} onCheckedChange={onStatusActiveChange} />
          </div>
        </>
      )}
    </div>
  );
}
