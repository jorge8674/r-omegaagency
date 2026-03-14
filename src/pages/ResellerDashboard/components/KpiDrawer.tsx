import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import type { ResellerClient, ResellerKpis } from "../types";

export type KpiDrawerType = "mrr" | "posts" | "alerts" | "health" | null;

interface Props {
  type: KpiDrawerType;
  onClose: () => void;
  clients: ResellerClient[];
  kpis: ResellerKpis | undefined;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const TITLES: Record<string, { title: string; desc: string }> = {
  mrr: { title: "Revenue de tu Agencia", desc: "Desglose de MRR por cliente" },
  posts: { title: "Producción de Contenido", desc: "Posts generados este mes por cliente" },
  alerts: { title: "Alertas de tu Agencia", desc: "Alertas activas agrupadas por cliente" },
  health: { title: "Estado de Clientes", desc: "Salud general de cada cliente" },
};

const healthDot: Record<string, string> = {
  green: "bg-[hsl(var(--success))]",
  yellow: "bg-[hsl(var(--warning))]",
  red: "bg-destructive",
};

const healthLabel: Record<string, string> = {
  green: "Sin alertas, redes conectadas",
  yellow: "Alertas leves o sin posts recientes",
  red: "Sin redes conectadas o crítico",
};

function MrrContent({ clients, kpis }: { clients: ResellerClient[]; kpis?: ResellerKpis }) {
  const totalMrr = clients.reduce((s, c) => s + (c.stats?.revenue_monthly ?? 0), 0);
  const delta = kpis?.mrr_delta ?? 0;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px]">{c.plan}</Badge>
              </TableCell>
              <TableCell className="text-right">{fmt(c.stats?.revenue_monthly ?? 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="font-semibold">Total MRR</TableCell>
            <TableCell className="text-right font-bold">{fmt(totalMrr)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <p className={`text-xs mt-3 px-1 ${delta >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
        {delta >= 0 ? "↑" : "↓"} {fmt(Math.abs(delta))} vs mes anterior
      </p>
    </>
  );
}

function PostsContent({ clients }: { clients: ResellerClient[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead className="text-right">Posts</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((c) => {
          const posts = c.stats?.posts_this_month ?? 0;
          return (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-right">{posts}</TableCell>
              <TableCell>
                {posts === 0 ? (
                  <span className="text-xs text-muted-foreground">Sin contenido programado aún</span>
                ) : (
                  <Badge variant="outline" className="text-[10px] border-[hsl(var(--success))]/30 text-[hsl(var(--success))]">
                    Activo
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function AlertsContent({ clients }: { clients: ResellerClient[] }) {
  const clientsWithAlerts = clients.filter((c) => (c.alerts ?? []).length > 0);

  if (clientsWithAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <CheckCircle2 className="h-10 w-10 text-[hsl(var(--success))] mb-3" />
        <p className="text-sm font-medium">Todo al día</p>
        <p className="text-xs mt-1">No hay alertas activas en tu agencia</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clientsWithAlerts.map((c) => (
        <div key={c.id} className="space-y-1.5">
          <p className="text-sm font-semibold">{c.name}</p>
          {(c.alerts ?? []).map((a, i) => {
            const dotCls =
              a.severity === "critical" ? "bg-destructive" :
              a.severity === "warning" ? "bg-[hsl(var(--warning))]" :
              "bg-[hsl(var(--success))]";
            return (
              <div key={i} className="flex items-start gap-2 pl-2">
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${dotCls}`} />
                <p className="text-xs text-muted-foreground">{a.message}</p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function HealthContent({ clients }: { clients: ResellerClient[] }) {
  return (
    <div className="space-y-2">
      {clients.map((c) => (
        <div
          key={c.id}
          className="flex items-center gap-3 rounded-lg border border-border/30 bg-secondary/20 p-3"
        >
          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${healthDot[c.health] ?? healthDot.yellow}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{c.name}</p>
            <p className="text-[11px] text-muted-foreground">{healthLabel[c.health] ?? healthLabel.yellow}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function KpiDrawer({ type, onClose, clients, kpis }: Props) {
  const meta = type ? TITLES[type] : { title: "", desc: "" };

  return (
    <Sheet open={!!type} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[480px] max-w-full overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="font-display">{meta.title}</SheetTitle>
          <SheetDescription>{meta.desc}</SheetDescription>
        </SheetHeader>

        {type === "mrr" && <MrrContent clients={clients} kpis={kpis} />}
        {type === "posts" && <PostsContent clients={clients} />}
        {type === "alerts" && <AlertsContent clients={clients} />}
        {type === "health" && <HealthContent clients={clients} />}
      </SheetContent>
    </Sheet>
  );
}
