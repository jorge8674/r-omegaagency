import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";

interface ClientHomeStats {
  total_posts: number;
  connected_accounts: number;
  this_month_posts: number;
}

interface ClientProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  plan: string;
  role: string;
  status: string;
  subscription_status: string;
  trial_active: boolean;
  trial_ends_at?: string;
  reseller_id?: string;
  avatar_url?: string;
  stripe_customer_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface SocialAccount {
  id: string;
  client_id: string;
  platform: string;
  username: string;
  connected: boolean;
  access_token?: string;
  access_token_secret?: string;
  followers_count?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ScheduledPost {
  id: string;
  client_id: string;
  account_id: string;
  content_lab_id?: string;
  content_type: string;
  text_content: string;
  image_url?: string;
  hashtags?: string[];
  scheduled_date: string;
  scheduled_time: string;
  timezone: string;
  status: string;
  agent_assigned?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ClientHomeData {
  profile: ClientProfile;
  social_accounts: SocialAccount[];
  upcoming_posts: ScheduledPost[];
  stats: ClientHomeStats;
}

interface ClientHomeResponse {
  success: boolean;
  data: ClientHomeData;
  message?: string;
  error?: string;
}

export function useClientHome(clientId: string) {
  return useQuery<ClientHomeData>({
    queryKey: ["client-home", clientId],
    queryFn: async () => {
      const response = await apiCall<ClientHomeResponse>(`/clients/${clientId}/home/`);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to load client home");
      }
      return response.data;
    },
    enabled: !!clientId,
    refetchInterval: 60000, // Refetch every 60 seconds
    retry: 1,
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}
