// src/pages/Clients/components/ClientModal/AccountsTab.tsx
// Responsabilidad: Listar y actualizar cuentas sociales (solo lectura + edición inline)

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Share2, Pencil } from "lucide-react";
import {
  listSocialAccounts,
  updateAccountWithContext,
  type SocialAccountProfile,
} from "@/lib/api/socialAccounts";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "pinterest", label: "Pinterest" },
];

interface AccountsTabProps {
  clientId: string | null;
  plan: string;
  isEdit: boolean;
}

export function AccountsTab({ clientId, plan, isEdit }: AccountsTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Edit inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editProfileUrl, setEditProfileUrl] = useState("");

  const { data: accountsData, isLoading } = useQuery({
    queryKey: ["social-accounts-railway", clientId],
    queryFn: () => listSocialAccounts(clientId!),
    enabled: !!clientId && isEdit,
  });

  const accounts = accountsData?.data ?? [];

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { username?: string; profile_url?: string } }) => {
      return updateAccountWithContext(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts-railway", clientId] });
      setEditingId(null);
      toast({ title: "Cuenta actualizada" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEditing = (acc: SocialAccountProfile) => {
    setEditingId(acc.id);
    setEditUsername(acc.username);
    setEditProfileUrl(acc.profile_url ?? "");
  };

  const saveEdit = (id: string) => {
    updateMutation.mutate({
      id,
      data: {
        username: editUsername.trim() || undefined,
        profile_url: editProfileUrl.trim() || undefined,
      },
    });
  };

  const platformLabel = (p: string) =>
    PLATFORMS.find((pl) => pl.value === p)?.label ?? p;

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

  return (
    <div className="space-y-4 mt-4">
      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : accounts.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">
          Sin cuentas sociales vinculadas. Agrega cuentas desde el tab Contexto.
        </p>
      ) : (
        <div className="space-y-2">
          {accounts.map((acc) => (
            <div key={acc.id} className="rounded-lg border border-border/30 bg-muted/20 p-3">
              {editingId === acc.id ? (
                <div className="space-y-2">
                  <Input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="@usuario" className="h-8 text-sm" />
                  <Input value={editProfileUrl} onChange={(e) => setEditProfileUrl(e.target.value)} placeholder="URL del perfil" className="h-8 text-sm" />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancelar</Button>
                    <Button size="sm" onClick={() => saveEdit(acc.id)} disabled={updateMutation.isPending}>
                      {updateMutation.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                      Guardar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{acc.username}</p>
                    <p className="text-xs text-muted-foreground">{platformLabel(acc.platform)}</p>
                  </div>
                  {acc.is_active && <div className="h-2 w-2 rounded-full bg-primary" />}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => startEditing(acc)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
