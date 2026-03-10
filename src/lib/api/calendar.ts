import { apiCall } from "./core";

/* ─── Types ──────────────────────────────────────── */

export type ScheduleContentType = "post" | "story" | "reel" | "carousel";
export type ScheduleStatus = "draft" | "scheduled" | "publishing" | "published" | "failed";

export interface ScheduledPost {
  id: string;
  client_id: string;
  account_id: string;
  content_lab_id: string | null;
  content_type: ScheduleContentType;
  text_content: string;
  image_url: string | null;
  hashtags: string[];
  scheduled_date: string;
  scheduled_time: string;
  timezone: string;
  status: ScheduleStatus;
  is_active: boolean;
  platform_post_id: string | null;
  published_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface SchedulePostRequest {
  account_id: string;
  content_lab_id?: string;
  content_type: ScheduleContentType;
  text_content: string;
  image_url?: string;
  hashtags: string[];
  scheduled_date: string;
  scheduled_time: string;
  timezone?: string;
}

interface ScheduleResponse {
  success: boolean;
  data?: ScheduledPost;
  message?: string;
}

interface ListScheduleResponse {
  success: boolean;
  data?: ScheduledPost[];
  items?: ScheduledPost[];
  total: number;
}

/* ─── API calls ──────────────────────────────────── */

export async function scheduleCalendarPost(
  request: SchedulePostRequest,
): Promise<ScheduleResponse> {
  return apiCall<ScheduleResponse>("/calendar/schedule/", "POST", request as unknown as Record<string, unknown>);
}

export async function listScheduledPosts(
  accountId?: string,
  clientId?: string,
  startDate?: string,
  endDate?: string,
): Promise<ListScheduleResponse> {
  const params = new URLSearchParams();
  if (accountId) params.set("account_id", accountId);
  if (clientId) params.set("client_id", clientId);
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  params.set("limit", "100");
  return apiCall<ListScheduleResponse>(`/calendar/?${params.toString()}`);
}

export async function deleteScheduledPost(
  postId: string,
): Promise<ScheduleResponse> {
  return apiCall<ScheduleResponse>(`/calendar/${postId}/`, "DELETE");
}
