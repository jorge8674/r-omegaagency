import { useState, useEffect, useCallback } from "react";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { apiCall } from "@/lib/api/core";
import { useCalendarBlocks } from "../hooks/useCalendarBlocks";

interface SimpleOption { id: string; name: string }

const AGENTS = [
  "Instagram Publisher", "TikTok Publisher",
  "Facebook Publisher", "Manual",
] as const;

export function BlockAssignment() {
  const [clients, setClients] = useState<SimpleOption[]>([]);
  const [accounts, setAccounts] = useState<SimpleOption[]>([]);
  const [clientId, setClientId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [agent, setAgent] = useState<string>("");
  const { blocks, blocksLoading, fetchBlocks, confirmBlock } = useCalendarBlocks();

  useEffect(() => {
    apiCall<{ data: SimpleOption[] }>("/clients/").then((r) => setClients(r.data ?? [])).catch(() => {});
  }, []);

  const loadAccounts = useCallback((cId: string) => {
    setClientId(cId);
    setAccountId("");
    setSelectedBlock("");
    apiCall<{ data: Array<{ id: string; account_name?: string; name?: string }> }>(`/social-accounts/?client_id=${cId}`).then((r) => {
      const items = (r.data ?? []).map((a) => ({
        id: a.id,
        name: a.account_name ?? a.name ?? "",
      }));
      setAccounts(items);
    }).catch(() => {});
  }, []);

  const loadBlocks = useCallback((aId: string) => {
    setAccountId(aId);
    setSelectedBlock("");
    fetchBlocks(aId, undefined, undefined, "scheduled");
  }, [fetchBlocks]);

  const handlePublish = async (): Promise<void> => {
    if (!selectedBlock) return;
    await confirmBlock(selectedBlock);
    if (accountId) fetchBlocks(accountId, undefined, undefined, "scheduled");
  };

  const activeBlock = blocks.find((b) => b.id === selectedBlock);

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-display">Asignar Bloque</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Cliente</label>
          <Select value={clientId} onValueChange={loadAccounts}>
            <SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger>
            <SelectContent>{clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}</SelectContent>
          </Select>
        </div>

        {/* Account */}
        {clientId && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Cuenta Social</label>
            <Select value={accountId} onValueChange={loadBlocks}>
              <SelectTrigger><SelectValue placeholder="Selecciona cuenta" /></SelectTrigger>
              <SelectContent>{accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}</SelectContent>
            </Select>
          </div>
        )}

        {/* Blocks */}
        {accountId && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Bloques confirmados</label>
            {blocksLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : blocks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin bloques programados</p>
            ) : (
              <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                <SelectTrigger><SelectValue placeholder="Selecciona bloque" /></SelectTrigger>
                <SelectContent>{blocks.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.scheduled_date} {b.scheduled_time?.slice(0, 5)} — {b.text_content.slice(0, 40)}…
                  </SelectItem>
                ))}</SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Preview */}
        {activeBlock && (
          <div className="bg-muted/30 rounded-lg p-3 text-sm whitespace-pre-wrap line-clamp-4">
            {activeBlock.text_content}
          </div>
        )}

        {/* Agent */}
        {selectedBlock && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Agente encargado</label>
            <Select value={agent} onValueChange={setAgent}>
              <SelectTrigger><SelectValue placeholder="Selecciona agente" /></SelectTrigger>
              <SelectContent>{AGENTS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}</SelectContent>
            </Select>
          </div>
        )}

        {/* Publish */}
        {selectedBlock && agent && (
          <Button className="w-full" onClick={handlePublish}>
            <Send className="mr-1 h-4 w-4" /> Confirmar y Publicar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
