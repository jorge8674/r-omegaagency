// src/pages/Clients/components/ClientModal/ContextTab.tsx
// Responsabilidad: Contexto de marca + creación de cuenta social con contexto

import { useState } from "react";
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
import { Plus, Loader2, Palette } from "lucide-react";
import {
  createAccountWithContext,
  type Platform,
  type ContextData,
} from "@/lib/api/socialAccounts";

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

interface ContextTabProps {
  client: { id: string; plan: string } | null;
  onAccountCreated?: () => void;
}

export function ContextTab({ client, onAccountCreated }: ContextTabProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

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

  // Account fields
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

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

  const handleCreateAccount = async () => {
    if (!client || !businessName || !industry || !username) {
      toast({
        title: "Campos requeridos",
        description: "Completa: Nombre negocio, Industria, Usuario",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const contextData: ContextData = {
        business_name: businessName,
        industry,
        description: description || undefined,
        website_url: websiteUrl || undefined,
        keywords,
        forbidden_words: forbiddenWords,
        forbidden_topics: forbiddenTopics,
        tones: selectedTones,
        goals: selectedGoals,
      };

      await createAccountWithContext({
        client_id: client.id,
        platform,
        username,
        profile_url: profileUrl || undefined,
        context: contextData,
      });

      setUsername("");
      setProfileUrl("");
      toast({ title: "Cuenta creada con su contexto" });
      onAccountCreated?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

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

      {/* Agregar Cuenta */}
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

        <Button className="w-full gradient-primary" onClick={handleCreateAccount} disabled={!username.trim() || isCreating}>
          {isCreating && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          <Plus className="mr-1 h-3 w-3" />
          Crear Cuenta con Contexto
        </Button>
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
