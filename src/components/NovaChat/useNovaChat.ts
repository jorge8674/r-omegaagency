import { useState, useEffect, useCallback, useRef } from "react";
import { loadContextDocs } from "./NovaChatContext";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const STORAGE_KEY = "nova_chat_history";
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://omegaraisen-production-2031.up.railway.app/api/v1";

function saveLocal(msgs: ChatMessage[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  console.log("💾 Guardado en localStorage:", msgs.length, "mensajes");
}

function saveSilent(msgs: ChatMessage[]): void {
  fetch(`${API_BASE}/nova/data/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data_type: "chat_history", content: msgs }),
  })
    .then(() => console.log("💾 Guardado en backend"))
    .catch((err) => console.warn("⚠️ Backend save failed (non-critical)", err));
}

async function loadRemoteHistory(): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/nova/data/?type=chat_history`);
    if (res.ok) {
      const data = await res.json() as { content?: ChatMessage[] };
      if (Array.isArray(data.content) && data.content.length > 0) {
        console.log("✅ Historial cargado desde backend:", data.content.length, "mensajes");
        return data.content;
      }
    }
  } catch {
    console.warn("⚠️ Backend load failed, usando localStorage");
  }
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    const parsed = local ? (JSON.parse(local) as ChatMessage[]) : [];
    console.log("✅ Historial cargado desde localStorage:", parsed.length, "mensajes");
    return parsed;
  } catch { return []; }
}

export function useNovaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref para evitar stale closure en send
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  useEffect(() => {
    loadRemoteHistory().then(setMessages);
  }, []);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMsg: ChatMessage = {
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    // Leer del ref para garantizar historial actualizado
    const historyWithUser = [...messagesRef.current, userMsg];
    setMessages(historyWithUser);

    console.log("📤 Enviando al backend:", historyWithUser.length, "mensajes");

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
          messages: historyWithUser.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context_docs: contextDocs,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(`Chat failed: ${response.status}${errText ? ` - ${errText}` : ""}`);
      }

      const data = await response.json() as { role: string; content: string };
      console.log("📥 Respuesta de NOVA recibida");

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
      const errMsg = (e as Error).message ?? "Error desconocido";
      console.error("❌ Error en chat:", errMsg);
      setError(errMsg);
      setMessages([...historyWithUser, {
        role: "assistant",
        content: "⚠️ Error al comunicarme con NOVA. Verifica que el backend esté activo.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearHistory = useCallback(() => {
    if (!confirm("¿Borrar toda la conversación con NOVA?")) return;
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    saveSilent([]);
    console.log("🗑️ Historial borrado");
  }, []);

  return { messages, isLoading, error, send, clearHistory };
}
