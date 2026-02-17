// src/pages/Clients/components/ClientModal/AccountsTab.tsx
// Responsabilidad: CRUD de cuentas sociales del cliente dentro del modal

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Share2, Pencil } from "lucide-react";
import type { ClientPlan } from "@/lib/api/clients";

const PLATFORMS = [
  { value: "instagram", label: "Instagram", emoji: "📸" },
  { value: "facebook", label: "Facebook", emoji: "📘" },
  { value: "tiktok", label: "TikTok", emoji: "🎵" },
  { value: "twitter", label: "X / Twitter", emoji: "🐦" },
  { value: "linkedin", label: "LinkedIn", emoji: "💼" },
  { value: "youtube", label: "YouTube", emoji: "🎬" },
];

const PLAN_LIMITS: Record<ClientPlan, number> = {
  basic: 2,
  pro: 5,
  enterprise: 999,
};

interface AccountsTabProps {
  clientId: string | null;
  plan: ClientPlan;
  isEdit: boolean;
}

export function AccountsTab({ clientId, plan, isEdit }: AccountsTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { profile } = useOrganization();
  const organizationId = profile?.organization_id;

  const [platform, setPlatform] = useState("instagram");
  const [accountName, setAccountName] = useState("");
  const [accountUrl, setAccountUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const limit = PLAN_LIMITS[plan];

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["social_accounts", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from("social_accounts")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!clientId && isEdit,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!clientId || !organizationId) throw new Error("Missing IDs");
      const { error } = await supabase.from("social_accounts").insert({
        client_id: clientId,
        organization_id: organizationId,
        platform,
        account_name: accountName.trim(),
        account_url: accountUrl.trim() || null,
        connected: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_accounts", clientId] });
      resetForm();
      toast({ title: "Cuenta agregada" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingId) return;
      const { error } = await supabase.from("social_accounts").update({
        platform,
        account_name: accountName.trim(),
        account_url: accountUrl.trim() || null,
      }).eq("id", editingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_accounts", clientId] });
      resetForm();
      toast({ title: "Cuenta actualizada" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_accounts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_accounts", clientId] });
      toast({ title: "Cuenta eliminada" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setPlatform("instagram");
    setAccountName("");
    setAccountUrl("");
    setEditingId(null);
  };

  const startEdit = (acc: typeof accounts[number]) => {
    setEditingId(acc.id);
    setPlatform(acc.platform);
    setAccountName(acc.account_name);
    setAccountUrl(acc.account_url ?? "");
  };

  const handleSubmit = () => {
    if (!accountName.trim()) return;
    if (editingId) {
      updateMutation.mutate();
    } else {
      if (accounts.length >= limit) {
        toast({ title: "Límite alcanzado", description: `Plan ${plan}: máximo ${limit} cuentas`, variant: "destructive" });
        return;
      }
      createMutation.mutate();
    }
  };

  const platformConfig = (p: string) =>
    PLATFORMS.find((pl) => pl.value === p) || { label: p, emoji: "🌐" };

  if (!isEdit || !clientId) {
    return (
      <Card className="border-dashed mt-4">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Share2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground text-center">
            Crea el cliente primero para vincular cuentas sociales
          </p>
        </CardContent>
      </Card>
    );
  }

  const isBusy = createMutation.isPending || updateMutation.isPending;
  const atLimit = accounts.length >= limit && !editingId;

  return (
    <div className="space-y-4 mt-4">
      {/* Form */}
      <div className="space-y-3 rounded-lg border border-border/50 p-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Plataforma</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.emoji} {p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Nombre de cuenta *</Label>
            <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="@usuario" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">URL del perfil</Label>
          <Input value={accountUrl} onChange={(e) => setAccountUrl(e.target.value)} placeholder="https://instagram.com/usuario" />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {accounts.length}/{limit === 999 ? "∞" : limit} cuentas
          </p>
          <div className="flex gap-2">
            {editingId && (
              <Button variant="ghost" size="sm" onClick={resetForm}>Cancelar</Button>
            )}
            <Button
              size="sm"
              className="gradient-primary"
              onClick={handleSubmit}
              disabled={!accountName.trim() || isBusy || atLimit}
            >
              {isBusy && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              {editingId ? "Guardar" : <><Plus className="mr-1 h-3 w-3" />Agregar</>}
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : accounts.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">
          Sin cuentas sociales vinculadas
        </p>
      ) : (
        <div className="space-y-2">
          {accounts.map((acc) => {
            const config = platformConfig(acc.platform);
            return (
              <div
                key={acc.id}
                className="flex items-center gap-3 rounded-lg border border-border/30 bg-muted/20 p-2.5"
              >
                <span className="text-lg">{config.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{acc.account_name}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(acc)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteMutation.mutate(acc.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
