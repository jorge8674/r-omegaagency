// ─── Content ──────────────────────────────────────────────
export interface CaptionRequest {
  topic: string;
  platform: string;
  tone: string;
}

export interface ImageGenerationRequest {
  prompt: string;
}

export interface HashtagRequest {
  topic: string;
  platform: string;
}

export interface VideoScriptRequest {
  topic: string;
  duration_seconds: number;
  platform: string;
}

// ─── Strategy ─────────────────────────────────────────────
export interface CalendarCreateRequest {
  client_id: string;
  month: string;
  platforms: string[];
  content_pillars: string[];
}

export interface TimingOptimizeRequest {
  platform: string;
  audience_timezone: string;
  historical_performance: MetricsSnapshot[];
}

export interface StrategyAnalyzeRequest {
  current_strategy: string;
  goals: string[];
  platform: string;
}

// ─── Analytics ────────────────────────────────────────────
export interface MetricsSnapshot {
  followers: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface HistoricalDataPoint extends MetricsSnapshot {
  date: string;
}

export interface ForecastRequest {
  historical_data: HistoricalDataPoint[];
  days_ahead: number;
}

export interface DashboardDataRequest {
  client_id: string;
  date_range?: string;
}

// ─── Engagement ───────────────────────────────────────────
export interface CommentResponseRequest {
  comment: string;
  platform: string;
  brand_voice: string;
}

export interface CommentAnalysisRequest {
  comment: string;
}

export interface CrisisDetectionRequest {
  comments: string[];
}

// ─── Brand Voice ──────────────────────────────────────────
export type ToneType = "professional" | "casual" | "friendly" | "authoritative" | "playful";
export type EmojiUsage = "none" | "minimal" | "moderate" | "heavy";

export interface BrandProfile {
  client_id: string;
  brand_name: string;
  tone: ToneType;
  personality_traits: string[];
  forbidden_words: string[];
  required_keywords: string[];
  emoji_usage: EmojiUsage;
  formality_level: number;
  sample_posts: string[];
}

export interface ContentValidationRequest {
  content: string;
  brand_profile: BrandProfile;
}

export interface BrandProfileCreateRequest {
  client_name: string;
  brand_description: string;
  sample_posts: string[];
}

// ─── Competitive ──────────────────────────────────────────
export interface CompetitorData {
  name: string;
  platform: string;
  url: string;
}

export type PostingFrequency = "daily" | "3x_week" | "weekly" | "biweekly";
export type TrendVelocity = "rising" | "stable" | "declining";
export type RiskLevel = "safe" | "moderate" | "risky";

export interface CompetitorProfile {
  competitor_name: string;
  platform: string;
  estimated_followers: number | null;
  avg_engagement_rate: number | null;
  posting_frequency: PostingFrequency;
  content_types: string[];
  top_hashtags: string[];
  best_performing_topics: string[];
  peak_posting_hours: number[];
}

export interface TrendItem {
  topic: string;
  platform: string;
  trend_score: number;
  velocity: TrendVelocity;
  estimated_lifespan: string;
  relevant_hashtags: string[];
  content_angle: string;
  risk_level: RiskLevel;
  audience_alignment: number;
}

export interface ViralityPredictRequest {
  content_description: string;
  platform: string;
  target_audience: string;
}

// ─── Crisis ───────────────────────────────────────────────
export interface CrisisSignals {
  platform: string;
  negative_comment_percentage: number;
  complaint_velocity: number;
  reach_of_negative_content: number;
  media_involvement: boolean;
  influencer_involvement: boolean;
}

export interface CrisisStatementRequest {
  crisis_type: string;
  severity: string;
  brand_name: string;
  context: string;
}

export interface CrisisRecoveryRequest {
  assessment: CrisisAssessment;
}

export interface CrisisAssessment {
  severity_level: "low" | "medium" | "high" | "critical";
  recommended_actions: string[];
  estimated_duration: string;
}

// ─── Scheduling ───────────────────────────────────────────
export interface SchedulePostRequest {
  client_id: string;
  content: string;
  platform: string;
  scheduled_at: string;
}

export interface OptimalTimesRequest {
  platform: string;
  audience_timezone: string;
  content_type: string;
}

// ─── A/B Testing ──────────────────────────────────────────
export interface ExperimentDesignRequest {
  hypothesis: string;
  variable: string;
  base_content: { type: string; description: string };
  platform: string;
}

export interface ExperimentResultsRequest {
  experiment: ExperimentData;
}

export interface ExperimentData {
  id: string;
  variant_a_metrics: MetricsSnapshot;
  variant_b_metrics: MetricsSnapshot;
}

// ─── Growth ───────────────────────────────────────────────
export interface QuickWinsRequest {
  account_data: {
    niche: string;
    followers: number;
    engagement_rate: number;
    posting_frequency: PostingFrequency;
  };
  platform: string;
}

// ─── Video ────────────────────────────────────────────────
export interface VideoIdeasRequest {
  niche: string;
  platform: string;
  content_pillars: string[];
}

// ─── Reports ──────────────────────────────────────────────
export interface MonthlyReportRequest {
  client_name: string;
  metrics_data: MetricsSnapshot;
  previous_period_data: MetricsSnapshot;
  agency_notes: string;
}
