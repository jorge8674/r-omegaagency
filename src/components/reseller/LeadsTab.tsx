import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Inbox, MoreHorizontal, Phone, Mail, MessageSquare, UserCheck,
  UserX, Eye, Users, Circle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "https://omegaraisen-production.up.railway.app/api/v1";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  source: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "Nuevo", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  contacted: { label: "Contactado", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  converted: { label: "Convertido", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  lost: { label: "Descartado", className: "bg-muted text-muted-foreground border-border" },
};

export function LeadsTab({ resellerId }: { resellerId: string }) {
  const queryClient = useQueryClient();
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["reseller-leads", resellerId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/resellers/${resellerId}/leads`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const json = await res.json();
      return json.data || json.leads || json || [];
    },
    enabled: !!resellerId,
    retry: 1,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      const res = await fetch(`${API_BASE}/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reseller-leads", resellerId] });
      toast({ title: "Estado actualizado" });
    },
    onError: () => {
      toast({ title: "Error al actualizar", variant: "destructive" });
    },
  });

  const leadsArray = Array.isArray(leads) ? leads : [];
  const total = leadsArray.length;
  const newCount = leadsArray.filter((l) => l.status === "new").length;
  const contactedCount = leadsArray.filter((l) => l.status === "contacted").length;
  const convertedCount = leadsArray.filter((l) => l.status === "converted").length;

  const kpis = [
    { title: "Total Leads", value: total, icon: Users, color: "text-primary" },
    { title: "Nuevos", value: newCount, icon: Circle, color: "text-blue-400" },
    { title: "Contactados", value: contactedCount, icon: Circle, color: "text-yellow-400" },
    { title: "Convertidos", value: convertedCount, icon: Circle, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leads Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-display text-lg">Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : leadsArray.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Inbox className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-sm font-medium mb-1">Aún no tienes leads</p>
              <p className="text-xs text-center max-w-xs opacity-60">
                Cuando alguien llene el formulario de tu landing, aparecerá aquí.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadsArray.map((lead) => {
                  const sc = statusConfig[lead.status] || statusConfig.new;
                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{lead.email}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{lead.phone || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {new Date(lead.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setDetailLead(lead)}>
                              <Eye className="h-4 w-4 mr-2" /> Ver detalle
                            </DropdownMenuItem>
                            {lead.status !== "contacted" && (
                              <DropdownMenuItem onClick={() => updateStatus.mutate({ leadId: lead.id, status: "contacted" })}>
                                <Phone className="h-4 w-4 mr-2" /> Marcar contactado
                              </DropdownMenuItem>
                            )}
                            {lead.status !== "converted" && (
                              <DropdownMenuItem onClick={() => updateStatus.mutate({ leadId: lead.id, status: "converted" })}>
                                <UserCheck className="h-4 w-4 mr-2" /> Convertir a cliente
                              </DropdownMenuItem>
                            )}
                            {lead.status !== "lost" && (
                              <DropdownMenuItem onClick={() => updateStatus.mutate({ leadId: lead.id, status: "lost" })}>
                                <UserX className="h-4 w-4 mr-2" /> Descartar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Lead Detail Modal */}
      <Dialog open={!!detailLead} onOpenChange={() => setDetailLead(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Detalle del Lead</DialogTitle>
          </DialogHeader>
          {detailLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nombre</p>
                  <p className="text-sm font-medium">{detailLead.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Estado</p>
                  <Badge variant="outline" className={statusConfig[detailLead.status]?.className}>
                    {statusConfig[detailLead.status]?.label || detailLead.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{detailLead.email}</span>
              </div>
              {detailLead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{detailLead.phone}</span>
                </div>
              )}
              {detailLead.message && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Mensaje</span>
                  </div>
                  <p className="text-sm bg-secondary/30 rounded-lg p-3">{detailLead.message}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fuente</p>
                  <p className="text-sm">{detailLead.source || "Landing Page"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                  <p className="text-sm">
                    {new Date(detailLead.created_at).toLocaleDateString("es-MX", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}