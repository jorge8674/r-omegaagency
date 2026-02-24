import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import type { ClientContentItem } from "../hooks/useClientDetail";

interface Props {
  content: ClientContentItem[];
  loading: boolean;
}

const STATUS_STYLE: Record<string, string> = {
  published: "border-green-500/50 text-green-400 bg-green-500/10",
  draft: "border-border text-muted-foreground bg-muted/30",
  scheduled: "border-blue-500/50 text-blue-400 bg-blue-500/10",
};

export function ClientContentTab({ content, loading }: Props) {
  const [typeFilter, setTypeFilter] = useState("all");
  const safe = Array.isArray(content) ? content : [];
  const filtered = typeFilter === "all" ? safe : safe.filter((c) => c.type === typeFilter);
  const types = [...new Set(safe.map((c) => c.type))];

  if (loading) {
    return <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 rounded" />)}</div>;
  }

  if (safe.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-3">
        <FileText className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Sin contenido generado aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Contenido generado</h3>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {types.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Tipo</TableHead>
            <TableHead className="text-xs">Plataforma</TableHead>
            <TableHead className="text-xs">Agente</TableHead>
            <TableHead className="text-xs">Fecha</TableHead>
            <TableHead className="text-xs">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.slice(0, 20).map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-xs capitalize">{item.type}</TableCell>
              <TableCell className="text-xs capitalize">{item.platform}</TableCell>
              <TableCell className="text-xs">{item.agent ?? "—"}</TableCell>
              <TableCell className="text-xs">{format(new Date(item.created_at), "dd/MM/yy")}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`text-[10px] ${STATUS_STYLE[item.status] ?? ""}`}>
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
