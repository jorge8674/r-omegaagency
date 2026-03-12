/* Block 3 — Scheduled Content (next 10 posts, 7 days) */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Calendar, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import type { ScheduledPost, SocialAccount } from "../types";

interface Props {
  posts: ScheduledPost[];
  accounts: SocialAccount[];
  loading: boolean;
}

const STATUS_STYLE: Record<string, string> = {
  scheduled: "bg-chart-3/20 text-chart-3",
  published: "bg-success/20 text-success",
  error: "bg-destructive/20 text-destructive",
};

export default function ScheduledContent({ posts, accounts, loading }: Props) {
  const navigate = useNavigate();
  const connectedIds = new Set(accounts.filter((a) => a.connected).map((a) => a.id));

  if (loading) {
    return <Card className="bg-card"><CardContent className="pt-6"><Skeleton className="h-40 w-full" /></CardContent></Card>;
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-display">Contenido Programado</CardTitle>
        <Button size="sm" variant="outline" onClick={() => navigate("/calendar")}>
          <Calendar className="h-4 w-4 mr-1" /> Ver Calendario
        </Button>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-3">No hay contenido programado</p>
            <Button size="sm" onClick={() => navigate("/content-lab")}>
              <Sparkles className="h-4 w-4 mr-1" /> Generar con NOVA
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plataforma</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="hidden sm:table-cell">Contenido</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.slice(0, 10).map((p) => {
                const disconnected = !connectedIds.has(p.account_id);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <PlatformIcon platform={p.content_type} className="h-4 w-4" />
                    </TableCell>
                    <TableCell className="text-xs">
                      {format(new Date(`${p.scheduled_date}T${p.scheduled_time}`), "d MMM, HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell max-w-[200px] truncate text-xs text-muted-foreground">
                      {p.text_content?.slice(0, 60)}
                    </TableCell>
                    <TableCell className="space-x-1">
                      <Badge className={STATUS_STYLE[p.status] || "bg-muted text-muted-foreground"}>
                        {p.status}
                      </Badge>
                      {disconnected && (
                        <Badge variant="destructive" className="text-[10px]">Red no conectada</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
