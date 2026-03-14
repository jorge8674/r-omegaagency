import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOmegaAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const { user } = useOmegaAuth();
  const queryClient = useQueryClient();
  const clientId = user?.client_id;

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
      return `${urlData.publicUrl}?t=${Date.now()}`;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  return {
    profile: null,
    loading: false,
    avatarUrl: null,
    updateAvatar,
  };
}
