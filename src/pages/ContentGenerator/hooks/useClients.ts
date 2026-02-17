// src/pages/ContentGenerator/hooks/useClients.ts
// Responsabilidad única: estado + handlers para lista de clientes

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  listClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/lib/api/clients";
import type {
  ClientProfile,
  ClientCreate,
  ClientUpdate,
  ClientListParams,
} from "@/lib/api/clients";

export function useClients() {
  const { toast } = useToast();

  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async (params?: ClientListParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listClients(params);
      setClients(result.data);
    } catch (e: unknown) {
      const msg = (e as Error).message;
      setError(msg);
      toast({ title: "Error cargando clientes", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleCreate = useCallback(async (payload: ClientCreate): Promise<ClientProfile | undefined> => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await createClient(payload);
      if (result.data) setClients((prev) => [result.data!, ...prev]);
      toast({ title: "✅ Cliente creado" });
      return result.data ?? undefined;
    } catch (e: unknown) {
      const msg = (e as Error).message;
      setError(msg);
      toast({ title: "Error creando cliente", description: msg, variant: "destructive" });
      return undefined;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const handleUpdate = useCallback(async (id: string, payload: ClientUpdate) => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await updateClient(id, payload);
      if (result.data) {
        setClients((prev) => prev.map((c) => (c.id === id ? result.data! : c)));
        if (selectedClient?.id === id) setSelectedClient(result.data);
      }
      toast({ title: "✅ Cliente actualizado" });
    } catch (e: unknown) {
      const msg = (e as Error).message;
      setError(msg);
      toast({ title: "Error actualizando cliente", description: msg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [selectedClient, toast]);

  const handleDelete = useCallback(async (id: string) => {
    setIsSaving(true);
    setError(null);
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      if (selectedClient?.id === id) setSelectedClient(null);
      toast({ title: "✅ Cliente eliminado" });
    } catch (e: unknown) {
      const msg = (e as Error).message;
      setError(msg);
      toast({ title: "Error eliminando cliente", description: msg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [selectedClient, toast]);

  const selectClient = useCallback((client: ClientProfile | null) => {
    setSelectedClient(client);
  }, []);

  return {
    clients, isLoading, isSaving, error,
    selectedClient, loadClients, handleCreate,
    handleUpdate, handleDelete, selectClient,
  };
}
