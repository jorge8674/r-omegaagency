import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { ContentTypeIcon } from "@/components/icons/ContentTypeIcon";
import { CONTENT_TYPE_LABELS, type ContentType, type ImageStyle } from "@/lib/api/contentLab";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  context_id?: string | null;
}

interface Client {
  id: string;
  name: string;
  plan: string | null;
}

interface ConfigPanelProps {
  clients: Client[];
  accounts: SocialAccount[];
  selectedClientId: string;
  selectedAccountId: string;
  contentType: ContentType;
  language: string;
  prompt: string;
  imageStyle: ImageStyle;
  isGenerating: boolean;
  isGeneratingImage: boolean;
  hasContext: boolean;
  onSelectClient: (id: string) => void;
  onSelectAccount: (id: string) => void;
  onContentTypeChange: (type: ContentType) => void;
  onLanguageChange: (lang: string) => void;
  onPromptChange: (text: string) => void;
  onImageStyleChange: (style: ImageStyle) => void;
  onGenerate: () => void;
}

const IMAGE_STYLES = [
  { value: "realistic" as const, label: "Realista", desc: "Fotografía profesional" },
  { value: "cartoon" as const, label: "Ilustración", desc: "Arte vectorial" },
  { value: "minimal" as const, label: "Minimal", desc: "Diseño limpio" },
];

export function ConfigPanel({
  clients, accounts, selectedClientId, selectedAccountId,
  contentType, language, prompt, imageStyle,
  isGenerating, isGeneratingImage, hasContext,
  onSelectClient, onSelectAccount, onContentTypeChange,
  onLanguageChange, onPromptChange, onImageStyleChange, onGenerate,
}: ConfigPanelProps) {
  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const busy = contentType === "image" ? isGeneratingImage : isGenerating;

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 space-y-4">
      <h2 className="font-semibold text-sm">Configuración</h2>

      <div className="space-y-1.5">
        <Label>Cliente</Label>
        <Select value={selectedClientId} onValueChange={onSelectClient}>
          <SelectTrigger><SelectValue placeholder="Seleccionar cliente..." /></SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} — {c.plan}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Cuenta Social</Label>
        <Select value={selectedAccountId} onValueChange={onSelectAccount} disabled={!selectedClientId || accounts.length === 0}>
          <SelectTrigger><SelectValue placeholder="Seleccionar cuenta..." /></SelectTrigger>
          <SelectContent>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.id}>
                <span className="flex items-center gap-2">
                  <PlatformIcon platform={acc.platform} size={14} /> {acc.username}
                  {!acc.context_id && <span className="text-[10px] text-destructive ml-1">sin contexto</span>}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedAccount && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`h-2 w-2 rounded-full ${hasContext ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-xs text-muted-foreground">
              {hasContext ? "Contexto configurado" : "Sin contexto — configura en Clientes"}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Tipo de contenido</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.entries(CONTENT_TYPE_LABELS) as [ContentType, { label: string; desc: string }][]).map(([type, info]) => (
            <button key={type} onClick={() => onContentTypeChange(type)} className={`text-left p-2 rounded-lg border text-sm transition-all ${contentType === type ? "border-primary bg-primary/10 text-primary" : "border-border/50 hover:border-primary/50"}`}>
              <span className="flex items-center gap-1.5">
                <ContentTypeIcon type={type} size={14} className={contentType === type ? "text-primary" : "text-muted-foreground"} />
                {info.label}
              </span>
              <p className="text-[10px] text-muted-foreground">{info.desc}</p>
            </button>
          ))}
        </div>
        {contentType === "image" && (
          <div className="space-y-2 mt-3">
            <Label>Estilo de imagen</Label>
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_STYLES.map((s) => (
                <button key={s.value} type="button" onClick={() => onImageStyleChange(s.value)} className={`p-3 rounded-lg border text-sm transition-all ${imageStyle === s.value ? "border-primary bg-primary/10 text-primary" : "border-border/50 hover:border-primary/50"}`}>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Idioma</Label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Tema o instrucción</Label>
        <Textarea value={prompt} onChange={(e) => onPromptChange(e.target.value)} placeholder="Ej: Promo de verano con 20% descuento..." rows={4} className="resize-none" />
        <p className="text-xs text-muted-foreground text-right">{prompt.length}/1000</p>
      </div>

      <Button className="w-full" onClick={onGenerate} disabled={busy || !selectedAccountId || !prompt.trim()}>
        {busy ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{contentType === "image" ? "Creando imagen..." : "Generando..."}</>
        ) : (
          <><Sparkles className="mr-2 h-4 w-4" />{contentType === "image" ? "Generar Imagen" : "Generar Contenido"}</>
        )}
      </Button>
    </div>
  );
}
