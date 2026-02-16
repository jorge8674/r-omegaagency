// src/pages/ContentGenerator/hooks/useClientContext.ts
// Responsabilidad única: estado + handlers del contexto de cliente

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  createClientContext,
  getClientContext,
  updateClientContext,
  generateClientBrief,
} from "@/lib/api/context";
import type {
  ClientContextData,
  ClientContextPayload,
  ClientContextUpdatePayload,
} from "@/lib/api/context";

interface UseClientContextReturn {
  context: ClientContextData | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasContext: boolean;
  loadContext: (clientId: string) => Promise<void>;
  handleCreate: (payload: ClientContextPayload) => Promise<void>;
  handleUpdate: (payload: ClientContextUpdatePayload) => Promise<void>;
  handleGenerateBrief: () => Promise<void>;
}

export function useClientContext(): UseClientContextReturn {
  const { toast } = useToast();

  const [context, setContext] = useState<ClientContextData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContext = useCallback(async (clientId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getClientContext(clientId);
      setContext(result.data);
      localStorage.setItem("omega_context_client_id", clientId);
    } catch (e: unknown) {
      const msg = (e as Error).message;
      setError(msg);
      setContext(null);
      toast({ title: "Error cargando contexto", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleCreate = useCallback(async (payload: ClientContextPayload) => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await createClientContext(payload);
      setContext(result.data);
      localStorage.setItem("omega_context_client_id", payload.client_id);
      toast({ title: "✅ Contexto creado" });
    } catch (e: unknown) {
      const msg = (e as Error).message;
      setError(msg);
      toast({ title: "Error creando contexto", description: msg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const handleUpdate = useCallback(async (payload: ClientContextUpdatePayload) => {
    if (!context) {
      setError("No hay contexto cargado para actualizar");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const result = await updateClientContext(context.client_id, payload);
      setContext(result.data);
      toast({ title: "✅ Contexto actualizado" });
    } catch (e: unknown) {
      const msg = (e as Error).message;
      setError(msg);
      toast({ title: "Error actualizando contexto", description: msg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [context, toast]);

  const handleGenerateBrief = useCallback(async () => {
    const id = localStorage.getItem("omega_client_id");
    if (!id) return;
    setIsSaving(true);
    try {
      const res = await generateClientBrief(id);
      if (res.data) {
        setContext(res.data);
        toast({ title: "✨ Brief generado", description: "Brief de marca creado con IA." });
      }
    } catch (e: unknown) {
      const msg = (e as Error).message;
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  return {
    context,
    isLoading,
    isSaving,
    error,
    hasContext: context !== null,
    loadContext,
    handleCreate,
    handleUpdate,
    handleGenerateBrief,
  };
}
