import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreHorizontal, Pencil, ShieldOff, Trash2 } from "lucide-react";
import type { ResellerDetailData } from "../hooks/useResellerDetail";

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  enterprise: { label: "Enterprise", cls: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
  pro: { label: "Pro", cls: "border-blue-500/50 text-blue-400 bg-blue-500/10" },
  starter: { label: "Starter", cls: "border-border text-muted-foreground bg-muted/30" },
};

interface Props { reseller: ResellerDetailData }

export function ResellerHeader({ reseller }: Props) {
  const navigate = useNavigate();
  const plan = PLAN_BADGE[(reseller.plan ?? "starter").toLowerCase()] ?? PLAN_BADGE.starter;
  const initial = reseller.agency_name.charAt(0).toUpperCase();
  const isActive = reseller.status === "active";
  const meta = [reseller.owner_name, reseller.owner_email, reseller.phone].filter(Boolean).join(" · ");

  return (
    <div className="flex items-start gap-4">
      <Button variant="ghost" size="icon" onClick={() => navigate("/admin/resellers")} className="mt-1 shrink-0">
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="h-12 w-12 shrink-0 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
        <span className="font-display text-lg font-bold text-amber-400">{initial}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-display text-2xl font-bold tracking-tight">{reseller.agency_name}</h1>
          <Badge variant="outline" className={plan.cls}>{plan.label}</Badge>
          <div className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
        </div>
        {meta && <p className="text-sm text-muted-foreground mt-1 truncate">{meta}</p>}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2"><Pencil className="h-3.5 w-3.5" /> Editar</DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-yellow-500"><ShieldOff className="h-3.5 w-3.5" /> Suspender</DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-destructive"><Trash2 className="h-3.5 w-3.5" /> Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
