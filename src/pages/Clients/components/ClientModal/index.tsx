// src/pages/Clients/components/ClientModal/index.tsx
// Responsabilidad: Tab controller + modal wrapper + state management

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InfoTab } from "./InfoTab";
import { ContextTab } from "./ContextTab";
import { AccountsTab } from "./AccountsTab";
import { BrandVoiceForm } from "@/components/onboarding/BrandVoiceForm";
import type { ClientProfile, ClientCreate, ClientUpdate } from "@/lib/api/clients";

interface ClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientProfile | null;
  onSubmit: (payload: ClientCreate) => Promise<ClientProfile | undefined>;
  onUpdate: (id: string, payload: ClientUpdate) => Promise<void>;
  isSaving: boolean;
}

export function ClientModal({
  open,
  onOpenChange,
  client,
  onSubmit,
  onUpdate,
  isSaving,
}: ClientModalProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [liveClient, setLiveClient] = useState<ClientProfile | null>(null);

  // The "real" client: prop (edit mode) OR just-created (create mode)
  const effectiveClient = client ?? liveClient;
  const isEditMode = !!effectiveClient;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setLiveClient(null);
      setActiveTab("info");
    }
    onOpenChange(nextOpen);
  };

  // Called by InfoTab on successful create
  const handleCreated = useCallback((newClient: ClientProfile) => {
    setLiveClient(newClient);
    setActiveTab("context");
  }, []);

  // Called by InfoTab on successful update — advance to context
  const handleUpdated = useCallback(() => {
    setActiveTab("context");
  }, []);

  const title = isEditMode
    ? `Editar Cliente${effectiveClient?.name ? ` — ${effectiveClient.name}` : ""}`
    : "Nuevo Cliente";

  const description = isEditMode
    ? "Modifica la información, contexto de marca y cuentas sociales del cliente."
    : "Paso 1: completa la info básica. El cliente se creará y podrás configurar contexto y cuentas sociales.";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="context" disabled={!isEditMode}>Contexto</TabsTrigger>
            <TabsTrigger value="voice" disabled={!isEditMode}>Voz</TabsTrigger>
            <TabsTrigger value="accounts" disabled={!isEditMode}>Cuentas</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <InfoTab
              client={effectiveClient}
              onSubmit={onSubmit}
              onUpdate={onUpdate}
              isSaving={isSaving}
              onCreated={handleCreated}
              onUpdated={handleUpdated}
            />
          </TabsContent>

          <TabsContent value="context">
            <ContextTab
              client={effectiveClient ? { id: effectiveClient.id, plan: effectiveClient.plan } : null}
              onAccountsCreated={() => setActiveTab("voice")}
            />
          </TabsContent>

          <TabsContent value="voice">
            {effectiveClient && (
              <BrandVoiceForm
                clientId={effectiveClient.id}
                onNext={() => setActiveTab("accounts")}
                onSkip={() => setActiveTab("accounts")}
              />
            )}
          </TabsContent>

          <TabsContent value="accounts">
            <AccountsTab
              clientId={effectiveClient?.id ?? null}
              plan={effectiveClient?.plan ?? "basic"}
              isEdit={isEditMode}
            />
          </TabsContent>
        </Tabs>

        {isEditMode && activeTab === "accounts" && (
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">✅ Cambios guardados automáticamente</p>
            <Button className="gradient-primary" onClick={() => handleOpenChange(false)}>
              Guardar y Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
