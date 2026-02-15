/** Standard health-check response from Railway API */
export interface ApiHealthResponse {
  status: "healthy" | "unhealthy" | "degraded";
}

/** Agent status returned by /agent-status endpoints */
export interface AgentStatusResponse {
  agent: string;
  status: "active" | "idle" | "error";
  last_activity: string | null;
  capabilities: string[];
}

/** Standardized API error shape */
export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

/** Generic paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

/** Generic single-item API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** HTTP methods supported by the API client */
export type ApiMethod = "GET" | "POST" | "PATCH";
