// src/pages/Clients/components/ClientModal/AccountsTab.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Loader2, ChevronLeft, Share2 } from "lucide-react";
import { PlatformIcon, getPlatformLabel } from "@/components/icons/PlatformIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  listSocialAccounts,
  deleteSocialAccount,
  updateAccountWithContext,
  type SocialAccountProfile,
} from "@/lib/api/socialAccounts";
import { apiCall } from "@/lib/api/core";
import { ChipsInput } from "@/components/ui/ChipsInput";

// Platform config now uses PlatformIcon component

const TONE_OPTIONS = [
  "Profesional", "Inspiracional", "Humorístico",
  "Casual", "Educativo", "Energético",
];

const GOAL_OPTIONS = [
  "Ventas", "Comunidad", "Retención", "Awareness", "Leads",
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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<SocialAccountProfile | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Context edit fields
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);
  const [forbiddenTopics, setForbiddenTopics] = useState<string[]>([]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const { data: accountsData, isLoading } = useQuery({
    queryKey: ["social-accounts-railway", clientId],
    queryFn: () => listSocialAccounts(clientId!),
    enabled: !!clientId && isEdit,
  });

  const accounts = accountsData?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: deleteSocialAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts-railway", clientId] });
      toast({ title: "Cuenta eliminada" });
      setDeleteId(null);
    },
    onError: (e: Error) => toast({
      title: "Error al eliminar",
      description: e.message,
      variant: "destructive",
    }),
  });

  const handleEdit = async (account: SocialAccountProfile) => {
    setIsLoadingContext(true);
    setEditingAccount(account);
    try {
      const result = await apiCall<{ data: SocialAccountProfile & { context?: Record<string, unknown> } }>(
        `/social-accounts/with-context/${account.id}/`
      );
      const ctx = result?.data?.context as Record<string, unknown> | undefined;

      setBusinessName((ctx?.business_name as string) || "");
      setIndustry((ctx?.industry as string) || "");
      setDescription((ctx?.business_description as string) || (ctx?.description as string) || "");
      setWebsiteUrl((ctx?.website_url as string) || "");
      setKeywords((ctx?.keywords as string[]) || []);
      setForbiddenWords((ctx?.forbidden_words as string[]) || []);
      setForbiddenTopics((ctx?.forbidden_topics as string[]) || []);
      setSelectedTones(
        (ctx?.tones as string[]) ||
        (ctx?.communication_tone ? [ctx.communication_tone as string] : [])
      );
      setSelectedGoals(
        (ctx?.goals as string[]) ||
        (ctx?.primary_goal ? [ctx.primary_goal as string] : [])
      );
    } catch {
      toast({ title: "Error cargando contexto", variant: "destructive" });
      setEditingAccount(null);
    } finally {
      setIsLoadingContext(false);
    }
  };

  const handleSaveContext = async () => {
    if (!editingAccount) return;
    setIsSaving(true);
    try {
      await updateAccountWithContext(editingAccount.id, {
        context: {
          business_name: businessName,
          industry,
          description,
          website_url: websiteUrl,
          keywords,
          forbidden_words: forbiddenWords,
          forbidden_topics: forbiddenTopics,
          tones: selectedTones,
          goals: selectedGoals,
        },
      });
      toast({ title: "✅ Contexto actualizado" });
      setEditingAccount(null);
      queryClient.invalidateQueries({ queryKey: ["social-accounts-railway", clientId] });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast({ title: "Error guardando", description: msg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTone = (tone: string) =>
    setSelectedTones((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]
    );

  const toggleGoal = (goal: string) =>
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );

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
      <div>
        <h4 className="text-sm font-semibold">Cuentas de Redes Sociales</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Agrega cuentas desde el tab Contexto. Aquí puedes editar el contexto de cada cuenta o eliminarla.
        </p>
      </div>

      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded flex justify-between">
        <span>Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
        <span>{accounts.length} / {PLAN_LIMITS[plan] === 999 ? "∞" : PLAN_LIMITS[plan]} cuentas</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : accounts.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">
          Sin cuentas. Ve al tab Contexto para agregar.
        </p>
      ) : (
        <div className="space-y-2">
          {accounts.map((acc) => {
            const hasContext = !!acc.context_id;
            const healthLabel = hasContext ? "Listo" : "Sin contexto";
            const healthDesc = hasContext
              ? "Contexto configurado — listo para Content Lab"
              : "Falta contexto — haz click en Actualizar para configurar";
            return (
              <div key={acc.id} className="flex items-center gap-3 rounded-lg border border-border/30 bg-muted/20 p-3">
                <PlatformIcon platform={acc.platform} size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{acc.username}</p>
                  <p className="text-xs text-muted-foreground">{getPlatformLabel(acc.platform)}</p>
                </div>
                {/* Health indicator */}
                <div className="flex items-center gap-1.5 cursor-help" title={healthDesc}>
                  <div className={`h-2.5 w-2.5 rounded-full ${hasContext ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-xs font-medium ${hasContext ? "text-green-600" : "text-red-500"}`}>
                    {healthLabel}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(acc)}
                  disabled={isLoadingContext}
                >
                  {isLoadingContext && editingAccount?.id === acc.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      Actualizar
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteId(acc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Context Edit Sheet */}
      <Sheet open={!!editingAccount} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingAccount(null)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              Contexto — {editingAccount?.username}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nombre del negocio *</Label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Industria *</Label>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." />
            </div>

            <ChipsInput value={keywords} onChange={setKeywords} label="Keywords" placeholder="keyword + Enter" />
            <ChipsInput value={forbiddenWords} onChange={setForbiddenWords} label="Palabras prohibidas" placeholder="palabra + Enter" />
            <ChipsInput value={forbiddenTopics} onChange={setForbiddenTopics} label="Temas prohibidos" placeholder="tema + Enter" />

            <div className="space-y-2">
              <Label>Tono de comunicación</Label>
              <div className="grid grid-cols-3 gap-2">
                {TONE_OPTIONS.map((tone) => (
                  <label key={tone} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox checked={selectedTones.includes(tone)} onCheckedChange={() => toggleTone(tone)} />
                    <span className="text-sm">{tone}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Objetivos</Label>
              <div className="grid grid-cols-3 gap-2">
                {GOAL_OPTIONS.map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox checked={selectedGoals.includes(goal)} onCheckedChange={() => toggleGoal(goal)} />
                    <span className="text-sm">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              className="w-full gradient-primary"
              onClick={handleSaveContext}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Contexto
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
