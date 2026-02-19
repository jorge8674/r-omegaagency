import { useState, useEffect, useCallback, useRef } from "react";
import { loadContextDocs } from "./NovaChatContext";
import { omegaApi } from "@/lib/api/omega";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "nova_chat_history";
const MAX_MESSAGES = 50;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nova-chat`;

function loadHistory(): ChatMessage[] {
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

export function useNovaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // On mount: try remote, fallback to local
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
    let assistantContent = "";

    try {
      const contextDocs = loadContextDocs();
      const contextBlock = contextDocs.length > 0
        ? `\n\nDocumentos de contexto adicional que Ibrain te ha dado:\n${contextDocs.map((d) => `--- ${d.name} ---\n${d.content}`).join("\n\n")}`
        : "";

      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: nextMessages, contextBlock }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        if (res.status === 429) throw new Error(body.error ?? "Rate limit alcanzado");
        if (res.status === 402) throw new Error(body.error ?? "Créditos insuficientes");
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          const line = buf.slice(0, idx).replace(/\r$/, "");
          buf = buf.slice(idx + 1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const chunk = JSON.parse(json);
            const delta = chunk.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              assistantContent += delta;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch { /* partial */ }
        }
      }

      // Persist final state remotely
      const finalMsgs = [...nextMessages, { role: "assistant" as const, content: assistantContent }];
      await persistHistory(finalMsgs);

    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
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
