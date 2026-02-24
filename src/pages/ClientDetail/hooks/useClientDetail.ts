import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";

export interface ClientDetailData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  plan: string | null;
  active: boolean;
  notes: string | null;
  organization_id: string;
  reseller_id: string | null;
  created_at: string;
  assigned_to: string | null;
  monthly_budget_total: number | null;
  stripe_customer_id: string | null;
  trial_active: boolean | null;
  trial_ends_at: string | null;
}

export interface ClientAgent {
  id: string;
  name: string;
  type: string;
  status: string;
  last_used: string | null;
  executions: number;
}

export interface ClientContentItem {
  id: string;
  type: string;
  platform: string;
  agent: string | null;
  created_at: string;
  status: string;
  title: string;
}

export interface ClientActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
}

export function useClientDetail(clientId: string | undefined) {
  const client = useQuery<ClientDetailData>({
    queryKey: ["client-detail", clientId],
    queryFn: async () => {
      const raw = await apiCall<Record<string, unknown>>(`/clients/${clientId}/`);
      return {
        ...raw,
        company: (raw.business_name as string | null) ?? (raw.company as string | null) ?? null,
        active: raw.active === true || raw.status === "active",
      } as ClientDetailData;
    },
    enabled: !!clientId,
    retry: 0,
  });

  const agents = useQuery<ClientAgent[]>({
    queryKey: ["client-agents", clientId],
    queryFn: async () => {
      const res = await apiCall<{ data?: ClientAgent[] }>(`/clients/${clientId}/agents/`);
      return Array.isArray(res?.data) ? res.data : [];
    },
    enabled: !!clientId,
    retry: 0,
  });

  const content = useQuery<ClientContentItem[]>({
    queryKey: ["client-content", clientId],
    queryFn: async () => {
      const res = await apiCall<{ data?: ClientContentItem[] }>(`/clients/${clientId}/content/`);
      return Array.isArray(res?.data) ? res.data : [];
    },
    enabled: !!clientId,
    retry: 0,
  });

  const activity = useQuery<ClientActivityItem[]>({
    queryKey: ["client-activity", clientId],
    queryFn: async () => {
      const res = await apiCall<{ data?: ClientActivityItem[] }>(`/clients/${clientId}/activity/`);
      return Array.isArray(res?.data) ? res.data : [];
    },
    enabled: !!clientId,
    retry: 0,
  });

  return { client, agents, content, activity };
}
