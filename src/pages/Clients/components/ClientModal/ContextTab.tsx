// src/pages/Clients/components/ClientModal/ContextTab.tsx
// Responsabilidad: Contexto de marca + lista local de cuentas sociales pendientes

import { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChipsInput } from "@/components/ui/ChipsInput";
import { useToast } from "@/hooks/use-toast";
import { Plus, Palette, X } from "lucide-react";
import type { Platform, ContextData } from "@/lib/api/socialAccounts";

const PLATFORMS = [
  { value: "instagram" as Platform, label: "Instagram" },
  { value: "facebook" as Platform, label: "Facebook" },
  { value: "tiktok" as Platform, label: "TikTok" },
  { value: "twitter" as Platform, label: "X / Twitter" },
  { value: "linkedin" as Platform, label: "LinkedIn" },
  { value: "youtube" as Platform, label: "YouTube" },
  { value: "pinterest" as Platform, label: "Pinterest" },
];

const TONE_OPTIONS = [
  "Profesional", "Inspiracional", "Humorístico",
  "Casual", "Educativo", "Energético",
];

const GOAL_OPTIONS = ["Ventas", "Comunidad", "Retención", "Awareness", "Leads"];

export interface PendingAccount {
  platform: Platform;
  username: string;
  profile_url?: string;
}

export interface ContextTabData {
  context: ContextData;
  pendingAccounts: PendingAccount[];
}

export interface ContextTabRef {
  getData: () => ContextTabData | null;
}

interface ContextTabProps {
  client: { id: string; plan: string } | null;
}

export const ContextTab = forwardRef<ContextTabRef, ContextTabProps>(
  ({ client }, ref) => {
    const { toast } = useToast();

    // Context fields
    const [businessName, setBusinessName] = useState("");
    const [industry, setIndustry] = useState("");
    const [description, setDescription] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);
    const [forbiddenTopics, setForbiddenTopics] = useState<string[]>([]);
    const [selectedTones, setSelectedTones] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    // Account fields (form)
    const [platform, setPlatform] = useState<Platform>("instagram");
    const [username, setUsername] = useState("");
    const [profileUrl, setProfileUrl] = useState("");

    // Local pending accounts list
    const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>([]);

    const toggleTone = (tone: string) => {
      setSelectedTones((prev) =>
        prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]
      );
    };

    const toggleGoal = (goal: string) => {
      setSelectedGoals((prev) =>
        prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
      );
    };

    // Expose data to parent for "Guardar Cambios"
    useImperativeHandle(ref, () => ({
      getData: () => {
        if (!businessName.trim() || !industry.trim()) return null;
        return {
          context: {
            business_name: businessName.trim(),
            industry: industry.trim(),
            description: description.trim() || undefined,
            website_url: websiteUrl.trim() || undefined,
            keywords,
            forbidden_words: forbiddenWords,
            forbidden_topics: forbiddenTopics,
            tones: selectedTones,
            goals: selectedGoals,
          },
          pendingAccounts,
        };
      },
    }));

    const handleAddAccount = () => {
      if (!username.trim()) return;
      const exists = pendingAccounts.some(
        (a) => a.platform === platform && a.username === username.trim()
      );
      if (exists) {
        toast({ title: "Cuenta duplicada", variant: "destructive" });
        return;
      }
      setPendingAccounts((prev) => [
        ...prev,
        { platform, username: username.trim(), profile_url: profileUrl.trim() || undefined },
      ]);
      setUsername("");
      setProfileUrl("");
      toast({ title: "Cuenta agregada a la lista" });
    };

    const removeAccount = (index: number) => {
      setPendingAccounts((prev) => prev.filter((_, i) => i !== index));
    };

    const platformLabel = (p: string) =>
      PLATFORMS.find((pl) => pl.value === p)?.label ?? p;

    if (!client) {
      return (
        <Card className="border-dashed mt-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Palette className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground text-center">
              Primero guarda el cliente para configurar contexto.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6 mt-4">
        {/* Contexto General */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Contexto de Marca</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre del negocio *</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Mi Empresa" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Industria *</Label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Marketing, Fitness, Tech..." />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Descripcion</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe tu negocio y propuesta de valor..." rows={3} />
          </div>
        </div>

        {/* Agregar Cuenta Social */}
        <div className="border-t border-border pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Agregar Cuenta Social</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Plataforma</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre de usuario *</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@usuario" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">URL del perfil (opcional)</Label>
            <Input value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} placeholder="https://instagram.com/usuario" />
          </div>

          <div className="flex justify-end">
            <Button size="sm" className="gradient-primary" onClick={handleAddAccount} disabled={!username.trim()}>
              <Plus className="mr-1 h-3 w-3" />
              Agregar
            </Button>
          </div>

          {/* Pending accounts list */}
          {pendingAccounts.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">{pendingAccounts.length} cuenta(s) pendiente(s) de guardar</p>
              {pendingAccounts.map((acc, i) => (
                <div key={i} className="flex items-center gap-2 rounded border border-border/30 bg-muted/20 px-3 py-1.5">
                  <span className="text-sm font-medium flex-1 truncate">{acc.username}</span>
                  <span className="text-xs text-muted-foreground">{platformLabel(acc.platform)}</span>
                  <button type="button" onClick={() => removeAccount(i)} className="p-0.5 rounded hover:bg-muted">
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resto del contexto */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Website URL</Label>
            <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://ejemplo.com" />
          </div>

          <ChipsInput value={keywords} onChange={setKeywords} label="Keywords" placeholder="keyword + Enter" maxChips={15} />
          <ChipsInput value={forbiddenWords} onChange={setForbiddenWords} label="Palabras prohibidas" placeholder="palabra + Enter" maxChips={15} />
          <ChipsInput value={forbiddenTopics} onChange={setForbiddenTopics} label="Temas prohibidos" placeholder="tema + Enter" maxChips={10} />

          <div className="space-y-2">
            <Label className="text-xs font-medium">Tono de comunicacion</Label>
            <div className="grid grid-cols-3 gap-2">
              {TONE_OPTIONS.map((tone) => (
                <label key={tone} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={selectedTones.includes(tone)} onCheckedChange={() => toggleTone(tone)} />
                  <span className="text-sm">{tone}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Objetivos</Label>
            <div className="grid grid-cols-3 gap-2">
              {GOAL_OPTIONS.map((goal) => (
                <label key={goal} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={selectedGoals.includes(goal)} onCheckedChange={() => toggleGoal(goal)} />
                  <span className="text-sm">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Upload placeholder */}
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <p className="text-xs text-muted-foreground">Adjuntar PDFs, guias de marca... (Fase 3)</p>
          </CardContent>
        </Card>
      </div>
    );
  }
);

ContextTab.displayName = "ContextTab";
