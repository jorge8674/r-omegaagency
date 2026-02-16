import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { PLATFORMS, TONES } from "../types";
import type { ContentLanguage } from "../types";

interface Props {
  prompt: string;
  onPromptChange: (v: string) => void;
  platform: string;
  onPlatformChange: (v: string) => void;
  tone: string;
  onToneChange: (v: string) => void;
  activeTab: string;
  onActiveTabChange: (v: string) => void;
  language: ContentLanguage;
  onLanguageChange: (v: ContentLanguage) => void;
  scriptTopic: string;
  onScriptTopicChange: (v: string) => void;
  scriptDuration: number;
  onScriptDurationChange: (v: number) => void;
  generatingCaption: boolean;
  generatingImage: boolean;
  generatingHashtags: boolean;
  generatingScript: boolean;
  onCaption: () => void;
  onImage: () => void;
  onHashtags: () => void;
  onScript: () => void;
}

const TAB_ACTIONS: Record<string, { label: string; handler: keyof Props; loading: keyof Props }> = {
  caption:  { label: "Generar Caption",  handler: "onCaption",  loading: "generatingCaption" },
  image:    { label: "Generar Imagen",   handler: "onImage",    loading: "generatingImage" },
  hashtags: { label: "Generar Hashtags", handler: "onHashtags", loading: "generatingHashtags" },
  script:   { label: "Generar Script",   handler: "onScript",   loading: "generatingScript" },
};

export function ConfigPanel(props: Props) {
  const action = TAB_ACTIONS[props.activeTab] ?? TAB_ACTIONS.caption;
  const isLoading = props[action.loading] as boolean;
  const handler = props[action.handler] as () => void;

  return (
    <div className="space-y-4">
      {/* Language toggle */}
      <div className="flex items-center justify-between">
        <Label>Idioma</Label>
        <Select value={props.language} onValueChange={(v) => props.onLanguageChange(v as ContentLanguage)}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prompt */}
      <div className="space-y-1">
        <Label>Tema / Prompt</Label>
        <Textarea
          placeholder="Describe el contenido que quieres generar…"
          value={props.prompt}
          onChange={(e) => props.onPromptChange(e.target.value)}
          rows={3}
        />
      </div>

      {/* Platform + Tone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Plataforma</Label>
          <Select value={props.platform} onValueChange={props.onPlatformChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Tono</Label>
          <Select value={props.tone} onValueChange={props.onToneChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content type tabs */}
      <Tabs value={props.activeTab} onValueChange={props.onActiveTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="caption" className="flex-1">Caption</TabsTrigger>
          <TabsTrigger value="image" className="flex-1">Imagen</TabsTrigger>
          <TabsTrigger value="hashtags" className="flex-1">Hashtags</TabsTrigger>
          <TabsTrigger value="script" className="flex-1">Script</TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="space-y-3 mt-3">
          <div className="space-y-1">
            <Label>Tema del Script</Label>
            <Input
              placeholder="Tema específico para el video…"
              value={props.scriptTopic}
              onChange={(e) => props.onScriptTopicChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Duración: {props.scriptDuration}s</Label>
            <Slider
              value={[props.scriptDuration]}
              onValueChange={([v]) => props.onScriptDurationChange(v)}
              min={15} max={180} step={5}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Action button */}
      <Button
        className="w-full"
        disabled={!props.prompt.trim() || isLoading}
        onClick={handler}
      >
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {action.label}
      </Button>
    </div>
  );
}
