import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  listContextDocs,
  createContextDoc,
  updateContextDoc,
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

  const clientFilter = filterClientId === "all" ? undefined : filterClientId || undefined;
  const deptFilter = filterDept === "all" ? undefined : filterDept || undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["context-library", scope, clientFilter, deptFilter],
    queryFn: () =>
      listContextDocs(
        scope,
        tab === "client" ? clientFilter : undefined,
        tab === "department" ? deptFilter : undefined
      ),
    retry: 0,
  });

  const docs = (data?.docs ?? data?.data ?? []).filter((d) =>
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

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateContextDocPayload> }) =>
      updateContextDoc(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["context-library"] });
      toast({ title: "Documento actualizado" });
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
    updateDoc: updateMut.mutateAsync,
    deleteDoc: deleteMut.mutateAsync,
    isCreating: createMut.isPending,
    isUpdating: updateMut.isPending,
  };
}
