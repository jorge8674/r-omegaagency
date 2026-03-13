import { useState, useRef, useEffect } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const SUGGESTIONS = [
  "¿Qué cliente necesita más atención?",
  "Resume la semana de mi agencia",
  "¿Qué oportunidades hay esta semana?",
];

export function NovaChip() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "nova"; text: string }[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: text.trim() },
      { role: "nova", text: "Estoy procesando tu solicitud. Esta función se conectará pronto con el backend de NOVA." },
    ]);
    setMsg("");
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Chip trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/50 text-amber-200 text-xs font-medium hover:bg-amber-900/60 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        NOVA
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[420px] h-[520px] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">NOVA · Vista de Agencia</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-border/50">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border/50 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
                <Bot className="h-8 w-8 opacity-30 mb-2" />
                <p className="text-xs">Pregunta lo que necesites sobre tu agencia</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${
                      m.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-secondary/60 text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border flex gap-2">
            <Textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="min-h-[40px] max-h-[80px] resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(msg);
                }
              }}
            />
            <Button
              size="icon"
              className="shrink-0 h-10 w-10"
              disabled={!msg.trim()}
              onClick={() => handleSend(msg)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
