import { useState, useCallback, useMemo } from "react";
import { addMonths, subMonths } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@/types/post";
import type {
  QueueItem, ScheduleFormValues, OptimalTimesResult,
} from "../types";
import { buildCalendarDays } from "../types";

export function useCalendar() {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  /* ─── Posts query ────────────────────────────────── */
  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data as Post[];
    },
  });

  /* ─── Queue query ───────────────────────────────── */
  const {
    data: queueRaw,
    isLoading: queueLoading,
    refetch: refetchQueue,
  } = useQuery({
    queryKey: ["scheduling-queue"],
    queryFn: () => api.getQueue("default") as Promise<
      QueueItem[] | { posts?: QueueItem[]; queue?: QueueItem[] }
    >,
    retry: 1,
  });

  const queueItems = useMemo<QueueItem[]>(() => {
    if (Array.isArray(queueRaw)) return queueRaw;
    if (queueRaw && typeof queueRaw === "object") {
      return (queueRaw as { posts?: QueueItem[]; queue?: QueueItem[] }).posts
        ?? (queueRaw as { queue?: QueueItem[] }).queue
        ?? [];
    }
    return [];
  }, [queueRaw]);

  /* ─── Calendar days ─────────────────────────────── */
  const days = useMemo(
    () => buildCalendarDays(currentMonth, posts),
    [currentMonth, posts],
  );

  /* ─── Navigation ────────────────────────────────── */
  const goToPrev = useCallback(() => setCurrentMonth((m) => subMonths(m, 1)), []);
  const goToNext = useCallback(() => setCurrentMonth((m) => addMonths(m, 1)), []);
  const goToToday = useCallback(() => setCurrentMonth(new Date()), []);

  /* ─── Schedule post ─────────────────────────────── */
  const [scheduling, setScheduling] = useState(false);

  const schedulePost = useCallback(async (form: ScheduleFormValues) => {
    setScheduling(true);
    try {
      await api.schedulePost({
        title: form.title,
        content: form.content,
        platform: form.platform,
        scheduled_at: form.scheduledAt || new Date().toISOString(),
        client_id: "default",
      });
      toast({ title: "Post agendado" });
      refetchQueue();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setScheduling(false);
    }
  }, [toast, refetchQueue]);

  /* ─── Approve post ──────────────────────────────── */
  const approvePost = useCallback(async (postId: string) => {
    try {
      await api.approvePost(postId);
      toast({ title: "Post aprobado" });
      refetchQueue();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  }, [toast, refetchQueue]);

  /* ─── Optimal times ─────────────────────────────── */
  const [fetchingOptimal, setFetchingOptimal] = useState(false);
  const [optimalResult, setOptimalResult] = useState<OptimalTimesResult | string | null>(null);

  const fetchOptimalTimes = useCallback(async (platform: string) => {
    setFetchingOptimal(true);
    try {
      const result = await api.optimalTimes(platform, "America/Mexico_City");
      setOptimalResult(result as OptimalTimesResult | string);
      toast({ title: "Horarios calculados" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setFetchingOptimal(false);
    }
  }, [toast]);

  return {
    currentMonth, days, postsLoading,
    queueItems, queueLoading,
    scheduling, schedulePost,
    approvePost,
    fetchingOptimal, optimalResult, fetchOptimalTimes,
    goToPrev, goToNext, goToToday,
  } as const;
}
