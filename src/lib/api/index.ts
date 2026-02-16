import { checkBackendHealth } from "./core";
import { contentApi } from "./content";
import { analyticsApi } from "./analytics";
import { competitiveApi } from "./competitive";
import { resellersApi } from "./resellers";
import { agentsApi } from "./agents";
import { createClientContext, getClientContext, updateClientContext } from "./context";
import { listClients, createClient, getClient, updateClient, deleteClient } from "./clients";

export const api = {
  // ─── Health ───────────────────────────────────────────
  health: () => checkBackendHealth(),

  // ─── Content ──────────────────────────────────────────
  generateCaption: contentApi.generateCaption,
  generateImage: contentApi.generateImage,
  generateHashtags: contentApi.generateHashtags,
  generateVideoScript: contentApi.generateVideoScript,
  contentAgentStatus: contentApi.contentAgentStatus,

  // ─── Analytics ────────────────────────────────────────
  analyzeMetrics: analyticsApi.analyzeMetrics,
  generateInsights: analyticsApi.generateInsights,
  forecast: analyticsApi.forecast,
  getDashboardData: analyticsApi.getDashboardData,

  // ─── Competitive + Trends ─────────────────────────────
  analyzeCompetitor: competitiveApi.analyzeCompetitor,
  generateBenchmark: competitiveApi.generateBenchmark,
  identifyGaps: competitiveApi.identifyGaps,
  analyzeTrends: competitiveApi.analyzeTrends,
  predictVirality: competitiveApi.predictVirality,
  findOpportunities: competitiveApi.findOpportunities,

  // ─── Agents ───────────────────────────────────────────
  createCalendar: agentsApi.createCalendar,
  optimizeTiming: agentsApi.optimizeTiming,
  analyzeStrategy: agentsApi.analyzeStrategy,
  strategyAgentStatus: agentsApi.strategyAgentStatus,
  respondComment: agentsApi.respondComment,
  analyzeComment: agentsApi.analyzeComment,
  detectCrisis: agentsApi.detectCrisis,
  systemHealth: agentsApi.systemHealth,
  agentsStatus: agentsApi.agentsStatus,
  alerts: agentsApi.alerts,
  validateContent: agentsApi.validateContent,
  improveContent: agentsApi.improveContent,
  createBrandProfile: agentsApi.createBrandProfile,
  assessCrisis: agentsApi.assessCrisis,
  draftStatement: agentsApi.draftStatement,
  recoveryPlan: agentsApi.recoveryPlan,
  generateMonthlyReport: agentsApi.generateMonthlyReport,
  generateCampaignReport: agentsApi.generateCampaignReport,
  identifyOpportunities: agentsApi.identifyOpportunities,
  quickWins: agentsApi.quickWins,
  writeScript: agentsApi.writeScript,
  generateVideoIdeas: agentsApi.generateVideoIdeas,
  schedulePost: agentsApi.schedulePost,
  getQueue: agentsApi.getQueue,
  approvePost: agentsApi.approvePost,
  optimalTimes: agentsApi.optimalTimes,
  designExperiment: agentsApi.designExperiment,
  analyzeResults: agentsApi.analyzeResults,
  systemState: agentsApi.systemState,
  executeWorkflow: agentsApi.executeWorkflow,

  // ─── Resellers ────────────────────────────────────────
  getResellers: resellersApi.getAll,
  createReseller: resellersApi.create,
  getResellerDashboard: resellersApi.getDashboard,
  updateResellerStatus: resellersApi.updateStatus,
  saveResellerBranding: resellersApi.saveBranding,
  getResellerBranding: resellersApi.getBranding,
  getResellerClients: resellersApi.getClients,
  getResellerBySlug: resellersApi.getBySlug,

  // ─── Context ──────────────────────────────────────────
  createClientContext,
  getClientContext,
  updateClientContext,

  // ─── Clients ──────────────────────────────────────────
  listClients,
  createClient,
  getClient,
  updateClient: updateClient,
  deleteClient,
};

// Named exports for direct module access
export { checkBackendHealth } from "./core";
export { contentApi } from "./content";
export { analyticsApi } from "./analytics";
export { competitiveApi } from "./competitive";
export { resellersApi } from "./resellers";
export { agentsApi } from "./agents";
export { createClientContext, getClientContext, updateClientContext } from "./context";
export type { ToneOption, GoalOption, PlatformOption, ClientContextData, ClientContextPayload, ClientContextUpdatePayload, AudienceValue } from "./context";
export { listClients, createClient, getClient, updateClient, deleteClient } from "./clients";
export type { ClientProfile, ClientCreate, ClientUpdate, ClientPlan, ClientStatus, SubscriptionStatus, ClientRole, ClientListResponse, ClientResponse, ClientListParams } from "./clients";
