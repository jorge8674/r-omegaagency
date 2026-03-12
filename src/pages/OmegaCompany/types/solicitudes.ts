export interface SolicitudResponse {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  current_plan: string;
  request_type: string;
  item_name: string;
  item_code: string;
  monthly_price: number;
  new_monthly_total: number;
  client_message: string | null;
  status: string;
  stripe_charge_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface SolicitudesListResponse {
  success: boolean;
  data: SolicitudResponse[];
  total: number;
  pending_count: number;
  monthly_revenue_upsell: number;
}

export interface SolicitudActionResponse {
  success: boolean;
  data: SolicitudResponse;
  stripe_charge_id?: string;
  message: string;
}

export const PLAN_LABELS: Record<string, string> = {
  basic: "Plan Básico · $2,500/mes",
  pro: "Nova Dedicada · $5,000/mes",
  enterprise: "Company · $10,000+/mes",
};

export const REQUEST_TYPE_LABELS: Record<string, string> = {
  individual_agent: "Agente individual",
  full_department: "Departamento completo",
};
