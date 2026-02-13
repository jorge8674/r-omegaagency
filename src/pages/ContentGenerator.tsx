import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Image, Hash, Video, Type } from "lucide-react";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
];

const TONES = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "bold", label: "Bold" },
  { value: "luxury", label: "Luxury" },
  { value: "casual", label: "Casual" },
];

const LANG_SUFFIX: Record<string, string> = {
  es: " | Responde completamente en español, contenido natural y auténtico en español.",
  en: " | Respond completely in English, natural and authentic English content.",
};

function extractField(result: any, ...keys: string[]) {
  if (result?.data) result = result.data;
  for (const k of keys) {
    if (result?.[k] !== undefined) return result[k];
  }
  return result;
}

export default function ContentGenerator() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("professional");
  const [activeTab, setActiveTab] = useState("caption");
  const [language, setLanguage] = useState<"es" | "en">(() => {
    return (localStorage.getItem("omega_content_language") as "es" | "en") || "es";
  });

  useEffect(() => {
    localStorage.setItem("omega_content_language", language);
  }, [language]);

  const topicWithLang = (text: string) => text + LANG_SUFFIX[language];

  // Results
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [caption, setCaption] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatingHashtags, setGeneratingHashtags] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [scriptTopic, setScriptTopic] = useState("");
  const [scriptDuration, setScriptDuration] = useState(60);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [scriptScenes, setScriptScenes] = useState<any[]>([]);
  const [scriptRaw, setScriptRaw] = useState<string>("");

  // Brand voice validation
  const [validatingBrand, setValidatingBrand] = useState(false);
  const [brandResult, setBrandResult] = useState<any>(null);

  const handleGenerateCaption = async () => {
    setGeneratingCaption(true);
    try {
      const result = await api.generateCaption(topicWithLang(prompt), platform, tone);
      const text = extractField(result, "caption", "content");
      setCaption(typeof text === "string" ? text : JSON.stringify(text));
      toast({ title: "✅ Caption generada" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingCaption(false);
    }
  };

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    try {
      const result = await api.generateImage(topicWithLang(prompt));
      const url = extractField(result, "image_url", "url");
      setImageUrl(typeof url === "string" ? url : null);
      toast({ title: "✅ Imagen generada" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGenerateHashtags = async () => {
    setGeneratingHashtags(true);
    try {
      const result = await api.generateHashtags(topicWithLang(prompt || caption), platform);
      const tags = extractField(result, "hashtags");
      setHashtags(Array.isArray(tags) ? tags : []);
      toast({ title: "✅ Hashtags generados" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingHashtags(false);
    }
  };

  const handleGenerateScript = async () => {
    setGeneratingScript(true);
    try {
      const result = await api.generateVideoScript(topicWithLang(scriptTopic || prompt), scriptDuration, platform);
      const data = result?.data || result;
      const scenes = data?.scenes || data?.script;
      if (Array.isArray(scenes)) {
        setScriptScenes(scenes);
        setScriptRaw("");
      } else if (typeof (data?.script || data) === "string") {
        setScriptRaw(data?.script || (typeof data === "string" ? data : JSON.stringify(data, null, 2)));
        setScriptScenes([]);
      } else {
        setScriptRaw(JSON.stringify(data, null, 2));
        setScriptScenes([]);
      }
      toast({ title: "✅ Script generado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingScript(false);
    }
  };

  const handleValidateBrand = async () => {
    setValidatingBrand(true);
    try {
      const result = await api.validateContent(caption || prompt, { tone, platform });
      setBrandResult(result?.data || result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setValidatingBrand(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado al portapapeles" });
  };

  const hasResults = caption || imageUrl || hashtags.length > 0 || scriptScenes.length > 0 || scriptRaw;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Generador de Contenido</h1>
        <p className="text-muted-foreground">Crea contenido con IA para todas las plataformas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Inputs */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Describe tu contenido o producto</Label>
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ej: Lanzamiento de nueva colección de verano, ropa deportiva premium..." rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm">Plataforma</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PLATFORMS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Tono</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="caption" className="flex-1"><Type className="h-3.5 w-3.5 mr-1" />Caption</TabsTrigger>
                <TabsTrigger value="image" className="flex-1"><Image className="h-3.5 w-3.5 mr-1" />Imagen</TabsTrigger>
                <TabsTrigger value="hashtags" className="flex-1"><Hash className="h-3.5 w-3.5 mr-1" />Hashtags</TabsTrigger>
                <TabsTrigger value="script" className="flex-1"><Video className="h-3.5 w-3.5 mr-1" />Script</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Language selector */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  language === "es"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                🇵🇷 Español
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  language === "en"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                🇺🇸 English
              </button>
            </div>

            {activeTab === "caption" && (
              <Button className="w-full gradient-primary" onClick={handleGenerateCaption} disabled={generatingCaption || !prompt}>
                {generatingCaption && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generar Caption
              </Button>
            )}
            {activeTab === "image" && (
              <Button className="w-full gradient-primary" onClick={handleGenerateImage} disabled={generatingImage || !prompt}>
                {generatingImage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generar Imagen
              </Button>
            )}
            {activeTab === "hashtags" && (
              <Button className="w-full gradient-primary" onClick={handleGenerateHashtags} disabled={generatingHashtags || (!prompt && !caption)}>
                {generatingHashtags && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generar Hashtags
              </Button>
            )}
            {activeTab === "script" && (
              <div className="space-y-3">
                <Input value={scriptTopic} onChange={(e) => setScriptTopic(e.target.value)} placeholder="Tema del video (o usa el prompt principal)" />
                <div className="space-y-1">
                  <Label className="text-sm">Duración: {scriptDuration}s</Label>
                  <Input type="range" min={15} max={180} value={scriptDuration} onChange={(e) => setScriptDuration(Number(e.target.value))} />
                </div>
                <Button className="w-full gradient-primary" onClick={handleGenerateScript} disabled={generatingScript || (!scriptTopic && !prompt)}>
                  {generatingScript && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generar Script
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Panel - Results */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">Resultados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasResults ? (
              <p className="text-sm text-muted-foreground text-center py-12">Sin datos – introduce información para generar contenido</p>
            ) : (
              <>
                {caption && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Caption</Label>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(caption)}>
                        <Copy className="h-3.5 w-3.5 mr-1" />Copiar
                      </Button>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-sm whitespace-pre-wrap">{caption}</p>
                    </div>
                  </div>
                )}
                {imageUrl && (
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Imagen</Label>
                    <img
                      src={imageUrl}
                      alt="Imagen generada por DALL-E"
                      className="w-full rounded-xl border border-border/50"
                      onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                    />
                    <Button
                      onClick={() => window.open(imageUrl, '_blank')}
                      className="w-full"
                    >
                      🔗 Abrir imagen completa
                    </Button>
                    <Button
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = imageUrl;
                        a.download = 'imagen-generada.png';
                        a.click();
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      ⬇️ Descargar
                    </Button>
                  </div>
                )}
                {hashtags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Hashtags</Label>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(hashtags.join(" "))}>
                        <Copy className="h-3.5 w-3.5 mr-1" />Copiar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hashtags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {(scriptScenes.length > 0 || scriptRaw) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Script de Video</Label>
                    <div className="rounded-lg bg-secondary/50 p-3 space-y-3">
                      {scriptScenes.length > 0 ? (
                        <ol className="list-decimal list-inside space-y-2">
                          {scriptScenes.map((scene, i) => (
                            <li key={i} className="text-sm">
                              <span className="font-medium">{scene.title || scene.name || `Escena ${i + 1}`}</span>
                              {(scene.description || scene.action || scene.dialogue) && (
                                <p className="text-muted-foreground ml-5 mt-0.5">{scene.description || scene.action || scene.dialogue}</p>
                              )}
                              {scene.duration && <span className="text-xs text-muted-foreground ml-5">({scene.duration})</span>}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <pre className="text-sm whitespace-pre-wrap">{scriptRaw}</pre>
                      )}
                    </div>
                  </div>
                )}
                {(caption || prompt) && (
                  <div className="border-t border-border pt-3">
                    <Button variant="outline" className="w-full" onClick={handleValidateBrand} disabled={validatingBrand}>
                      {validatingBrand && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Validar Brand Voice
                    </Button>
                    {brandResult && (
                      <div className="rounded-lg bg-secondary/50 p-3 mt-2">
                        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(brandResult, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
