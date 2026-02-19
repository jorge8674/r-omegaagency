import { useState, useCallback } from "react";
import { apiCall } from "@/lib/api/core";
import { useToast } from "@/hooks/use-toast";
import type { ScheduledPost, SchedulePostRequest } from "@/lib/api/calendar";

interface BlocksState {
  items: ScheduledPost[];
  loading: boolean;
}

export function useCalendarBlocks() {
  const { toast } = useToast();
  const [state, setState] = useState<BlocksState>({ items: [], loading: false });
  const [submitting, setSubmitting] = useState(false);

  const fetchBlocks = useCallback(async (
    accountId?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
  ): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const params = new URLSearchParams();
      if (accountId) params.set("account_id", accountId);
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
      if (status) params.set("status", status);
      const res = await apiCall<{ data: ScheduledPost[] }>(
        `/calendar/?${params.toString()}`,
      );
      setState({ items: res.data ?? [], loading: false });
    } catch {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const scheduleBlock = useCallback(async (
    req: SchedulePostRequest,
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      await apiCall("/calendar/schedule/", "POST", req as unknown as Record<string, unknown>);
      toast({ title: "Bloque agendado ✓" });
      setSubmitting(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ title: "Error", description: msg, variant: "destructive" });
      setSubmitting(false);
      return false;
    }
  }, [toast]);

  const confirmBlock = useCallback(async (blockId: string): Promise<boolean> => {
    try {
      await apiCall(`/calendar/${blockId}/`, "PATCH", { status: "scheduled" });
      toast({ title: "Bloque confirmado" });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      toast({ title: "Error", description: msg, variant: "destructive" });
      return false;
    }
  }, [toast]);

  const deleteBlock = useCallback(async (blockId: string): Promise<boolean> => {
    try {
      await apiCall(`/calendar/${blockId}/`, "DELETE");
      toast({ title: "Bloque eliminado" });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      toast({ title: "Error", description: msg, variant: "destructive" });
      return false;
    }
  }, [toast]);

  return {
    blocks: state.items,
    blocksLoading: state.loading,
    submitting,
    fetchBlocks,
    scheduleBlock,
    confirmBlock,
    deleteBlock,
  };
}
