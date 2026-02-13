import { useState } from "react";
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

export default function ContentGenerator() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("professional");
  const [activeTab, setActiveTab] = useState("caption");

  // Results
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [caption, setCaption] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageResult, setImageResult] = useState<any>(null);
  const [generatingHashtags, setGeneratingHashtags] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [scriptTopic, setScriptTopic] = useState("");
  const [scriptDuration, setScriptDuration] = useState(60);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [script, setScript] = useState<any>(null);

  // Brand voice validation
  const [validatingBrand, setValidatingBrand] = useState(false);
  const [brandResult, setBrandResult] = useState<any>(null);

  const handleGenerateCaption = async () => {
    setGeneratingCaption(true);
    try {
      const result = await api.generateCaption(prompt, platform, tone);
      setCaption(typeof result === "string" ? result : result?.caption || result?.content || JSON.stringify(result));
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
      const result = await api.generateImage(prompt);
      setImageResult(result);
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
      const result = await api.generateHashtags(prompt || caption, platform);
      const tags = Array.isArray(result) ? result : result?.hashtags || [];
      setHashtags(tags);
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
      const result = await api.generateVideoScript(scriptTopic || prompt, scriptDuration, platform);
      setScript(result);
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
      setBrandResult(result);
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
            {!caption && !imageResult && hashtags.length === 0 && !script ? (
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
                {imageResult && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Imagen</Label>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      {imageResult.url || imageResult.image_url ? (
                        <img src={imageResult.url || imageResult.image_url} alt="Generated" className="rounded-lg w-full" />
                      ) : (
                        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(imageResult, null, 2)}</pre>
                      )}
                    </div>
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
                {script && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Script de Video</Label>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <pre className="text-sm whitespace-pre-wrap">{typeof script === "string" ? script : JSON.stringify(script, null, 2)}</pre>
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
