import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Attachment } from "../components/AttachmentInput";
import { useToast } from "@/hooks/use-toast";
import {
  generateText, deleteContent,
  generateImage, generateVideo, generateVideoFal,
  fetchAgentProviders, FALLBACK_AGENTS,
  type ContentType, type ImageStyle, type ImageAttachment, type VideoStyle, type VideoDuration, type VideoProvider, type GeneratedContent, type AgentProvider,
} from "@/lib/api/contentLab";

export function useContentLab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [contentType, setContentType] = useState<ContentType>("post");
  const [language, setLanguage] = useState("es");
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageStyle, setImageStyle] = useState<ImageStyle>("realistic");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [videoStyle, setVideoStyle] = useState<VideoStyle>("realistic");
  const [videoDuration, setVideoDuration] = useState<VideoDuration>(5);
  const [videoProvider, setVideoProvider] = useState<VideoProvider>("runway");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("rex");
  const [agents, setAgents] = useState<AgentProvider[]>(FALLBACK_AGENTS);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => { fetchAgentProviders().then(setAgents); }, []);

  const invalidateHistory = () =>
    queryClient.invalidateQueries({ queryKey: ["content-history"] });

  const handleGenerate = async (hasContext: boolean): Promise<void> => {
    if (!selectedAccountId) {
      toast({ title: "Selecciona una cuenta social", variant: "destructive" });
      return;
    }
    if (!prompt.trim()) {
      toast({ title: "Escribe el tema o prompt", variant: "destructive" });
      return;
    }
    if (!hasContext) {
      toast({ title: "Esta cuenta no tiene contexto", description: "Configura el contexto en Clientes → Editar", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const raw = await generateText(selectedAccountId, contentType, prompt, language, selectedAgent);
      if (raw) {
        const content: GeneratedContent = {
          ...(raw as GeneratedContent),
          id: (raw as GeneratedContent).id || crypto.randomUUID(),
          client_id: selectedClientId,
          account_id: selectedAccountId,
          context_id: null,
          platform: (raw as GeneratedContent).platform || "instagram",
          prompt,
          is_saved: false,
          created_at: new Date().toISOString(),
        };
        setResults(prev => [content, ...prev]);
        invalidateHistory();
        const agentInfo = agents.find(a => a.id === selectedAgent);
        toast({ title: `Generado por ${agentInfo?.name ?? selectedAgent.toUpperCase()}` });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toast({ title: "Error al generar", description: msg, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (hasContext: boolean): Promise<void> => {
    if (!selectedAccountId || !prompt.trim()) return;
    if (!hasContext) {
      toast({ title: "Esta cuenta no tiene contexto", description: "Configura el contexto en Clientes → Editar", variant: "destructive" });
      return;
    }
    setIsGeneratingImage(true);
    try {
      const imageAttachments: ImageAttachment[] = attachments
        .filter(a => a.type === "image" && a.preview)
        .map(a => ({ type: "image" as const, base64: a.preview!, name: a.file.name }));
      const result = await generateImage(selectedAccountId, prompt, imageStyle, imageAttachments.length > 0 ? imageAttachments : undefined);
      const content = (result.data ?? result) as GeneratedContent;
      if (content?.generated_text) {
        setResults(prev => [content, ...prev]);
        invalidateHistory();
        const mode = imageAttachments.length > 0 ? "edit" : "generate";
        toast({ title: mode === "edit" ? "✏️ Imagen editada" : "🎨 Imagen generada" });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toast({ title: "Error al generar imagen", description: msg, variant: "destructive" });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async (hasContext: boolean): Promise<void> => {
    if (!selectedAccountId || !prompt.trim()) return;
    if (!hasContext) {
      toast({ title: "Esta cuenta no tiene contexto", description: "Configura el contexto en Clientes → Editar", variant: "destructive" });
      return;
    }
    setIsGeneratingVideo(true);
    try {
      const result = videoProvider === "runway"
        ? await generateVideo(selectedAccountId, prompt, videoDuration, videoStyle)
        : await generateVideoFal(selectedAccountId, prompt, videoDuration, videoProvider);
      const content = (result.data ?? result) as GeneratedContent;
      if (content?.generated_text) {
        setResults(prev => [content, ...prev]);
        invalidateHistory();
        toast({ title: "Video generado exitosamente" });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toast({ title: "Error al generar video", description: msg, variant: "destructive" });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleCopy = async (index: number): Promise<void> => {
    const item = results[index];
    if (!item) return;
    await navigator.clipboard.writeText(item.generated_text);
    setCopiedId(item.id ?? `idx-${index}`);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copiado al portapapeles" });
  };

  const handleDelete = async (contentId: string, index: number): Promise<void> => {
    if (contentId) { await deleteContent(contentId); invalidateHistory(); }
    setResults(prev => prev.filter((_, i) => i !== index));
    toast({ title: "Eliminado" });
  };

  const selectClient = (clientId: string) => { setSelectedClientId(clientId); setSelectedAccountId(""); setResults([]); setAttachments([]); };
  const selectAccount = (accountId: string) => { setSelectedAccountId(accountId); setResults([]); setAttachments([]); };

  return {
    selectedClientId, selectedAccountId, contentType, language,
    prompt, results, copiedId, isGenerating, imageStyle, isGeneratingImage,
    videoStyle, videoDuration, videoProvider, isGeneratingVideo,
    selectedAgent, agents, attachments,
    setContentType, setLanguage, setPrompt, setImageStyle, setResults,
    setVideoStyle, setVideoDuration, setVideoProvider, setSelectedAgent,
    setAttachments,
    selectClient, selectAccount,
    handleGenerate, handleGenerateImage, handleGenerateVideo,
    handleCopy, handleDelete,
  };
}
