// src/pages/Clients/components/ClientModal/index.tsx
// Responsabilidad: Tab controller + modal wrapper + state management

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { InfoTab } from "./InfoTab";
import { ContextTab } from "./ContextTab";
import { AccountsTab } from "./AccountsTab";
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
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

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
      setSelectedTones([]); setSelectedGoals([]);
    }
  }, [client, open]);

  const handleSave = useCallback(async () => {
    if (isEdit && client) {
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
  }, [isEdit, client, name, email, password, phone, company, plan, notes, statusActive, subscriptionStatus, trialActive, onUpdate, onSubmit, onOpenChange]);

  const isValid = name.trim().length > 0
    && email.trim().length > 0
    && (isEdit || password.trim().length >= 6);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>🔥 {isEdit ? "EDITAR (NUEVO)" : "CREAR (NUEVO)"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="context" disabled={!isEdit}>Contexto</TabsTrigger>
            <TabsTrigger value="accounts" disabled={!isEdit}>Cuentas</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <InfoTab
              isEdit={isEdit} name={name} onNameChange={setName}
              email={email} onEmailChange={setEmail} password={password} onPasswordChange={setPassword}
              phone={phone} onPhoneChange={setPhone} company={company} onCompanyChange={setCompany}
              plan={plan} onPlanChange={setPlan} notes={notes} onNotesChange={setNotes}
              subscriptionStatus={subscriptionStatus} onSubscriptionStatusChange={setSubscriptionStatus}
              trialActive={trialActive} onTrialActiveChange={setTrialActive}
              trialEndsAt={trialEndsAt} onTrialEndsAtChange={setTrialEndsAt}
              statusActive={statusActive} onStatusActiveChange={setStatusActive}
            />
          </TabsContent>

          <TabsContent value="context">
            <ContextTab
              isEdit={isEdit} clientId={client?.id ?? null}
              selectedTones={selectedTones} onTonesChange={setSelectedTones}
              selectedGoals={selectedGoals} onGoalsChange={setSelectedGoals}
            />
          </TabsContent>

          <TabsContent value="accounts">
            <AccountsTab />
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
