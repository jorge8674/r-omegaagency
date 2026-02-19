import { useState, useCallback, useMemo } from "react";
import { addMonths, subMonths } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/lib/api";
import { listScheduledPosts } from "@/lib/api/calendar";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@/types/post";
import type { QueueItem, ScheduleFormValues, OptimalTimesResult } from "../types";
import { buildCalendarDays } from "../types";

export function useCalendar() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchParams] = useSearchParams();

  /* ─── Prefilled from Content Lab ───────────────── */
  const prefilledContentId = searchParams.get("content_id");
  const prefilledAccountId = searchParams.get("account_id");
  const prefilledContentType = searchParams.get("content_type");
  const prefilledText = searchParams.get("text");
  const prefilledTab = searchParams.get("tab");

  /* ─── Local posts (Supabase) ───────────────────── */
  const { data: localPosts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts").select("*").order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data as Post[];
    },
  });

  /* ─── Scheduled posts (Railway API) ────────────── */
  const { data: apiPosts = [] } = useQuery<Post[]>({
    queryKey: ["calendar-api-posts"],
    queryFn: async () => {
      const res = await listScheduledPosts();
      const posts = res.data ?? res.items ?? [];
      return posts.map((sp) => ({
        id: sp.id,
        organization_id: "",
        title: sp.text_content.slice(0, 40) || sp.content_type,
        body: sp.text_content,
        platform: sp.content_type,
        status: sp.status,
        scheduled_at: `${sp.scheduled_date}T${sp.scheduled_time}`,
        published_at: sp.published_at,
        created_at: sp.created_at,
        updated_at: sp.updated_at,
      }));
    },
    retry: 1,
  });

  /* ─── Merge & deduplicate ──────────────────────── */
  const allPosts = useMemo(() => {
    const ids = new Set(localPosts.map(p => p.id));
    return [...localPosts, ...apiPosts.filter(p => !ids.has(p.id))];
  }, [localPosts, apiPosts]);

  /* ─── Queue query ───────────────────────────────── */
  const { data: queueRaw, isLoading: queueLoading, refetch: refetchQueue } = useQuery({
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
        ?? (queueRaw as { queue?: QueueItem[] }).queue ?? [];
    }
    return [];
  }, [queueRaw]);

  /* ─── Calendar days ─────────────────────────────── */
  const days = useMemo(() => buildCalendarDays(currentMonth, allPosts), [currentMonth, allPosts]);

  /* ─── Navigation ────────────────────────────────── */
  const goToPrev = useCallback(() => setCurrentMonth(m => subMonths(m, 1)), []);
  const goToNext = useCallback(() => setCurrentMonth(m => addMonths(m, 1)), []);
  const goToToday = useCallback(() => setCurrentMonth(new Date()), []);

  /* ─── Refetch calendar (called after schedule) ─── */
  const refetchCalendar = useCallback(() => {
    void qc.invalidateQueries({ queryKey: ["calendar-api-posts"] });
    void qc.invalidateQueries({ queryKey: ["posts"] });
  }, [qc]);

  /* ─── Schedule post ─────────────────────────────── */
  const [scheduling, setScheduling] = useState(false);

  const schedulePost = useCallback(async (form: ScheduleFormValues) => {
    setScheduling(true);
    try {
      await api.schedulePost({
        title: form.title, content: form.content,
        platform: form.platform,
        scheduled_at: form.scheduledAt || new Date().toISOString(),
        client_id: "default",
      });
      toast({ title: "Post agendado" });
      refetchQueue(); refetchCalendar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally { setScheduling(false); }
  }, [toast, refetchQueue, refetchCalendar]);

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
    } finally { setFetchingOptimal(false); }
  }, [toast]);

  return {
    currentMonth, days, postsLoading,
    queueItems, queueLoading,
    scheduling, schedulePost, approvePost,
    fetchingOptimal, optimalResult, fetchOptimalTimes,
    goToPrev, goToNext, goToToday, refetchCalendar,
    prefilledTab, prefilledText, prefilledContentId,
    prefilledAccountId, prefilledContentType,
  } as const;
}
