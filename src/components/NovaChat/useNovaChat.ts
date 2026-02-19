import { useState, useEffect, useCallback } from "react";
import { loadContextDocs } from "./NovaChatContext";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

const STORAGE_KEY = "nova_chat_history";
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://omegaraisen-production-2031.up.railway.app/api/v1";

function saveLocal(msgs: ChatMessage[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
}

function saveSilent(msgs: ChatMessage[]): void {
  fetch(`${API_BASE}/nova/data/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data_type: "chat_history", content: msgs }),
  }).catch((err) => console.warn("Backend save failed (non-critical)", err));
}

async function loadHistory(): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/nova/data/?type=chat_history`);
    if (res.ok) {
      const data = await res.json() as { content?: ChatMessage[] };
      if (Array.isArray(data.content) && data.content.length > 0) {
        return data.content;
      }
    }
  } catch {
    console.warn("Loading from localStorage fallback");
  }
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    return local ? (JSON.parse(local) as ChatMessage[]) : [];
  } catch { return []; }
}

export function useNovaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory().then(setMessages);
  }, []);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMsg: ChatMessage = {
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const historyWithUser = [...messages, userMsg];
    setMessages(historyWithUser);
    setIsLoading(true);

    try {
      const contextDocs = loadContextDocs().map((d) => ({
        name: d.name,
        content: d.content,
      }));

      const response = await fetch(`${API_BASE}/nova/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyWithUser, // historial completo — backend toma los últimos 10
          context_docs: contextDocs,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(`Chat failed: ${response.status}${errText ? ` - ${errText}` : ""}`);
      }

      const data = await response.json() as { role: string; content: string };
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      const finalHistory = [...historyWithUser, assistantMsg];
      setMessages(finalHistory);
      saveLocal(finalHistory);
      saveSilent(finalHistory);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message ?? "Error desconocido");
        setMessages([...historyWithUser, {
          role: "assistant",
          content: "⚠️ Error al comunicarme con NOVA. Verifica que el backend esté activo.",
          timestamp: new Date().toISOString(),
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearHistory = useCallback(() => {
    if (!confirm("¿Estás seguro? Esto borrará toda la conversación con NOVA.")) return;
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    saveSilent([]);
  }, []);

  return { messages, isLoading, error, send, clearHistory };
}
