import { apiCall } from "./core";
import type { AgentStatusResponse } from "@/types/shared.types";

export const contentApi = {
  generateCaption: (prompt: string, platform: string, tone: string) =>
    apiCall("/content/generate-caption", "POST", { topic: prompt, platform, tone }),

  generateImage: (topic: string) =>
    apiCall("/content/generate-image", "POST", { prompt: topic }),

  generateHashtags: (content: string, platform: string) =>
    apiCall("/content/generate-hashtags", "POST", { topic: content, platform }),

  generateVideoScript: (topic: string, duration: number, platform: string) =>
    apiCall("/content/generate-video-script", "POST", { topic, duration_seconds: duration, platform }),

  contentAgentStatus: () =>
    apiCall<AgentStatusResponse>("/content/agent-status"),
};
