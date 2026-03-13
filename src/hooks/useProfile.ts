import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOmegaAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const { user } = useOmegaAuth();
  const queryClient = useQueryClient();

  const clientId = user?.client_id;

  const profileQuery = useQuery({
    queryKey: ["my-profile", clientId],
    enabled: !!user && !!clientId,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", clientId!)
          .single();
        if (error) return null;
        return data;
      } catch {
        return null;
      }
    },
    retry: 0,
  });

  const updateAvatar = useMutation({
    mutationFn: async (file: File) => {
      if (!user || !clientId) throw new Error("Not authenticated");
      const ext = file.name.split(".").pop();
      const path = `${clientId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", clientId);
      if (updateError) throw updateError;

      return avatarUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  return {
    profile: profileQuery.data ?? null,
    loading: profileQuery.isLoading,
    avatarUrl: profileQuery.data?.avatar_url ?? null,
    updateAvatar,
  };
}
