// src/pages/Clients/components/ClientModal/AccountsTab.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Pencil, Trash2, Share2 } from "lucide-react";
import { PlatformIcon, getPlatformLabel } from "@/components/icons/PlatformIcon";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAccountsTab } from "./hooks/useAccountsTab";
import { ContextEditSheet } from "./ContextEditSheet";

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
  const tab = useAccountsTab(clientId, isEdit);

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
        <span>{tab.accounts.length} / {PLAN_LIMITS[plan] === 999 ? "∞" : PLAN_LIMITS[plan]} cuentas</span>
      </div>

      {tab.isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : tab.accounts.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">
          Sin cuentas. Ve al tab Contexto para agregar.
        </p>
      ) : (
        <div className="space-y-2">
          {tab.accounts.map((acc) => {
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
                <div className="flex items-center gap-1.5 cursor-help" title={healthDesc}>
                  <div className={`h-2.5 w-2.5 rounded-full ${hasContext ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-xs font-medium ${hasContext ? "text-green-600" : "text-red-500"}`}>
                    {healthLabel}
                  </span>
                </div>
                <Button
                  variant="outline" size="sm"
                  onClick={() => tab.handleEdit(acc)}
                  disabled={tab.isLoadingContext}
                >
                  {tab.isLoadingContext && tab.editingAccount?.id === acc.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <><Pencil className="mr-1 h-3.5 w-3.5" />Actualizar</>
                  )}
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => tab.setDeleteId(acc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <ContextEditSheet
        editingAccount={tab.editingAccount}
        onClose={() => tab.setEditingAccount(null)}
        isSaving={tab.isSaving}
        businessName={tab.businessName} setBusinessName={tab.setBusinessName}
        industry={tab.industry} setIndustry={tab.setIndustry}
        description={tab.description} setDescription={tab.setDescription}
        websiteUrl={tab.websiteUrl} setWebsiteUrl={tab.setWebsiteUrl}
        keywords={tab.keywords} setKeywords={tab.setKeywords}
        forbiddenWords={tab.forbiddenWords} setForbiddenWords={tab.setForbiddenWords}
        forbiddenTopics={tab.forbiddenTopics} setForbiddenTopics={tab.setForbiddenTopics}
        selectedTones={tab.selectedTones} toggleTone={tab.toggleTone}
        selectedGoals={tab.selectedGoals} toggleGoal={tab.toggleGoal}
        onSave={tab.handleSaveContext}
      />

      <AlertDialog open={!!tab.deleteId} onOpenChange={(open) => !open && tab.setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => tab.deleteId && tab.deleteMutation.mutate(tab.deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
