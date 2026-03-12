import { useOmegaAuth } from "@/contexts/AuthContext";
import { useClientHome } from "./hooks/useClientHome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Users,
  Calendar,
  FileText,
  Plus,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  tiktok: <FileText className="h-4 w-4" />,
};

export default function ClientHome() {
  const { user } = useOmegaAuth();
  const navigate = useNavigate();
  const clientId = user?.id || "";

  const { data, isLoading, isError } = useClientHome(clientId);

  if (!clientId) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">No se pudo identificar el cliente</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-destructive mb-2">Error al cargar el dashboard</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const profile = data?.profile;
  const stats = data?.stats || { total_posts: 0, connected_accounts: 0, this_month_posts: 0 };
  const socialAccounts = data?.social_accounts || [];
  const upcomingPosts = data?.upcoming_posts || [];

  const kpis = [
    { title: "Posts Totales", value: stats.total_posts, icon: FileText },
    { title: "Cuentas Conectadas", value: stats.connected_accounts, icon: Users },
    { title: "Posts Este Mes", value: stats.this_month_posts, icon: Calendar },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {profile?.name || "Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {profile?.company || profile?.email}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={profile?.trial_active ? "default" : "outline"}
            className="text-xs"
          >
            {profile?.plan || "basic"}
          </Badge>
          <Button
            size="sm"
            onClick={() => navigate("/calendar")}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" /> Nuevo Post
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Social Accounts */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-display">Redes Sociales</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : socialAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm mb-3">
                No tienes cuentas conectadas
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/media")}
              >
                <Plus className="h-4 w-4 mr-1" /> Conectar Redes
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Seguidores</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {platformIcons[account.platform] || <FileText className="h-4 w-4" />}
                        <span className="capitalize">{account.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>@{account.username}</TableCell>
                    <TableCell>
                      {account.followers_count?.toLocaleString() || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={account.connected ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {account.connected ? "Conectado" : "Desconectado"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Posts */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-display">
            Próximos Posts (7 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : upcomingPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm mb-3">
                No hay posts programados en los próximos 7 días
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/calendar")}
              >
                <Calendar className="h-4 w-4 mr-1" /> Ver Calendario
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Contenido</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingPosts.slice(0, 5).map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      {format(new Date(`${post.scheduled_date}T${post.scheduled_time}`), "d MMM, HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {post.text_content}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {post.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
