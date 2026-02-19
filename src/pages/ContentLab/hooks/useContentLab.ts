import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  generateContent, toggleSaveContent, deleteContent,
  generateImage, type ContentType, type ImageStyle, type GeneratedContent,
} from "@/lib/api/contentLab";

export function useContentLab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [contentType, setContentType] = useState<ContentType>("post");
  const [language, setLanguage] = useState("es");
  const [prompt, setPrompt] = useState("");
  const [currentResult, setCurrentResult] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageStyle, setImageStyle] = useState<ImageStyle>("realistic");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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
      toast({
        title: "Esta cuenta no tiene contexto",
        description: "Configura el contexto en Clientes → Editar",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateContent(selectedAccountId, contentType, prompt, language);
      const content = (result.data ?? result) as GeneratedContent;
      if (content?.generated_text) {
        setCurrentResult(content);
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
      toast({
        title: "Esta cuenta no tiene contexto",
        description: "Configura el contexto en Clientes → Editar",
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingImage(true);
    try {
      const result = await generateImage(selectedAccountId, prompt, imageStyle);
      const content = (result.data ?? result) as GeneratedContent;
      if (content?.generated_text) {
        setCurrentResult(content);
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

  const handleCopy = async (): Promise<void> => {
    if (!currentResult) return;
    await navigator.clipboard.writeText(currentResult.generated_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copiado al portapapeles" });
  };

  const handleSave = async (contentId: string): Promise<void> => {
    await toggleSaveContent(contentId);
    invalidateHistory();
    if (currentResult?.id === contentId) {
      setCurrentResult((prev) => prev ? { ...prev, is_saved: !prev.is_saved } : null);
    }
  };

  const handleDelete = async (contentId: string): Promise<void> => {
    await deleteContent(contentId);
    invalidateHistory();
    if (currentResult?.id === contentId) setCurrentResult(null);
    toast({ title: "Eliminado" });
  };

  const selectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedAccountId("");
    setCurrentResult(null);
  };

  const selectAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    setCurrentResult(null);
  };

  return {
    selectedClientId, selectedAccountId, contentType, language,
    prompt, currentResult, copied, isGenerating, imageStyle, isGeneratingImage,
    setContentType, setLanguage, setPrompt, setImageStyle, setCurrentResult,
    selectClient, selectAccount,
    handleGenerate, handleGenerateImage, handleCopy, handleSave, handleDelete,
  };
}
