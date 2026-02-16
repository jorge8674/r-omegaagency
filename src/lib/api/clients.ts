// src/lib/api/clients.ts

import { apiCall } from "./core";

// ── Literal types ───────────────────────────────────────

export type ClientPlan = "basic" | "pro" | "enterprise";
export type ClientStatus = "active" | "inactive" | "deleted" | "suspended";
export type SubscriptionStatus = "trial" | "active" | "past_due" | "canceled";
export type ClientRole = "owner" | "reseller" | "client";

// ── Data types ──────────────────────────────────────────

export interface ClientProfile {
  id: string;
  email: string;
  name: string;
  role: ClientRole;
  phone?: string | null;
  company?: string | null;
  plan: ClientPlan;
  status: ClientStatus;
  subscription_status: SubscriptionStatus;
  trial_active: boolean;
  trial_ends_at?: string | null;
  notes?: string | null;
  reseller_id?: string | null;
  avatar_url?: string | null;
  stripe_customer_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientCreate {
  email: string;
  name: string;
  password: string;
  phone?: string | null;
  company?: string | null;
  plan?: ClientPlan;
  notes?: string | null;
  reseller_id?: string | null;
}

export interface ClientUpdate {
  name?: string;
  phone?: string | null;
  company?: string | null;
  plan?: ClientPlan;
  notes?: string | null;
  status?: ClientStatus;
  subscription_status?: SubscriptionStatus;
  trial_active?: boolean;
}

// ── Response wrappers ───────────────────────────────────

export interface ClientListResponse {
  success: boolean;
  data: ClientProfile[];
  total: number;
  message?: string;
}

export interface ClientResponse {
  success: boolean;
  data?: ClientProfile;
  message?: string;
  error?: string;
}

// ── Query params ────────────────────────────────────────

export interface ClientListParams {
  status?: ClientStatus;
  plan?: ClientPlan;
  search?: string;
}

// ── API functions ───────────────────────────────────────

export function listClients(
  params?: ClientListParams
): Promise<ClientListResponse> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.plan) query.set("plan", params.plan);
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return apiCall<ClientListResponse>(`/clients/${qs ? `?${qs}` : ""}`);
}

export function createClient(
  payload: ClientCreate
): Promise<ClientResponse> {
  return apiCall<ClientResponse>("/clients/", "POST", payload as unknown as Record<string, unknown>);
}

export function getClient(
  clientId: string
): Promise<ClientResponse> {
  return apiCall<ClientResponse>(`/clients/${clientId}`);
}

export function updateClient(
  clientId: string,
  payload: ClientUpdate
): Promise<ClientResponse> {
  return apiCall<ClientResponse>(`/clients/${clientId}`, "PATCH", payload as unknown as Record<string, unknown>);
}

export function deleteClient(
  clientId: string
): Promise<ClientResponse> {
  return apiCall<ClientResponse>(`/clients/${clientId}`, "DELETE");
}
