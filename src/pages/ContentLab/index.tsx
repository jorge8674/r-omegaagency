import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Copy, Bookmark, RotateCcw, Trash2, Loader2, CheckCircle } from "lucide-react";
import { useClients } from "@/pages/ContentGenerator/hooks/useClients";
import { listSocialAccounts } from "@/lib/api/socialAccounts";
import {
  generateContent, listGeneratedContent, toggleSaveContent, deleteContent,
  CONTENT_TYPE_LABELS, type ContentType, type GeneratedContent,
} from "@/lib/api/contentLab";

const PLATFORM_EMOJI: Record<string, string> = {
  instagram: "📸", facebook: "📘", tiktok: "🎵",
  twitter: "🐦", linkedin: "💼", youtube: "🎬", pinterest: "📌",
};

export default function ContentLab() {
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

  const { clients, loadClients } = useClients();

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const { data: accountsData } = useQuery({
    queryKey: ["social-accounts", selectedClientId],
    queryFn: () => listSocialAccounts(selectedClientId),
    enabled: !!selectedClientId,
  });
  const accounts = accountsData?.data || [];

  const { data: historyData } = useQuery({
    queryKey: ["content-history", selectedAccountId, selectedClientId],
    queryFn: () => listGeneratedContent(
      selectedAccountId || undefined,
      selectedAccountId ? undefined : selectedClientId || undefined
    ),
    enabled: !!(selectedAccountId || selectedClientId),
  });
  const history = historyData?.data || [];

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const hasContext = !!selectedAccount?.context_id;

  const handleGenerate = async () => {
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
        title: "⚠️ Esta cuenta no tiene contexto",
        description: "Ve a Clientes → Editar → Contexto para configurarlo",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const extraInstructions = language === "en" ? "Write entirely in English" : undefined;
      const result = await generateContent(selectedAccountId, contentType, prompt, extraInstructions);
      if (result.data) {
        setCurrentResult(result.data);
        queryClient.invalidateQueries({ queryKey: ["content-history"] });
        toast({ title: "✅ Contenido generado" });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toast({ title: "Error al generar", description: msg, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!currentResult) return;
    await navigator.clipboard.writeText(currentResult.generated_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "✅ Copiado al portapapeles" });
  };

  const handleSave = async (contentId: string) => {
    await toggleSaveContent(contentId);
    queryClient.invalidateQueries({ queryKey: ["content-history"] });
    if (currentResult?.id === contentId) {
      setCurrentResult((prev) => prev ? { ...prev, is_saved: !prev.is_saved } : null);
    }
  };

  const handleDelete = async (contentId: string) => {
    await deleteContent(contentId);
    queryClient.invalidateQueries({ queryKey: ["content-history"] });
    if (currentResult?.id === contentId) setCurrentResult(null);
    toast({ title: "Eliminado" });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Content Lab
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Genera contenido con IA personalizado por cuenta y contexto de marca.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* LEFT — Config */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border/50 bg-card p-4 space-y-4">
            <h2 className="font-semibold text-sm">Configuración</h2>

            {/* Cliente */}
            <div className="space-y-1.5">
              <Label>Cliente</Label>
              <Select value={selectedClientId} onValueChange={(v) => {
                setSelectedClientId(v);
                setSelectedAccountId("");
                setCurrentResult(null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — {c.plan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cuenta */}
            <div className="space-y-1.5">
              <Label>Cuenta Social</Label>
              <Select
                value={selectedAccountId}
                onValueChange={(v) => { setSelectedAccountId(v); setCurrentResult(null); }}
                disabled={!selectedClientId || accounts.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cuenta..." />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      <span className="flex items-center gap-2">
                        {PLATFORM_EMOJI[acc.platform] || "🌐"} {acc.username}
                        {!acc.context_id && (
                          <span className="text-[10px] text-destructive ml-1">sin contexto</span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedAccount && (
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`h-2 w-2 rounded-full ${hasContext ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-xs text-muted-foreground">
                    {hasContext ? "Contexto configurado ✓" : "Sin contexto — configura en Clientes"}
                  </span>
                </div>
              )}
            </div>

            {/* Tipo de contenido */}
            <div className="space-y-1.5">
              <Label>Tipo de contenido</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.entries(CONTENT_TYPE_LABELS) as [ContentType, { label: string; emoji: string; desc: string }][]).map(([type, info]) => (
                  <button
                    key={type}
                    onClick={() => setContentType(type)}
                    className={`text-left p-2 rounded-lg border text-sm transition-all ${
                      contentType === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 hover:border-primary/50"
                    }`}
                  >
                    <span>{info.emoji} {info.label}</span>
                    <p className="text-[10px] text-muted-foreground">{info.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Idioma */}
            <div className="space-y-1.5">
              <Label>Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">🇵🇷 Español</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <Label>Tema o instrucción</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Promo de verano con 20% descuento en membresías del gym..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{prompt.length}/1000</p>
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={isGenerating || !selectedAccountId || !prompt.trim()}
            >
              {isGenerating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Generar Contenido</>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT — Result + History */}
        <div className="lg:col-span-3 space-y-4">
          {currentResult ? (
            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{CONTENT_TYPE_LABELS[currentResult.content_type as ContentType]?.emoji}</span>
                  <span className="font-semibold capitalize">
                    {CONTENT_TYPE_LABELS[currentResult.content_type as ContentType]?.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {PLATFORM_EMOJI[currentResult.platform || ""] || ""} {currentResult.platform}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{currentResult.tokens_used} tokens</span>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap text-sm leading-relaxed">
                {currentResult.generated_text}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <CheckCircle className="mr-1 h-4 w-4 text-green-500" /> : <Copy className="mr-1 h-4 w-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleSave(currentResult.id)}>
                  <Bookmark className={`mr-1 h-4 w-4 ${currentResult.is_saved ? "fill-current" : ""}`} />
                  {currentResult.is_saved ? "Guardado" : "Guardar"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
                  <RotateCcw className="mr-1 h-4 w-4" /> Regenerar
                </Button>
                <Button
                  variant="ghost" size="sm"
                  className="text-destructive hover:text-destructive ml-auto"
                  onClick={() => handleDelete(currentResult.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/50 bg-card/50 p-12 text-center">
              <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Selecciona una cuenta, elige el tipo de contenido<br />y escribe el tema para generar
              </p>
            </div>
          )}

          {history.length > 0 && (
            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-3">
              <h3 className="font-semibold text-sm">Historial reciente</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentResult(item)}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <span className="text-lg shrink-0">
                      {CONTENT_TYPE_LABELS[item.content_type as ContentType]?.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.prompt}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.generated_text.slice(0, 80)}...</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.is_saved && <Bookmark className="h-3.5 w-3.5 fill-current text-primary" />}
                      <span className="text-xs text-muted-foreground">
                        {PLATFORM_EMOJI[item.platform || ""] || ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
