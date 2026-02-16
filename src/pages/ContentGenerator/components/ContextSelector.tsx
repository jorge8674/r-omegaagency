// src/pages/ContentGenerator/components/ContextSelector.tsx
// Responsabilidad única: Orquesta vista de contexto (badge/onboarding)

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ContextBadge } from "./ContextBadge";
import { ContextOnboarding } from "./ContextOnboarding";
import type {
  ClientContextData,
  ClientContextPayload,
  ClientContextUpdatePayload,
} from "@/lib/api/context";

interface Props {
  clientId: string;
  hasContext: boolean;
  context: ClientContextData | null;
  isLoading: boolean;
  isSaving: boolean;
  onLoadContext: (clientId: string) => void;
  onSave: (payload: ClientContextPayload) => void;
  onUpdate: (payload: ClientContextUpdatePayload) => void;
}

export function ContextSelector({
  clientId,
  hasContext,
  context,
  isLoading,
  isSaving,
  onSave,
  onUpdate,
}: Props) {
  const [editMode, setEditMode] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  // Modo edición: mostrar formulario con datos existentes
  if (hasContext && editMode && context) {
    return (
      <div className="space-y-3">
        <ContextOnboarding
          clientId={clientId}
          existingContext={context}
          isSaving={isSaving}
          onSave={(payload) => {
            onUpdate({
              business_name: payload.business_name,
              industry: payload.industry,
              business_description: payload.business_description,
              communication_tone: payload.communication_tone,
              primary_goal: payload.primary_goal,
              platforms: payload.platforms,
              website_url: payload.website_url,
            });
            setEditMode(false);
          }}
        />
      </div>
    );
  }

  // Contexto existe: mostrar badge
  if (hasContext && context) {
    return <ContextBadge context={context} onEdit={() => setEditMode(true)} />;
  }

  // Sin contexto: crear nuevo
  return (
    <ContextOnboarding
      clientId={clientId}
      isSaving={isSaving}
      onSave={onSave}
    />
  );
}
