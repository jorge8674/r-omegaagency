/* Block 2 — KPI Cards (4 cards: posts, messages, networks, next content) */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, MessageSquare, Share2, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FeatureUsageData, ScheduledPost, SocialAccount } from "../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  usage: FeatureUsageData | undefined;
  accounts: SocialAccount[];
  nextPosts: ScheduledPost[];
  loading: boolean;
  onUpsell: () => void;
}

function progressColor(pct: number): string {
  if (pct >= 100) return "bg-destructive";
  if (pct >= 80) return "bg-warning";
  return "bg-success";
}

export default function KpiCards({ usage, accounts, nextPosts, loading, onUpsell }: Props) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card"><CardContent className="pt-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  const postsPct = usage?.posts_pct ?? 0;
  const msgsPct = usage?.msgs_pct ?? 0;
  const connected = accounts.filter((a) => a.connected).length;
  const total = accounts.length;
  const next = nextPosts[0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Posts */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Publicaciones</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold font-display">{usage?.posts_used ?? 0}
            <span className="text-sm text-muted-foreground font-normal"> de {usage?.posts_limit ?? "∞"}</span>
          </p>
          <Progress value={Math.min(postsPct, 100)} className="h-1.5 mt-2" indicatorClassName={progressColor(postsPct)} />
          {postsPct >= 100 && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive" className="text-[10px]">Límite alcanzado</Badge>
              <Button size="sm" variant="link" className="h-auto p-0 text-xs" onClick={onUpsell}>Ampliar</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Mensajes con NOVA</CardTitle>
          <MessageSquare className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold font-display">{usage?.msgs_used ?? 0}
            <span className="text-sm text-muted-foreground font-normal"> / {usage?.msgs_limit ?? "∞"}</span>
          </p>
          <Progress value={Math.min(msgsPct, 100)} className="h-1.5 mt-2" indicatorClassName={progressColor(msgsPct)} />
          {msgsPct >= 100 && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive" className="text-[10px]">Límite alcanzado</Badge>
              <Button size="sm" variant="link" className="h-auto p-0 text-xs" onClick={onUpsell}>Ampliar</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Networks */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Redes Conectadas</CardTitle>
          <Share2 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold font-display">{connected}
            <span className="text-sm text-muted-foreground font-normal"> de {total || 5}</span>
          </p>
          {connected < (total || 5) && (
            <Button size="sm" variant="link" className="h-auto p-0 text-xs mt-2" onClick={() => navigate("/media")}>
              Conectar
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Next content */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Próximo Contenido</CardTitle>
          <CalendarClock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          {next ? (
            <p className="text-sm font-medium">
              {format(new Date(`${next.scheduled_date}T${next.scheduled_time}`), "d MMM, HH:mm", { locale: es })}
            </p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-2">Sin contenido esta semana</p>
              <Button size="sm" variant="link" className="h-auto p-0 text-xs" onClick={() => navigate("/content-lab")}>
                Generar
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
