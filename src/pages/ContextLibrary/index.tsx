import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Globe, Users, Building2 } from "lucide-react";
import { useClients } from "@/pages/ContentGenerator/hooks/useClients";
import { useContextLibrary, type TabScope } from "./hooks/useContextLibrary";
import { ContextHeader } from "./components/ContextHeader";
import { ContextDocCard } from "./components/ContextDocCard";
import { AddContextModal } from "./components/AddContextModal";
import type { ContextDocument } from "@/lib/api/contextLibrary";

const OMEGA_DEPARTMENTS = [
  { value: "marketing", label: "Marketing", director: "ATLAS" },
  { value: "tech", label: "Tech", director: "LUNA" },
  { value: "operations", label: "Operations", director: "REX" },
  { value: "finance", label: "Finance", director: "VERA" },
  { value: "community", label: "Community", director: "KIRA" },
  { value: "futures", label: "Futures", director: "ORACLE" },
  { value: "people", label: "People", director: "SOPHIA" },
  { value: "security", label: "Security", director: "SENTINEL" },
];

export default function ContextLibrary() {
  const ctx = useContextLibrary();
  const { clients, loadClients } = useClients();
  const [modalOpen, setModalOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<ContextDocument | null>(null);

  useEffect(() => { loadClients(); }, [loadClients]);

  const openCreate = () => { setEditDoc(null); setModalOpen(true); };
  const openEdit = (doc: ContextDocument) => { setEditDoc(doc); setModalOpen(true); };
  const closeModal = () => { setEditDoc(null); setModalOpen(false); };

  const empty = ctx.docs.length === 0 && !ctx.isLoading;

  return (
    <div className="space-y-6 p-6">
      <ContextHeader search={ctx.search} onSearchChange={ctx.setSearch} onAdd={openCreate} />

      <Tabs value={ctx.tab} onValueChange={(v) => ctx.setTab(v as TabScope)}>
        <TabsList>
          <TabsTrigger value="global" className="gap-1.5"><Globe className="h-3.5 w-3.5" /> Global</TabsTrigger>
          <TabsTrigger value="client" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Por Cliente</TabsTrigger>
          <TabsTrigger value="department" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Por Depto</TabsTrigger>
        </TabsList>

        {ctx.tab === "client" && (
          <div className="mt-3 max-w-xs">
            <Select value={ctx.filterClientId} onValueChange={ctx.setFilterClientId}>
              <SelectTrigger><SelectValue placeholder="Filtrar por cliente" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {ctx.tab === "department" && (
          <div className="mt-3 max-w-xs">
            <Select value={ctx.filterDept} onValueChange={ctx.setFilterDept}>
              <SelectTrigger><SelectValue placeholder="Filtrar por departamento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {OMEGA_DEPARTMENTS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label} — {d.director}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        <TabsContent value={ctx.tab} className="mt-4">
          {ctx.isLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
            </div>
          )}

          {ctx.isError && !ctx.isLoading && (
            <div className="rounded-lg border border-dashed border-border/50 bg-card/50 p-12 text-center">
              <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Backend en deploy... Los documentos aparecerán cuando el endpoint esté activo.</p>
            </div>
          )}

          {empty && !ctx.isError && (
            <div className="rounded-lg border border-dashed border-border/50 bg-card/50 p-12 text-center">
              <p className="text-muted-foreground">No hay documentos en esta categoría.</p>
            </div>
          )}

          {!ctx.isLoading && !ctx.isError && ctx.docs.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ctx.docs.map((doc) => (
                <ContextDocCard key={doc.id} doc={doc} onView={() => {}} onEdit={openEdit} onDelete={(id) => ctx.deleteDoc(id)} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddContextModal
        open={modalOpen} onClose={closeModal}
        onCreate={ctx.createDoc} onUpdate={ctx.updateDoc}
        isCreating={ctx.isCreating} isUpdating={ctx.isUpdating}
        clients={clients} editDoc={editDoc}
      />
    </div>
  );
}
