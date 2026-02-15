import { apiCall } from "./core";
import type {
  ResellerBase,
  ResellerListResponse,
  ResellerCreateRequest,
  ResellerStatusUpdate,
  ResellerDashboardResponse,
  ResellerBrandingPayload,
} from "@/types/api-resellers.types";

// ─── Auth helper (reads JWT from localStorage) ──────────
const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("omega_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Reseller CRUD ──────────────────────────────────────
export const resellersApi = {
  getAll: () =>
    apiCall<ResellerListResponse>("/resellers/all", "GET", undefined, authHeaders()),

  getById: (id: string) =>
    apiCall<ResellerBase>(`/resellers/${id}`, "GET", undefined, authHeaders()),

  create: (data: ResellerCreateRequest) =>
    apiCall<ResellerBase>("/resellers/create", "POST", data as unknown as Record<string, unknown>, authHeaders()),

  updateStatus: (id: string, update: ResellerStatusUpdate) =>
    apiCall<ResellerBase>(`/resellers/${id}/status`, "PATCH", update as unknown as Record<string, unknown>, authHeaders()),

  // ─── Dashboard ──────────────────────────────────────
  getDashboard: (id: string) =>
    apiCall(`/resellers/${id}/dashboard`, "GET", undefined, authHeaders()),

  // ─── Branding ───────────────────────────────────────
  getBranding: (id: string) =>
    apiCall<ResellerBrandingPayload>(`/resellers/${id}/branding`, "GET", undefined, authHeaders()),

  saveBranding: (id: string, payload: Record<string, unknown>) =>
    apiCall<ResellerBrandingPayload>(`/resellers/${id}/branding`, "POST", payload, authHeaders()),

  uploadHeroMedia: async (id: string, file: File): Promise<{ url: string }> => {
    const token = localStorage.getItem("omega_token");
    const formData = new FormData();
    formData.append("file", file);
    const base = import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1";
    const res = await fetch(`${base}/resellers/${id}/upload-hero-media`, {
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
    apiCall(`/resellers/${id}/clients`, "GET", undefined, authHeaders()),

  // ─── Public (no auth) ─────────────────────────────────
  getBySlug: (slug: string) =>
    apiCall(`/resellers/slug/${slug}`),

  // ─── Leads ──────────────────────────────────────────
  getLeads: (id: string) =>
    apiCall(`/resellers/${id}/leads`, "GET", undefined, authHeaders()),

  createLead: (id: string, data: Record<string, unknown>) =>
    apiCall(`/resellers/${id}/leads`, "POST", data, authHeaders()),

  getLead: (leadId: string) =>
    apiCall(`/resellers/leads/${leadId}`, "GET", undefined, authHeaders()),

  updateLead: (leadId: string, data: Record<string, unknown>) =>
    apiCall(`/resellers/leads/${leadId}/status`, "PATCH", data, authHeaders()),
};
