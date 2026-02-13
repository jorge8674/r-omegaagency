const API_BASE = import.meta.env.VITE_API_URL || 'https://omegaraisen-production.up.railway.app/api/v1';

async function apiCall<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
  }
  return response.json();
}

// Health check (root, not under /api/v1)
export async function checkBackendHealth(): Promise<{ status: string }> {
  try {
    const base = API_BASE.replace('/api/v1', '');
    const res = await fetch(`${base}/health`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error('unhealthy');
    return res.json();
  } catch {
    return { status: 'unhealthy' };
  }
}

export const api = {
  // ─── Health ─────────────────────────────────────────────
  health: () => checkBackendHealth(),

  // ─── Content ────────────────────────────────────────────
  generateCaption: (prompt: string, platform: string, tone: string) =>
    apiCall('/content/generate-caption', 'POST', { topic: prompt, platform, tone }),
  // v2 - prompt fix
  generateImage: (topic: string) =>
    apiCall('/content/generate-image', 'POST', { prompt: topic }),
  generateHashtags: (content: string, platform: string) =>
    apiCall('/content/generate-hashtags', 'POST', { topic: content, platform }),
  generateVideoScript: (topic: string, duration: number, platform: string) =>
    apiCall('/content/generate-video-script', 'POST', { topic, duration_seconds: duration, platform }),
  contentAgentStatus: () => apiCall('/content/agent-status'),

  // ─── Strategy ───────────────────────────────────────────
  createCalendar: (data: Record<string, unknown>) =>
    apiCall('/strategy/create-calendar', 'POST', data),
  optimizeTiming: (data: Record<string, unknown>) =>
    apiCall('/strategy/optimize-timing', 'POST', data),
  analyzeStrategy: (data: Record<string, unknown>) =>
    apiCall('/strategy/analyze-strategy', 'POST', data),
  strategyAgentStatus: () => apiCall('/strategy/agent-status'),

  // ─── Analytics ──────────────────────────────────────────
  analyzeMetrics: (metricsJson: Record<string, unknown> | string) =>
    apiCall('/analytics/analyze-metrics', 'POST', {
      data: typeof metricsJson === 'string' ? JSON.parse(metricsJson) : metricsJson,
    }),
  generateInsights: (metricsJson: Record<string, unknown> | string) =>
    apiCall('/analytics/generate-insights', 'POST', {
      metrics: typeof metricsJson === 'string' ? JSON.parse(metricsJson) : metricsJson,
    }),
  forecast: (metricsJson: Record<string, unknown> | string) =>
    apiCall('/analytics/forecast', 'POST', {
      historical_data: [typeof metricsJson === 'string' ? JSON.parse(metricsJson) : metricsJson],
      days_ahead: 30,
    }),
  getDashboardData: (data: Record<string, unknown>) =>
    apiCall('/analytics/dashboard-data', 'POST', data),

  // ─── Engagement ─────────────────────────────────────────
  respondComment: (comment: string, platform: string, brandVoice: string) =>
    apiCall('/engagement/respond-comment', 'POST', { comment, platform, brand_voice: brandVoice }),
  analyzeComment: (comment: string) =>
    apiCall('/engagement/analyze-comment', 'POST', { comment }),
  detectCrisis: (comments: string[]) =>
    apiCall('/engagement/detect-crisis', 'POST', { comments }),

  // ─── Monitor ────────────────────────────────────────────
  systemHealth: () => apiCall('/monitor/system-health'),
  agentsStatus: () => apiCall('/monitor/agents-status'),
  alerts: () => apiCall('/monitor/alerts'),

  // ─── Brand Voice ────────────────────────────────────────
  validateContent: (content: string, profile: Record<string, unknown>) =>
    apiCall('/brand-voice/validate-content', 'POST', { content, brand_profile: profile }),
  improveContent: (content: string, profile: Record<string, unknown>) =>
    apiCall('/brand-voice/improve-content', 'POST', { content, brand_profile: profile }),
  createBrandProfile: (brandName: string, description: string, samplePosts: string[] | string) =>
    apiCall('/brand-voice/create-profile', 'POST', {
      client_name: brandName || 'Cliente',
      brand_description: description || '',
      sample_posts: Array.isArray(samplePosts)
        ? samplePosts
        : (samplePosts || '').split('\n').filter(Boolean),
    }),

  // ─── Competitive ────────────────────────────────────────
  analyzeCompetitor: (name: string, platform: string, url?: string) =>
    apiCall('/competitive/analyze-competitor', 'POST', {
      competitor_data: { name, platform, url: url || '' },
    }),
  generateBenchmark: (competitorResult: any) =>
    apiCall('/competitive/generate-benchmark', 'POST', {
      client_data: { followers: 1000, engagement_rate: 0.03, posting_frequency: 3 },
      competitor_profile: {
        competitor_name: competitorResult?.competitor_name || '',
        platform: competitorResult?.platform || 'instagram',
        estimated_followers: competitorResult?.estimated_followers || null,
        avg_engagement_rate: competitorResult?.avg_engagement_rate || null,
        posting_frequency: competitorResult?.posting_frequency || '3x_week',
        content_types: competitorResult?.content_types || [],
        top_hashtags: competitorResult?.top_hashtags || [],
        best_performing_topics: competitorResult?.best_performing_topics || [],
        peak_posting_hours: competitorResult?.peak_posting_hours || [9, 12, 18, 20],
      },
    }),
  identifyGaps: (competitorResult: any, niche?: string) =>
    apiCall('/competitive/identify-gaps', 'POST', {
      client_topics: ['contenido general'],
      competitor_topics: competitorResult?.best_performing_topics || [],
      niche: niche || 'general',
    }),

  // ─── Trends ─────────────────────────────────────────────
  analyzeTrends: (niche: string, platform?: string) =>
    apiCall('/trends/analyze', 'POST', {
      platform_data: { [platform || 'instagram']: ['reels', 'stories', 'carousels'] },
      client_niche: niche || 'general',
    }),
  predictVirality: (content: string, platform: string) =>
    apiCall('/trends/predict-virality', 'POST', {
      content_description: content || '',
      platform: platform || 'instagram',
      target_audience: 'general audience',
    }),
  findOpportunities: (trendsResult: any, niche: string, platform?: string) => {
    const rawTrends = trendsResult?.data || trendsResult || [];
    const trends = Array.isArray(rawTrends) && rawTrends.length > 0
      ? rawTrends.map((t: any) => ({
          topic: t.topic || niche || 'general',
          platform: t.platform || platform || 'instagram',
          trend_score: t.trend_score || 0.65,
          velocity: t.velocity || 'rising',
          estimated_lifespan: t.estimated_lifespan || 'days',
          relevant_hashtags: t.relevant_hashtags || [],
          content_angle: t.content_angle || 'Educational and entertaining',
          risk_level: t.risk_level || 'safe',
          audience_alignment: t.audience_alignment || 0.75,
        }))
      : [{
          topic: niche || 'general',
          platform: platform || 'instagram',
          trend_score: 0.65,
          velocity: 'rising',
          estimated_lifespan: 'days',
          relevant_hashtags: [],
          content_angle: 'Educational and entertaining',
          risk_level: 'safe',
          audience_alignment: 0.75,
        }];
    return apiCall('/trends/find-opportunities', 'POST', {
      trends,
      client_niche: niche || 'general',
      brand_profile: { name: 'Cliente', niche: niche || 'general', platform: platform || 'instagram' },
    });
  },

  // ─── Crisis ─────────────────────────────────────────────
  assessCrisis: (signals: Record<string, unknown>) =>
    apiCall('/crisis/assess', 'POST', {
      platform: signals.platform || 'instagram',
      negative_comment_percentage: signals.negative_comment_percentage,
      complaint_velocity: signals.complaint_velocity,
      reach_of_negative_content: signals.reach_of_negative_content,
      media_involvement: signals.media_involvement || false,
      influencer_involvement: signals.influencer_involvement || false,
    }),
  draftStatement: (data: Record<string, unknown>) =>
    apiCall('/crisis/draft-statement', 'POST', data),
  recoveryPlan: (assessment: Record<string, unknown>) =>
    apiCall('/crisis/recovery-plan', 'POST', { assessment }),

  // ─── Reports ────────────────────────────────────────────
  generateMonthlyReport: (clientName?: string) =>
    apiCall('/reports/generate-monthly', 'POST', {
      client_name: clientName || 'Cliente OMEGA',
      metrics_data: { followers: 1000, engagement_rate: 0.03, reach: 5000, impressions: 8000 },
      previous_period_data: { followers: 900, engagement_rate: 0.025, reach: 4000, impressions: 7000 },
      agency_notes: '',
    }),
  generateCampaignReport: (data: Record<string, unknown>) =>
    apiCall('/reports/generate-campaign', 'POST', data),

  // ─── Growth ─────────────────────────────────────────────
  identifyOpportunities: (data: Record<string, unknown>) =>
    apiCall('/growth/identify-opportunities', 'POST', data),
  quickWins: (niche: string, platform: string) =>
    apiCall('/growth/quick-wins', 'POST', {
      account_data: { niche: niche || 'general', followers: 1000, engagement_rate: 0.03, posting_frequency: '3x_week' },
      platform: platform || 'instagram',
    }),

  // ─── Video ──────────────────────────────────────────────
  writeScript: (data: Record<string, unknown>) =>
    apiCall('/video/write-script', 'POST', data),
  generateVideoIdeas: (niche: string, platform: string) =>
    apiCall('/video/generate-ideas', 'POST', { niche, platform, content_pillars: [] }),

  // ─── Scheduling ─────────────────────────────────────────
  schedulePost: (data: Record<string, unknown>) =>
    apiCall('/scheduling/schedule-post', 'POST', data),
  getQueue: (clientId: string) =>
    apiCall(`/scheduling/queue/${clientId}`),
  approvePost: (postId: string) =>
    apiCall('/scheduling/approve-post', 'POST', { post_id: postId }),
  optimalTimes: (platform: string, timezone: string) =>
    apiCall('/scheduling/optimal-times', 'POST', { platform, audience_timezone: timezone, content_type: 'post' }),

  // ─── A/B Testing ────────────────────────────────────────
  designExperiment: (hypothesis: string, variant?: string, platform?: string) =>
    apiCall('/ab-testing/design-experiment', 'POST', {
      hypothesis: hypothesis || '',
      variable: 'content_format',
      base_content: { type: 'post', description: variant || hypothesis || '' },
      platform: platform || 'instagram',
    }),
  analyzeResults: (experiment: Record<string, unknown>) =>
    apiCall('/ab-testing/analyze-results', 'POST', { experiment }),

  // ─── Orchestrator ───────────────────────────────────────
  systemState: () => apiCall('/orchestrator/system-state'),
  executeWorkflow: (workflowName: string, clientId: string, params: Record<string, unknown>) =>
    apiCall('/orchestrator/execute-workflow', 'POST', { workflow_name: workflowName, client_id: clientId, params }),
};
