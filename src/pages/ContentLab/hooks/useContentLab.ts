import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  generateText, toggleSaveContent, deleteContent,
  generateImage, generateVideo, generateVideoFal,
  type ContentType, type ImageStyle, type VideoStyle, type VideoDuration, type VideoProvider, type GeneratedContent,
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
      const raw = await generateText(selectedAccountId, contentType, prompt, language);
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
        toast({ title: "Contenido generado exitosamente" });
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
      const result = await generateImage(selectedAccountId, prompt, imageStyle);
      const content = (result.data ?? result) as GeneratedContent;
      if (content?.generated_text) {
        setResults(prev => [content, ...prev]);
        invalidateHistory();
        toast({ title: "Imagen generada exitosamente" });
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

  const handleSave = async (contentId: string): Promise<void> => {
    if (!contentId) {
      toast({ title: "No se puede guardar", description: "El contenido no tiene ID del servidor", variant: "destructive" });
      return;
    }
    try {
      await toggleSaveContent(contentId);
      invalidateHistory();
      setResults(prev => prev.map(r => r.id === contentId ? { ...r, is_saved: !r.is_saved } : r));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al guardar";
      toast({ title: "Error al guardar", description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async (contentId: string, index: number): Promise<void> => {
    if (contentId) { await deleteContent(contentId); invalidateHistory(); }
    setResults(prev => prev.filter((_, i) => i !== index));
    toast({ title: "Eliminado" });
  };

  const selectClient = (clientId: string) => { setSelectedClientId(clientId); setSelectedAccountId(""); setResults([]); };
  const selectAccount = (accountId: string) => { setSelectedAccountId(accountId); setResults([]); };

  return {
    selectedClientId, selectedAccountId, contentType, language,
    prompt, results, copiedId, isGenerating, imageStyle, isGeneratingImage,
    videoStyle, videoDuration, videoProvider, isGeneratingVideo,
    setContentType, setLanguage, setPrompt, setImageStyle, setResults,
    setVideoStyle, setVideoDuration, setVideoProvider,
    selectClient, selectAccount,
    handleGenerate, handleGenerateImage, handleGenerateVideo,
    handleCopy, handleSave, handleDelete,
  };
}
