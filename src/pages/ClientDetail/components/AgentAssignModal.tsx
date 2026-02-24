import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiCall } from "@/lib/api/core";

interface AvailableAgent {
  code: string;
  name: string;
  role: string;
  department: string;
}

const AVAILABLE_AGENTS: AvailableAgent[] = [
  { code: "RAFA", name: "RAFA", role: "Senior Copywriter", department: "Marketing" },
  { code: "DUDA", name: "DUDA", role: "Brand Strategist", department: "Marketing" },
  { code: "MAYA", name: "MAYA", role: "Visual Designer", department: "Marketing" },
  { code: "LUAN", name: "LUAN", role: "Campaign Manager", department: "Marketing" },
  { code: "SARA", name: "SARA", role: "SEO Specialist", department: "Marketing" },
  { code: "MALU", name: "MALU", role: "Email Marketer", department: "Marketing" },
  { code: "LOLA", name: "LOLA", role: "Social Strategist", department: "Marketing" },
  { code: "DANI", name: "DANI", role: "Ads Optimizer", department: "Marketing" },
  { code: "PIXEL", name: "PIXEL", role: "Frontend Dev", department: "Tech" },
  { code: "SHIELD", name: "SHIELD", role: "Security Analyst", department: "Tech" },
  { code: "SCRIBE", name: "SCRIBE", role: "Tech Writer", department: "Tech" },
  { code: "PULSE_TECH", name: "PULSE TECH", role: "DevOps Monitor", department: "Tech" },
  { code: "ARCH", name: "ARCH", role: "Solutions Architect", department: "Tech" },
  { code: "ONYX", name: "ONYX", role: "Ops Coordinator", department: "Operations" },
  { code: "ECHO", name: "ECHO", role: "Feedback Analyst", department: "Operations" },
  { code: "ANCHOR", name: "ANCHOR", role: "Project Manager", department: "Operations" },
  { code: "NURTURE", name: "NURTURE", role: "Community Builder", department: "Community" },
  { code: "REVIEW", name: "REVIEW", role: "QA Reviewer", department: "Community" },
  { code: "ESTATE", name: "ESTATE", role: "Asset Manager", department: "Community" },
  { code: "CONSTRUCT", name: "CONSTRUCT", role: "Content Builder", department: "Community" },
];

const DEPARTMENTS = ["Marketing", "Tech", "Operations", "Community"];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clientId: string;
  clientName: string;
  onAssigned: () => void;
}

export function AgentAssignModal({ open, onOpenChange, clientId, clientName, onAssigned }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const handleAssign = async () => {
    if (selected.size === 0) return;
    setSubmitting(true);
    try {
      await apiCall(`/clients/${clientId}/agents/assign/`, "POST", {
        agent_codes: Array.from(selected),
      });
      toast({ title: `✅ ${selected.size} agentes asignados a ${clientName}` });
      setSelected(new Set());
      onAssigned();
      onOpenChange(false);
    } catch {
      toast({ title: "Error al asignar agentes", description: "El endpoint puede no estar disponible aún.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-syne">Asignar Agentes a {clientName}</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-4">
          {DEPARTMENTS.map((dept) => (
            <div key={dept}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{dept}</h4>
              <div className="grid grid-cols-1 gap-2">
                {AVAILABLE_AGENTS.filter((a) => a.department === dept).map((agent) => {
                  const checked = selected.has(agent.code);
                  return (
                    <button
                      key={agent.code}
                      type="button"
                      onClick={() => toggle(agent.code)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                        checked
                          ? "border-primary bg-primary/5"
                          : "border-border/40 bg-card/60 hover:border-border"
                      }`}
                    >
                      <Checkbox checked={checked} className="pointer-events-none" />
                      <Bot className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold">{agent.name}</span>
                        <p className="text-xs text-muted-foreground">{agent.role}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{dept}</Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border/30 mt-4">
          <Button onClick={handleAssign} disabled={selected.size === 0 || submitting} className="w-full">
            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            Asignar {selected.size > 0 ? `${selected.size} agentes` : "agentes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
