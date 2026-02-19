import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  generateText, toggleSaveContent, deleteContent,
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
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
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
      const result = await generateText(selectedAccountId, contentType, prompt, language);
      if (result) {
        setResults(prev => [result as GeneratedContent, ...prev]);
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

  const handleCopy = async (index: number): Promise<void> => {
    const item = results[index];
    if (!item) return;
    await navigator.clipboard.writeText(item.generated_text);
    setCopiedId(item.id ?? `idx-${index}`);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copiado al portapapeles" });
  };

  const handleSave = async (contentId: string): Promise<void> => {
    await toggleSaveContent(contentId);
    invalidateHistory();
    setResults(prev => prev.map(r =>
      r.id === contentId ? { ...r, is_saved: !r.is_saved } : r
    ));
  };

  const handleDelete = async (contentId: string, index: number): Promise<void> => {
    if (contentId) {
      await deleteContent(contentId);
      invalidateHistory();
    }
    setResults(prev => prev.filter((_, i) => i !== index));
    toast({ title: "Eliminado" });
  };

  const selectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedAccountId("");
    setResults([]);
  };

  const selectAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    setResults([]);
  };

  return {
    selectedClientId, selectedAccountId, contentType, language,
    prompt, results, copiedId, isGenerating, imageStyle, isGeneratingImage,
    setContentType, setLanguage, setPrompt, setImageStyle, setResults,
    selectClient, selectAccount,
    handleGenerate, handleGenerateImage, handleCopy, handleSave, handleDelete,
  };
}
