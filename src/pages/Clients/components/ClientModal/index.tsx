// src/pages/Clients/components/ClientModal/index.tsx
// Responsabilidad: Tab controller + modal wrapper + state management

import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InfoTab } from "./InfoTab";
import { ContextTab, type ContextTabRef } from "./ContextTab";
import { AccountsTab } from "./AccountsTab";
import { createAccountWithContext } from "@/lib/api/socialAccounts";
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
  const { toast } = useToast();
  const contextTabRef = useRef<ContextTabRef>(null);

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
  const [savingAll, setSavingAll] = useState(false);

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

  const handleSave = useCallback(async () => {
    setSavingAll(true);
    try {
      // 1. Save client info
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

      // 2. Save context + pending accounts (if any data in ContextTab)
      if (isEdit && client && contextTabRef.current) {
        const contextData = contextTabRef.current.getData();
        if (contextData && contextData.pendingAccounts.length > 0) {
          for (const acc of contextData.pendingAccounts) {
            await createAccountWithContext({
              client_id: client.id,
              platform: acc.platform,
              username: acc.username,
              profile_url: acc.profile_url,
              context: contextData.context,
            });
          }
          toast({ title: `${contextData.pendingAccounts.length} cuenta(s) creada(s) con contexto` });
        }
      }

      onOpenChange(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSavingAll(false);
    }
  }, [isEdit, client, name, email, password, phone, company, plan, notes, statusActive, subscriptionStatus, trialActive, onUpdate, onSubmit, onOpenChange, toast]);

  const isValid = name.trim().length > 0
    && email.trim().length > 0
    && (isEdit || password.trim().length >= 6);

  const busy = isSaving || savingAll;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica los datos, contexto de marca y cuentas sociales del cliente."
              : "Completa la información básica para crear el cliente. Luego podrás configurar su contexto y cuentas."}
          </DialogDescription>
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
              ref={contextTabRef}
              client={client ? { id: client.id, plan: client.plan } : null}
            />
          </TabsContent>

          <TabsContent value="accounts">
            <AccountsTab
              clientId={client?.id ?? null}
              plan={plan}
              isEdit={isEdit}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="gradient-primary" onClick={handleSave} disabled={!isValid || busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
