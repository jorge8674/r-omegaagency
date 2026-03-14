import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  listSocialAccounts, deleteSocialAccount, updateAccountWithContext,
  type SocialAccountProfile,
} from "@/lib/api/socialAccounts";
import { apiCall } from "@/lib/api/core";

export function useAccountsTab(clientId: string | null, isEdit: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<SocialAccountProfile | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    onError: (e: Error) => toast({ title: "Error al eliminar", description: e.message, variant: "destructive" }),
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
      setSelectedTones((ctx?.tones as string[]) || (ctx?.communication_tone ? [ctx.communication_tone as string] : []));
      setSelectedGoals((ctx?.goals as string[]) || (ctx?.primary_goal ? [ctx.primary_goal as string] : []));
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
          business_name: businessName, industry, description, website_url: websiteUrl,
          keywords, forbidden_words: forbiddenWords, forbidden_topics: forbiddenTopics,
          tones: selectedTones, goals: selectedGoals,
        },
      });
      toast({ title: "✅ Contexto actualizado" });
      setEditingAccount(null);
      queryClient.invalidateQueries({ queryKey: ["social-accounts-railway", clientId] });
    } catch (e: unknown) {
      toast({ title: "Error guardando", description: e instanceof Error ? e.message : "Error desconocido", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTone = (tone: string) =>
    setSelectedTones((prev) => prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]);

  const toggleGoal = (goal: string) =>
    setSelectedGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]);

  return {
    deleteId, setDeleteId, editingAccount, setEditingAccount,
    isLoadingContext, isSaving,
    businessName, setBusinessName, industry, setIndustry,
    description, setDescription, websiteUrl, setWebsiteUrl,
    keywords, setKeywords, forbiddenWords, setForbiddenWords,
    forbiddenTopics, setForbiddenTopics, selectedTones, selectedGoals,
    accounts, isLoading, deleteMutation,
    handleEdit, handleSaveContext, toggleTone, toggleGoal,
  };
}
