import { apiCall, API_BASE } from "./core";
import type {
  ResellerBase,
  ResellerListResponse,
  ResellerCreateRequest,
  ResellerStatusUpdate,
  ResellerDashboardResponse,
  ResellerBrandingPayload,
} from "@/types/api-resellers.types";

// ─── Reseller CRUD ──────────────────────────────────────
export const resellersApi = {
  getAll: () =>
    apiCall<ResellerListResponse>("/resellers/all"),

  getById: (id: string) =>
    apiCall<ResellerBase>(`/resellers/${id}/`),

  create: (data: ResellerCreateRequest) =>
    apiCall<ResellerBase>("/resellers/create", "POST", data as unknown as Record<string, unknown>),

  updateStatus: (id: string, update: ResellerStatusUpdate) =>
    apiCall<ResellerBase>(`/resellers/${id}/status`, "PATCH", update as unknown as Record<string, unknown>),

  // ─── Dashboard ──────────────────────────────────────
  getDashboard: (id: string) =>
    apiCall(`/resellers/${id}/dashboard`),

  // ─── Branding ───────────────────────────────────────
  getBranding: (id: string) =>
    apiCall<ResellerBrandingPayload>(`/resellers/${id}/branding`),

  saveBranding: (id: string, payload: Record<string, unknown>) =>
    apiCall<ResellerBrandingPayload>(`/resellers/${id}/branding`, "POST", payload),

  uploadHeroMedia: async (id: string, file: File): Promise<{ url: string }> => {
    const token = localStorage.getItem("omega_token");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/resellers/${id}/upload-hero-media`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    const data = await res.json();
    return { url: data?.url || data?.data?.url || data?.hero_media_url || "" };
  },

  // ─── Clients under reseller ─────────────────────────
  getClients: (id: string) =>
    apiCall(`/resellers/${id}/clients`),

  // ─── Public (no auth) ─────────────────────────────────
  getBySlug: (slug: string) =>
    apiCall(`/resellers/slug/${slug}`),

  // ─── Leads ──────────────────────────────────────────
  getLeads: (id: string) =>
    apiCall(`/resellers/${id}/leads`),

  createLead: (id: string, data: Record<string, unknown>) =>
    apiCall(`/resellers/${id}/leads`, "POST", data),

  getLead: (leadId: string) =>
    apiCall(`/resellers/leads/${leadId}`),

  updateLead: (leadId: string, data: Record<string, unknown>) =>
    apiCall(`/resellers/leads/${leadId}/status`, "PATCH", data),
};