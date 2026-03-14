// src/pages/Clients/components/ClientModal/ContextTab.tsx
// Responsabilidad: Contexto de marca + lista local de cuentas sociales pendientes

import { useState, forwardRef, useImperativeHandle } from "react";
import { createAccountWithContext } from "@/lib/api/socialAccounts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Palette, Loader2, ArrowRight } from "lucide-react";
import { BrandFilesUpload } from "./BrandFilesUpload";
import { SocialAccountForm } from "./SocialAccountForm";
import { ContextBrandVoiceSection } from "./ContextBrandVoiceSection";
import type { Platform, ContextData } from "@/lib/api/socialAccounts";

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
  onAccountsCreated?: () => void;
}

export const ContextTab = forwardRef<ContextTabRef, ContextTabProps>(
  ({ client, onAccountsCreated }, ref) => {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const [businessName, setBusinessName] = useState("");
    const [industry, setIndustry] = useState("");
    const [description, setDescription] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);
    const [forbiddenTopics, setForbiddenTopics] = useState<string[]>([]);
    const [selectedTones, setSelectedTones] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const [platform, setPlatform] = useState<Platform>("instagram");
    const [username, setUsername] = useState("");
    const [profileUrl, setProfileUrl] = useState("");
    const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>([]);

    const toggleTone = (tone: string) =>
      setSelectedTones((prev) => prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]);

    const toggleGoal = (goal: string) =>
      setSelectedGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]);

    useImperativeHandle(ref, () => ({
      getData: () => {
        if (!businessName.trim() || !industry.trim()) return null;
        return {
          context: {
            business_name: businessName.trim(),
            industry: industry.trim(),
            description: description.trim() || undefined,
            website_url: websiteUrl.trim() || undefined,
            keywords, forbidden_words: forbiddenWords,
            forbidden_topics: forbiddenTopics,
            tones: selectedTones, goals: selectedGoals,
          },
          pendingAccounts,
        };
      },
    }));

    const handleAddAccount = () => {
      if (!username.trim()) return;
      const exists = pendingAccounts.some((a) => a.platform === platform && a.username === username.trim());
      if (exists) {
        toast({ title: "Cuenta duplicada", variant: "destructive" });
        return;
      }
      setPendingAccounts((prev) => [...prev, { platform, username: username.trim(), profile_url: profileUrl.trim() || undefined }]);
      setUsername("");
      setProfileUrl("");
      toast({ title: "Cuenta agregada a la lista" });
    };

    const removeAccount = (index: number) => setPendingAccounts((prev) => prev.filter((_, i) => i !== index));

    const handleSaveAccounts = async () => {
      if (!client || pendingAccounts.length === 0) {
        toast({ title: "Agrega al menos una cuenta", description: "Necesitas agregar una cuenta social antes de continuar", variant: "destructive" });
        return;
      }
      setIsSaving(true);
      const count = pendingAccounts.length;
      try {
        for (const account of pendingAccounts) {
          await createAccountWithContext({ client_id: client.id, platform: account.platform, username: account.username, profile_url: account.profile_url, context: { business_name: businessName, industry, description, website_url: websiteUrl, keywords, forbidden_words: forbiddenWords, forbidden_topics: forbiddenTopics, tones: selectedTones, goals: selectedGoals } });
        }
        try { await fetch(`https://omegaraisen-production-2031.up.railway.app/api/v1/nova/context/${client.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ niche: industry, business_what: description, tone: selectedTones[0] || undefined }) }); } catch { /* silent */ }
        setPendingAccounts([]);
        toast({ title: `✅ ${count} cuenta(s) guardadas` });
        onAccountsCreated?.();
      } catch (error: unknown) {
        toast({ title: "Error al guardar", description: error instanceof Error ? error.message : "Error guardando cuentas", variant: "destructive" });
      } finally { setIsSaving(false); }
    };

    if (!client) {
      return (
        <Card className="border-dashed mt-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Palette className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground text-center">Primero guarda el cliente para configurar contexto.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6 mt-4">
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

        <SocialAccountForm
          platform={platform} setPlatform={setPlatform}
          username={username} setUsername={setUsername}
          profileUrl={profileUrl} setProfileUrl={setProfileUrl}
          pendingAccounts={pendingAccounts}
          onAdd={handleAddAccount}
          onRemove={removeAccount}
        />

        <ContextBrandVoiceSection
          websiteUrl={websiteUrl} setWebsiteUrl={setWebsiteUrl}
          keywords={keywords} setKeywords={setKeywords}
          forbiddenWords={forbiddenWords} setForbiddenWords={setForbiddenWords}
          forbiddenTopics={forbiddenTopics} setForbiddenTopics={setForbiddenTopics}
          selectedTones={selectedTones} toggleTone={toggleTone}
          selectedGoals={selectedGoals} toggleGoal={toggleGoal}
        />

        <div className="border-t border-border pt-4">
          <BrandFilesUpload client={client} />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            className="gradient-primary"
            onClick={handleSaveAccounts}
            disabled={isSaving || pendingAccounts.length === 0}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar y Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
);

ContextTab.displayName = "ContextTab";
