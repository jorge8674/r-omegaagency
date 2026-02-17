import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Share2 } from "lucide-react";
import {
  listSocialAccounts,
  createSocialAccount,
  deleteSocialAccount,
  type SocialAccountCreate,
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

const PLAN_LIMITS: Record<string, number> = {
  basic: 2,
  pro: 5,
  enterprise: 999,
};

interface AccountsTabProps {
  clientId: string | null;
  plan: string;
  isEdit: boolean;
}

export function AccountsTab({ clientId, plan, isEdit }: AccountsTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [platform, setPlatform] = useState("instagram");
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

  const limit = PLAN_LIMITS[plan] ?? 2;

  const { data: accountsData, isLoading } = useQuery({
    queryKey: ["social-accounts-railway", clientId],
    queryFn: () => listSocialAccounts(clientId!),
    enabled: !!clientId && isEdit,
  });

  const accounts = accountsData?.data ?? [];

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!clientId) throw new Error("Missing client ID");
      const payload: SocialAccountCreate = {
        client_id: clientId,
        platform,
        username: username.trim(),
        profile_url: profileUrl.trim() || undefined,
      };
      return createSocialAccount(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts-railway", clientId] });
      resetForm();
      toast({ title: "Cuenta agregada" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSocialAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts-railway", clientId] });
      toast({ title: "Cuenta eliminada" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setPlatform("instagram");
    setUsername("");
    setProfileUrl("");
  };

  const handleSubmit = () => {
    if (!username.trim()) return;
    if (accounts.length >= limit) {
      toast({
        title: "Límite alcanzado",
        description: `Plan ${plan}: máximo ${limit} cuentas`,
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate();
  };

  const platformConfig = (p: string) =>
    PLATFORMS.find((pl) => pl.value === p) || { label: p };

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

  const isBusy = createMutation.isPending;
  const atLimit = accounts.length >= limit;

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
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Nombre de usuario *</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@usuario"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">URL del perfil</Label>
          <Input
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="https://instagram.com/usuario"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {accounts.length}/{limit === 999 ? "∞" : limit} cuentas
          </p>
          <Button
            size="sm"
            className="gradient-primary"
            onClick={handleSubmit}
            disabled={!username.trim() || isBusy || atLimit}
          >
            {isBusy && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            <Plus className="mr-1 h-3 w-3" />
            Agregar
          </Button>
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{acc.username}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
                {acc.is_active && (
                  <div className="h-2 w-2 rounded-full bg-success" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteMutation.mutate(acc.id)}
                  disabled={deleteMutation.isPending}
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
