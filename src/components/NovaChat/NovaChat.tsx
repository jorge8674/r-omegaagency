// 170 lines
import { useRef, useEffect, useState } from "react";
import { Crown, Minus, Send, Trash2, X, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNovaChat } from "./useNovaChat";

interface Props {
  onClose: () => void;
  onMinimize: () => void;
}

export function NovaChat({ onClose, onMinimize }: Props) {
  const { messages, isLoading, error, send, clearHistory } = useNovaChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Drag state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const startRef = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    startRef.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: startRef.current.px + (e.clientX - startRef.current.mx),
        y: startRef.current.py + (e.clientY - startRef.current.my),
      });
    };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="fixed z-[60] flex flex-col rounded-2xl border-2 border-yellow-500/40 bg-background shadow-2xl shadow-yellow-500/10"
      style={{
        width: 400,
        height: 500,
        bottom: `calc(5rem + ${-pos.y}px)`,
        right: `calc(1.5rem + ${-pos.x}px)`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 rounded-t-2xl border-b border-yellow-500/20 bg-yellow-500/5 px-4 py-2.5 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal className="h-3.5 w-3.5 text-yellow-500/40" />
        <Crown className="h-4 w-4 text-yellow-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold text-yellow-400 leading-none">NOVA — CEO Agent</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-emerald-400">Online 24/7</span>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={clearHistory}>
          <Trash2 className="h-3 w-3 text-muted-foreground" />
        </Button>
        <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={onMinimize}>
          <Minus className="h-3 w-3 text-muted-foreground" />
        </Button>
        <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={onClose}>
          <X className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 px-4 py-3 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Crown className="h-8 w-8 text-yellow-400/30 mb-2" />
            <p className="text-xs">Hola, soy NOVA 🐢💎</p>
            <p className="text-[10px] mt-1 opacity-60">CEO Agent de OMEGA · Raisen Agency</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              msg.role === "assistant"
                ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
            }`}>
              {msg.role === "assistant" ? "NOVA" : "Ibrain"}
            </span>
            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
              msg.role === "assistant"
                ? "bg-yellow-500/5 border border-yellow-500/20 text-foreground"
                : "bg-primary/10 border border-primary/20 text-foreground"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-1">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">NOVA</span>
            <div className="flex gap-1 items-center px-3 py-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-yellow-400/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        {error && (
          <p className="text-xs text-destructive text-center px-3 py-1 rounded-lg border border-destructive/20 bg-destructive/5">{error}</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/30 p-3 flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe a NOVA…"
          rows={1}
          className="flex-1 resize-none rounded-lg border border-border/40 bg-muted/10 px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-yellow-500/40 scrollbar-thin"
          style={{ maxHeight: 80 }}
        />
        <Button
          size="icon"
          className="h-8 w-8 shrink-0 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
