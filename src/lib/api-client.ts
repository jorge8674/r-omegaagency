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
  analyzeMetrics: (data: Record<string, unknown>) =>
    apiCall('/analytics/analyze-metrics', 'POST', { data }),
  generateInsights: (data: Record<string, unknown>) =>
    apiCall('/analytics/generate-insights', 'POST', { data }),
  forecast: (data: Record<string, unknown>) =>
    apiCall('/analytics/forecast', 'POST', { data }),
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
  createBrandProfile: (data: Record<string, unknown>) =>
    apiCall('/brand-voice/create-profile', 'POST', data),

  // ─── Competitive ────────────────────────────────────────
  analyzeCompetitor: (data: Record<string, unknown>) =>
    apiCall('/competitive/analyze-competitor', 'POST', data),
  generateBenchmark: (data: Record<string, unknown>) =>
    apiCall('/competitive/generate-benchmark', 'POST', data),
  identifyGaps: (data: Record<string, unknown>) =>
    apiCall('/competitive/identify-gaps', 'POST', data),

  // ─── Trends ─────────────────────────────────────────────
  analyzeTrends: (data: Record<string, unknown>) =>
    apiCall('/trends/analyze', 'POST', data),
  predictVirality: (content: string, platform: string) =>
    apiCall('/trends/predict-virality', 'POST', { content_description: content, platform }),
  findOpportunities: (data: Record<string, unknown>) =>
    apiCall('/trends/find-opportunities', 'POST', data),

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
  generateMonthlyReport: (data: Record<string, unknown>) =>
    apiCall('/reports/generate-monthly', 'POST', data),
  generateCampaignReport: (data: Record<string, unknown>) =>
    apiCall('/reports/generate-campaign', 'POST', data),

  // ─── Growth ─────────────────────────────────────────────
  identifyOpportunities: (data: Record<string, unknown>) =>
    apiCall('/growth/identify-opportunities', 'POST', data),
  quickWins: (data: Record<string, unknown>) =>
    apiCall('/growth/quick-wins', 'POST', data),

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
  designExperiment: (data: Record<string, unknown>) =>
    apiCall('/ab-testing/design-experiment', 'POST', data),
  analyzeResults: (experiment: Record<string, unknown>) =>
    apiCall('/ab-testing/analyze-results', 'POST', { experiment }),

  // ─── Orchestrator ───────────────────────────────────────
  systemState: () => apiCall('/orchestrator/system-state'),
  executeWorkflow: (workflowName: string, clientId: string, params: Record<string, unknown>) =>
    apiCall('/orchestrator/execute-workflow', 'POST', { workflow_name: workflowName, client_id: clientId, params }),
};
