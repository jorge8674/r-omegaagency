import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  listContextDocs,
  createContextDoc,
  deleteContextDoc,
  type ContextScope,
  type CreateContextDocPayload,
} from "@/lib/api/contextLibrary";

export type TabScope = "global" | "client" | "department";

export function useContextLibrary() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<TabScope>("global");
  const [filterClientId, setFilterClientId] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [search, setSearch] = useState("");

  const scope: ContextScope | undefined =
    tab === "global" ? "global" : tab === "client" ? "client" : "department";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["context-library", scope, filterClientId, filterDept],
    queryFn: () =>
      listContextDocs(
        scope,
        tab === "client" ? filterClientId || undefined : undefined,
        tab === "department" ? filterDept || undefined : undefined
      ),
    retry: 1,
  });

  const docs = (data?.data ?? []).filter((d) =>
    search ? d.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const createMut = useMutation({
    mutationFn: (p: CreateContextDocPayload) => createContextDoc(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["context-library"] });
      toast({ title: "Documento creado" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteContextDoc(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["context-library"] });
      toast({ title: "Documento eliminado" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return {
    tab, setTab, search, setSearch,
    filterClientId, setFilterClientId,
    filterDept, setFilterDept,
    docs, isLoading, isError,
    createDoc: createMut.mutateAsync,
    deleteDoc: deleteMut.mutateAsync,
    isCreating: createMut.isPending,
  };
}
