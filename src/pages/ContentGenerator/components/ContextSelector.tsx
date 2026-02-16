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
  brief?: string | null;
  isGeneratingBrief?: boolean;
  onGenerateBrief?: () => void;
  onSaveBrief?: (brief: string) => void;
}

export function ContextSelector({
  clientId,
  hasContext,
  context,
  isLoading,
  isSaving,
  onSave,
  onUpdate,
  brief,
  isGeneratingBrief,
  onGenerateBrief,
  onSaveBrief,
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

  if (hasContext && editMode && context) {
    return (
      <div className="space-y-3">
        <ContextOnboarding
          clientId={clientId}
          existingContext={context}
          isSaving={isSaving}
          brief={brief}
          isGeneratingBrief={isGeneratingBrief}
          onGenerateBrief={onGenerateBrief}
          onSaveBrief={onSaveBrief}
          onSave={(payload) => {
            onUpdate({
              business_name: payload.business_name,
              industry: payload.industry,
              business_description: payload.business_description,
              communication_tone: payload.communication_tone,
              primary_goal: payload.primary_goal,
              platforms: payload.platforms,
              website_url: payload.website_url,
              keywords: payload.keywords,
              forbidden_words: payload.forbidden_words,
              forbidden_topics: payload.forbidden_topics,
            });
            setEditMode(false);
          }}
        />
      </div>
    );
  }

  if (hasContext && context) {
    return <ContextBadge context={context} onEdit={() => setEditMode(true)} />;
  }

  return (
    <ContextOnboarding
      clientId={clientId}
      isSaving={isSaving}
      brief={brief}
      isGeneratingBrief={isGeneratingBrief}
      onGenerateBrief={onGenerateBrief}
      onSaveBrief={onSaveBrief}
      onSave={onSave}
    />
  );
}
