import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";

export interface SubBrand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
}

interface SubBrandsResponse {
  success: boolean;
  data: { sub_brands: SubBrand[] };
}

export function useSubBrands(clientId: string) {
  return useQuery<SubBrand[]>({
    queryKey: ["sub-brands", clientId],
    queryFn: async () => {
      const res = await apiCall<SubBrandsResponse>(`/clients/${clientId}/sub-brands/`);
      if (!res.success) return [];
      return (res.data?.sub_brands ?? []).filter((b) => b.is_active);
    },
    enabled: !!clientId,
    retry: 1,
    staleTime: 60000,
    // Silently return empty on error — block stays invisible
    placeholderData: [],
  });
}
