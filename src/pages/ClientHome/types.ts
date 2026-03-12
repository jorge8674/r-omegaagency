/* ClientHome types — API responses and shared interfaces */

export interface ClientProfile {
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

export interface SocialAccount {
  id: string;
  client_id: string;
  platform: string;
  username: string;
  connected: boolean;
  followers_count?: number;
  is_active: boolean;
}

export interface ScheduledPost {
  id: string;
  client_id: string;
  account_id: string;
  content_type: string;
  text_content: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
}

export interface ClientHomeStats {
  total_posts: number;
  connected_accounts: number;
  this_month_posts: number;
}

export interface ClientHomeData {
  profile: ClientProfile;
  social_accounts: SocialAccount[];
  upcoming_posts: ScheduledPost[];
  stats: ClientHomeStats;
}

export interface FeatureUsageData {
  posts_used: number;
  posts_limit: number | null;
  posts_pct: number;
  msgs_used: number;
  msgs_limit: number | null;
  msgs_pct: number;
  plan: string;
}

export interface UpsellPayload {
  client_id: string;
  current_plan: string;
  request_type: string;
  item_name: string;
  item_code: string;
  monthly_price: number;
  new_monthly_total: number;
  client_message?: string;
}
