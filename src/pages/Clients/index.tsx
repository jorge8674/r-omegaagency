// src/pages/Clients/index.tsx
// Orquestador de la página de clientes

import { useState, useEffect } from "react";
import { useClients } from "../ContentGenerator/hooks/useClients";
import { ClientsTable } from "./components/ClientsTable";
import { ClientModal } from "./components/ClientModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import type { ClientProfile, ClientStatus } from "@/lib/api/clients";

export default function Clients() {
  const { clients, isLoading, isSaving, loadClients, handleCreate, handleUpdate, handleDelete } = useClients();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientProfile | null>(null);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");

  useEffect(() => { loadClients(); }, [loadClients]);

  const onEdit = (client: ClientProfile) => { setEditingClient(client); setDialogOpen(true); };
  const onNew = () => { setEditingClient(null); setDialogOpen(true); };
  const onToggleStatus = (id: string, newStatus: ClientStatus) => handleUpdate(id, { status: newStatus });

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
      || (c.company?.toLowerCase().includes(search.toLowerCase()) ?? false)
      || (c.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchPlan = filterPlan === "all" || c.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gestiona tus clientes y sus cuentas sociales</p>
        </div>
        <Button className="gradient-primary" onClick={onNew}><Plus className="mr-2 h-4 w-4" />Nuevo Cliente</Button>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar clientes..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterPlan} onValueChange={setFilterPlan}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Plan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="basic">Básico</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ClientsTable clients={filtered} isLoading={isLoading} onEdit={onEdit} onDelete={handleDelete} onToggleStatus={onToggleStatus} />
      <ClientModal open={dialogOpen} onOpenChange={setDialogOpen} client={editingClient} onSubmit={handleCreate} onUpdate={handleUpdate} isSaving={isSaving} />
    </div>
  );
}
