import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, CalendarDays, Wifi } from "lucide-react";

const stats = [
  { label: "Clientes Activos", value: "0", icon: Users, change: "+0%" },
  { label: "Engagement Rate", value: "0%", icon: TrendingUp, change: "+0%" },
  { label: "Posts Programados", value: "0", icon: CalendarDays, change: "0 hoy" },
  { label: "Cuentas Conectadas", value: "0", icon: Wifi, change: "0 redes" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de tu plataforma</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CalendarDays className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">No hay actividad reciente</p>
              <p className="text-xs mt-1">Comienza agregando clientes y cuentas sociales</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Cuentas por Red Social</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Wifi className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">Sin cuentas conectadas</p>
              <p className="text-xs mt-1">Conecta las cuentas de tus clientes para empezar</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
