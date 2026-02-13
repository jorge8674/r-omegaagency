export interface AIProvider {
  id: string;
  name: string;
  capabilities: ('text' | 'image' | 'video' | 'audio' | 'voice')[];
  active: boolean;
  apiKey?: string;
}

export interface AIConfig {
  activeProviders: string[];
  monthlyBudget: number;
  plan: 'basic' | 'pro' | 'enterprise';
}

// Mapeo provider UI → agentes backend
export const PROVIDER_TO_AGENT: Record<string, string[]> = {
  'anthropic': ['strategy', 'brand-voice', 'crisis'],
  'openai': ['content', 'analytics', 'engagement', 'competitive', 'trends', 'growth', 'reports', 'ab-testing', 'video', 'scheduling'],
  'elevenlabs': [],
  'gemini': [],
  'midjourney': [],
  'runway': ['video'],
  'stability': ['content'],
  'lovable': ['content'],
};

// Cuál agente del backend usa cuál provider
export const AGENT_PROVIDER_MAP: Record<string, string> = {
  'content': 'openai',
  'strategy': 'anthropic',
  'analytics': 'openai',
  'engagement': 'openai',
  'monitor': 'openai',
  'brand-voice': 'anthropic',
  'competitive': 'openai',
  'trends': 'openai',
  'crisis': 'anthropic',
  'reports': 'openai',
  'growth': 'openai',
  'video': 'openai',
  'scheduling': 'openai',
  'ab-testing': 'openai',
  'orchestrator': 'openai',
};

// Costos estimados por request
export const COST_PER_REQUEST: Record<string, number> = {
  'openai-text': 0.002,
  'openai-image': 0.04,
  'anthropic-text': 0.015,
  'elevenlabs-audio': 0.01,
  'gemini-text': 0.001,
};

// Provider status check endpoints
export const PROVIDER_STATUS_ENDPOINTS: Record<string, string> = {
  'openai': '/content/agent-status',
  'anthropic': '/strategy/agent-status',
};

export function getAgentCountForProvider(providerSlug: string): number {
  return PROVIDER_TO_AGENT[providerSlug]?.length ?? 0;
}

export function getEndpointCountForProvider(providerSlug: string): number {
  const agentEndpoints: Record<string, number> = {
    'content': 6,
    'strategy': 4,
    'analytics': 4,
    'engagement': 4,
    'monitor': 3,
    'brand-voice': 4,
    'competitive': 4,
    'trends': 4,
    'crisis': 4,
    'reports': 3,
    'growth': 3,
    'video': 3,
    'scheduling': 4,
    'ab-testing': 3,
    'orchestrator': 3,
  };
  const agents = PROVIDER_TO_AGENT[providerSlug] ?? [];
  return agents.reduce((sum, agent) => sum + (agentEndpoints[agent] ?? 0), 0);
}

export function loadAIConfig(): AIConfig {
  try {
    const stored = localStorage.getItem('omega_ai_config');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { activeProviders: ['openai', 'anthropic', 'lovable'], monthlyBudget: 0, plan: 'basic' };
}

export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem('omega_ai_config', JSON.stringify(config));
}
