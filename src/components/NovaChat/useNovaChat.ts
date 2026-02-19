import { useState, useEffect, useCallback, useRef } from "react";
import { loadContextDocs } from "./NovaChatContext";
import { omegaApi } from "@/lib/api/omega";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "nova_chat_history";
const MAX_MESSAGES = 50;
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://omegaraisen-production-2031.up.railway.app/api/v1";

function loadLocalHistory(): ChatMessage[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as ChatMessage[];
  } catch { return []; }
}

function saveLocalHistory(msgs: ChatMessage[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_MESSAGES)));
}

async function persistHistory(msgs: ChatMessage[]): Promise<void> {
  try {
    await omegaApi.saveNovaData("chat_history", msgs.slice(-MAX_MESSAGES));
  } catch { /* silent — localStorage is the fallback */ }
}

async function loadRemoteHistory(): Promise<ChatMessage[] | null> {
  try {
    const res = await omegaApi.loadNovaData("chat_history");
    const content = res?.content;
    if (Array.isArray(content) && content.length > 0) return content as ChatMessage[];
    return null;
  } catch { return null; }
}

async function sendToBackend(
  messages: ChatMessage[],
  contextDocs: { name: string; content: string }[]
): Promise<ChatMessage> {
  const response = await fetch(`${API_BASE}/nova/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context_docs: contextDocs }),
  });

  if (!response.ok) {
    throw new Error(`Chat failed: ${response.status}`);
  }

  const data = await response.json() as { role: string; content: string };
  return { role: "assistant", content: data.content };
}

export function useNovaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadLocalHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadRemoteHistory().then((remote) => {
      if (remote) setMessages(remote);
    });
  }, []);

  useEffect(() => {
    saveLocalHistory(messages);
  }, [messages]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const nextMessages = [...messages, userMsg].slice(-MAX_MESSAGES);
    setMessages(nextMessages);
    setIsLoading(true);

    abortRef.current = new AbortController();

    try {
      const contextDocs = loadContextDocs().map((d) => ({
        name: d.name,
        content: d.content,
      }));

      const assistantMsg = await sendToBackend(nextMessages, contextDocs);

      const finalMsgs = [...nextMessages, assistantMsg];
      setMessages(finalMsgs);
      persistHistory(finalMsgs).catch(() => {});
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message ?? "Error desconocido");
        setMessages([...nextMessages, {
          role: "assistant",
          content: "⚠️ Error al comunicarme con el servidor. Por favor intenta de nuevo.",
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    persistHistory([]).catch(() => {});
  }, []);

  return { messages, isLoading, error, send, clearHistory };
}
