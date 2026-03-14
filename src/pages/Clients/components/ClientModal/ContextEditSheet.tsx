import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChipsInput } from "@/components/ui/ChipsInput";
import { ChevronLeft, Loader2 } from "lucide-react";
import type { SocialAccountProfile } from "@/lib/api/socialAccounts";

const TONE_OPTIONS = ["Profesional", "Inspiracional", "Humorístico", "Casual", "Educativo", "Energético"];
const GOAL_OPTIONS = ["Ventas", "Comunidad", "Retención", "Awareness", "Leads"];

interface ContextEditSheetProps {
  editingAccount: SocialAccountProfile | null;
  onClose: () => void;
  isSaving: boolean;
  businessName: string; setBusinessName: (v: string) => void;
  industry: string; setIndustry: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  websiteUrl: string; setWebsiteUrl: (v: string) => void;
  keywords: string[]; setKeywords: (v: string[]) => void;
  forbiddenWords: string[]; setForbiddenWords: (v: string[]) => void;
  forbiddenTopics: string[]; setForbiddenTopics: (v: string[]) => void;
  selectedTones: string[]; toggleTone: (v: string) => void;
  selectedGoals: string[]; toggleGoal: (v: string) => void;
  onSave: () => void;
}

export function ContextEditSheet({
  editingAccount, onClose, isSaving,
  businessName, setBusinessName, industry, setIndustry,
  description, setDescription, websiteUrl, setWebsiteUrl,
  keywords, setKeywords, forbiddenWords, setForbiddenWords,
  forbiddenTopics, setForbiddenTopics,
  selectedTones, toggleTone, selectedGoals, toggleGoal,
  onSave,
}: ContextEditSheetProps) {
  return (
    <Sheet open={!!editingAccount} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            Contexto — {editingAccount?.username}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Nombre del negocio *</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Industria *</Label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." />
          </div>
          <ChipsInput value={keywords} onChange={setKeywords} label="Keywords" placeholder="keyword + Enter" />
          <ChipsInput value={forbiddenWords} onChange={setForbiddenWords} label="Palabras prohibidas" placeholder="palabra + Enter" />
          <ChipsInput value={forbiddenTopics} onChange={setForbiddenTopics} label="Temas prohibidos" placeholder="tema + Enter" />
          <div className="space-y-2">
            <Label>Tono de comunicación</Label>
            <div className="grid grid-cols-3 gap-2">
              {TONE_OPTIONS.map((tone) => (
                <label key={tone} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox checked={selectedTones.includes(tone)} onCheckedChange={() => toggleTone(tone)} />
                  <span className="text-sm">{tone}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Objetivos</Label>
            <div className="grid grid-cols-3 gap-2">
              {GOAL_OPTIONS.map((goal) => (
                <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox checked={selectedGoals.includes(goal)} onCheckedChange={() => toggleGoal(goal)} />
                  <span className="text-sm">{goal}</span>
                </label>
              ))}
            </div>
          </div>
          <Button className="w-full gradient-primary" onClick={onSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Contexto
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
