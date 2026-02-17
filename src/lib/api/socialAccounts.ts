import { apiCall } from "./core";

export type Platform = "instagram" | "facebook" | "tiktok" | "twitter" | "linkedin" | "youtube" | "pinterest";

export interface SocialAccountProfile {
  id: string;
  client_id: string;
  platform: Platform;
  username: string;
  profile_url: string | null;
  context_id: string | null;
  scraping_enabled: boolean;
  scraped_data: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialAccountCreate {
  client_id: string;
  platform: string;
  username: string;
  profile_url?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string | null;
}

interface ListResponse {
  success: boolean;
  data: SocialAccountProfile[];
  total: number;
  message?: string;
}

export async function listSocialAccounts(clientId: string): Promise<ListResponse> {
  return apiCall<ListResponse>(`/social-accounts/?client_id=${clientId}`);
}

export async function createSocialAccount(accountData: SocialAccountCreate): Promise<ApiResponse<SocialAccountProfile>> {
  const { client_id, ...body } = accountData;
  return apiCall<ApiResponse<SocialAccountProfile>>(
    `/social-accounts/?client_id=${client_id}`,
    "POST",
    body as unknown as Record<string, unknown>
  );
}

export async function deleteSocialAccount(accountId: string): Promise<ApiResponse<{ deleted: boolean }>> {
  return apiCall<ApiResponse<{ deleted: boolean }>>(
    `/social-accounts/${accountId}/`,
    "DELETE"
  );
}

// --- Context-aware endpoints ---

export interface ContextData {
  business_name: string;
  industry: string;
  description?: string;
  website_url?: string;
  keywords: string[];
  forbidden_words: string[];
  forbidden_topics: string[];
  tones: string[];
  goals: string[];
}

export interface SocialAccountWithContextCreate {
  client_id: string;
  platform: Platform;
  username: string;
  profile_url?: string;
  context: ContextData;
}

export interface SocialAccountWithContextUpdate {
  username?: string;
  profile_url?: string;
  context?: ContextData;
}

export async function createAccountWithContext(
  data: SocialAccountWithContextCreate
): Promise<ApiResponse<SocialAccountProfile>> {
  return apiCall<ApiResponse<SocialAccountProfile>>(
    "/social-accounts/with-context/",
    "POST",
    data as unknown as Record<string, unknown>
  );
}

export async function updateAccountWithContext(
  accountId: string,
  data: SocialAccountWithContextUpdate
): Promise<ApiResponse<SocialAccountProfile>> {
  return apiCall<ApiResponse<SocialAccountProfile>>(
    `/social-accounts/with-context/${accountId}/`,
    "PATCH",
    data as unknown as Record<string, unknown>
  );
}

export async function getAccountWithContext(
  accountId: string
): Promise<ApiResponse<SocialAccountProfile & { context: ContextData }>> {
  return apiCall<ApiResponse<SocialAccountProfile & { context: ContextData }>>(
    `/social-accounts/${accountId}/`
  );
}
