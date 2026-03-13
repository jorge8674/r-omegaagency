import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  agencyName: string;
}

const CHIPS = [
  "¿Qué cliente necesita más atención?",
  "Resume la semana de mi agencia",
  "¿Qué oportunidades hay esta semana?",
];

export function NovaDrawer({ open, onOpenChange, agencyName }: Props) {
  const [message, setMessage] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] flex flex-col">
        <SheetHeader className="border-b border-border/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-base font-display">
                NOVA · Vista de Agencia · {agencyName}
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setMessage(chip)}
                className="rounded-full border border-border/40 bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Bot className="h-12 w-12 opacity-20" />
            <p className="text-sm">Escribe tu consulta para NOVA</p>
          </div>
        </div>

        <div className="border-t border-border/30 pt-3 flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Pregunta a NOVA sobre tu agencia..."
            rows={2}
            className="flex-1 resize-none"
          />
          <Button
            size="icon"
            disabled={!message.trim()}
            className="shrink-0 self-end bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
