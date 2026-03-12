/* Agent Catalog Modal — fullscreen mobile, 80% desktop */
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AGENT_CATALOG, DEPARTMENTS, DEPT_FILTER_TABS } from "../constants";
import type { UpsellPayload } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onRequestAgent: (payload: Omit<UpsellPayload, "client_id" | "current_plan">) => void;
}

export default function AgentCatalogModal({ open, onClose, onRequestAgent }: Props) {
  const [filter, setFilter] = useState("Todos");
  const agents = filter === "Todos"
    ? AGENT_CATALOG
    : AGENT_CATALOG.filter((a) => a.dept === filter);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-display">
            Agentes OMEGA Company
            <Badge className="bg-primary/20 text-primary text-xs">40% descuento aplicado</Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 py-2">
          {DEPT_FILTER_TABS.map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={filter === tab ? "default" : "outline"}
              onClick={() => setFilter(tab)}
              className="text-xs"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Department packs */}
        {filter === "Todos" && (
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {DEPARTMENTS.map((d) => (
              <div key={d.code} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">Director: {d.director} · ${d.totalPrice.toLocaleString()}/mes</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => onRequestAgent({
                  request_type: "department", item_name: d.name,
                  item_code: d.code, monthly_price: d.totalPrice, new_monthly_total: d.totalPrice,
                })}>
                  Solicitar
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Agent grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((a) => (
            <div key={a.code} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-chart-3/20 text-chart-3 text-[10px]">{a.code}</Badge>
                <span className="text-sm font-medium">{a.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{a.role}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-bold text-chart-3">${a.price.toLocaleString()}/mes</span>
                <Button size="sm" variant="outline" onClick={() => onRequestAgent({
                  request_type: "individual_agent", item_name: a.name,
                  item_code: a.code, monthly_price: a.price, new_monthly_total: a.price,
                })}>
                  Solicitar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
