import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChipsInput } from "@/components/ui/ChipsInput";

const TONE_OPTIONS = [
  "Profesional", "Inspiracional", "Humorístico",
  "Casual", "Educativo", "Energético",
];

const GOAL_OPTIONS = ["Ventas", "Comunidad", "Retención", "Awareness", "Leads"];

interface ContextBrandVoiceSectionProps {
  websiteUrl: string;
  setWebsiteUrl: (v: string) => void;
  keywords: string[];
  setKeywords: (v: string[]) => void;
  forbiddenWords: string[];
  setForbiddenWords: (v: string[]) => void;
  forbiddenTopics: string[];
  setForbiddenTopics: (v: string[]) => void;
  selectedTones: string[];
  toggleTone: (v: string) => void;
  selectedGoals: string[];
  toggleGoal: (v: string) => void;
}

export function ContextBrandVoiceSection({
  websiteUrl, setWebsiteUrl,
  keywords, setKeywords,
  forbiddenWords, setForbiddenWords,
  forbiddenTopics, setForbiddenTopics,
  selectedTones, toggleTone,
  selectedGoals, toggleGoal,
}: ContextBrandVoiceSectionProps) {
  return (
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
  );
}
