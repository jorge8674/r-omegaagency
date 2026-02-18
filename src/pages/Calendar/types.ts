import type { Post } from "@/types/post";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isToday,
} from "date-fns";

/* ─── Status colors (semantic tokens) ─────────────── */

export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted-foreground",
  scheduled: "bg-primary",
  published: "bg-success",
  failed: "bg-destructive",
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  scheduled: "Programado",
  published: "Publicado",
  failed: "Fallido",
};

/* ─── Platforms ───────────────────────────────────── */

export const PLATFORMS = [
  "instagram", "tiktok", "facebook", "twitter", "linkedin",
] as const;

export type Platform = (typeof PLATFORMS)[number];

/* ─── Calendar day cell ──────────────────────────── */

export interface CalendarDayData {
  date: Date;
  inMonth: boolean;
  today: boolean;
  posts: Post[];
}

/* ─── Queue item (from backend) ──────────────────── */

export interface QueueItem {
  id?: string;
  title?: string;
  content?: string;
  platform: string;
  scheduled_at?: string;
  status?: string;
}

/* ─── Optimal times result ───────────────────────── */

export interface OptimalTimesResult {
  slots: Array<{ hour: number; score: number }>;
  platform: string;
  timezone: string;
}

/* ─── Schedule form values ───────────────────────── */

export interface ScheduleFormValues {
  title: string;
  content: string;
  platform: Platform;
  scheduledAt: string;
}

/* ─── Pure helpers ────────────────────────────────── */

export function buildCalendarDays(
  currentMonth: Date,
  posts: Post[],
): CalendarDayData[] {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  return days.map((day) => ({
    date: day,
    inMonth: isSameMonth(day, currentMonth),
    today: isToday(day),
    posts: posts.filter((p) => {
      const d = p.scheduled_at ? new Date(p.scheduled_at) : new Date(p.created_at);
      return isSameDay(d, day);
    }),
  }));
}

export const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
