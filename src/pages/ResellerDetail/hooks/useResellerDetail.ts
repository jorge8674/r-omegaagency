import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("omega_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface ResellerDetailData {
  id: string;
  agency_name: string;
  owner_name: string;
  owner_email: string;
  slug: string;
  status: string;
  plan: string | null;
  white_label_active: boolean;
  omega_commission_rate: number;
  monthly_revenue_reported: number;
  stripe_account_id: string | null;
  setup_fee_paid: boolean;
  monthly_license: number;
  clients_count: number;
  created_at: string;
  phone: string | null;
  notes: string | null;
}

export interface ResellerClient {
  id: string;
  name: string;
  plan: string | null;
  active: boolean;
  email: string | null;
}

export interface ResellerActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
}

export interface ResellerStatsData {
  total_clients: number;
  active_clients: number;
  trial_clients: number;
  inactive_clients: number;
  mrr: number;
  commission_month: number;
  churn_rate: number;
  top_plan: string;
}

export function useResellerDetail(resellerId: string | undefined) {
  const h = authHeaders();

  const reseller = useQuery<ResellerDetailData>({
    queryKey: ["reseller-detail", resellerId],
    queryFn: async () => {
      const raw = await apiCall<Record<string, unknown>>(`/resellers/${resellerId}`, "GET", undefined, h);
      return {
        ...raw,
        plan: (raw.plan as string | null) ?? "starter",
        clients_count: (raw.clients_count as number) ?? 0,
        setup_fee_paid: (raw.setup_fee_paid as boolean) ?? false,
        monthly_license: (raw.monthly_license as number) ?? 0,
        phone: (raw.phone as string | null) ?? null,
        notes: (raw.notes as string | null) ?? null,
      } as ResellerDetailData;
    },
    enabled: !!resellerId,
    retry: 0,
  });

  const clients = useQuery<ResellerClient[]>({
    queryKey: ["reseller-clients", resellerId],
    queryFn: async () => {
      const res = await apiCall<{ data?: ResellerClient[]; clients?: ResellerClient[] }>(
        `/resellers/${resellerId}/clients`, "GET", undefined, h,
      );
      return res?.data ?? res?.clients ?? [];
    },
    enabled: !!resellerId,
    retry: 0,
  });

  const stats = useQuery<ResellerStatsData>({
    queryKey: ["reseller-stats", resellerId],
    queryFn: () => apiCall<ResellerStatsData>(`/resellers/${resellerId}/stats`, "GET", undefined, h),
    enabled: !!resellerId,
    retry: 0,
  });

  const activity = useQuery<ResellerActivityItem[]>({
    queryKey: ["reseller-activity", resellerId],
    queryFn: async () => {
      const res = await apiCall<{ data?: ResellerActivityItem[] }>(
        `/resellers/${resellerId}/activity`, "GET", undefined, h,
      );
      return Array.isArray(res?.data) ? res.data : [];
    },
    enabled: !!resellerId,
    retry: 0,
  });

  return { reseller, clients, stats, activity };
}
