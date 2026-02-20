// 98 lines
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Crown, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { omegaApi, type OrgAgentStatus } from "@/lib/api/omega";

const STATUS_DOT: Record<OrgAgentStatus, string> = {
  active:      "bg-emerald-500 animate-pulse",
  online:      "bg-emerald-500 animate-pulse",
  in_task:     "bg-amber-400 animate-pulse",
  idle:        "bg-muted-foreground",
  in_training: "bg-blue-400 animate-pulse",
  inactive:    "bg-muted-foreground/50",
  error:       "bg-destructive",
};

const DEPT_STYLE: Record<string, { border: string; text: string; glow: string }> = {
  marketing:  { border: "border-orange-500/50",  text: "text-orange-400",  glow: "shadow-orange-500/10" },
  tech:       { border: "border-blue-500/50",    text: "text-blue-400",    glow: "shadow-blue-500/10" },
  operations: { border: "border-green-500/50",   text: "text-green-400",   glow: "shadow-green-500/10" },
  finance:    { border: "border-emerald-500/50", text: "text-emerald-400", glow: "shadow-emerald-500/10" },
  community:  { border: "border-purple-500/50",  text: "text-purple-400",  glow: "shadow-purple-500/10" },
  futures:    { border: "border-indigo-500/50",  text: "text-indigo-400",  glow: "shadow-indigo-500/10" },
  people:     { border: "border-pink-500/50",    text: "text-pink-400",    glow: "shadow-pink-500/10" },
  security:   { border: "border-rose-500/50",    text: "text-rose-400",    glow: "shadow-rose-500/10" },
};

const DEPT_BG: Record<string, string> = {
  marketing:  "bg-orange-500/5 hover:bg-orange-500/10",
  tech:       "bg-blue-500/5 hover:bg-blue-500/10",
  operations: "bg-green-500/5 hover:bg-green-500/10",
  finance:    "bg-emerald-500/5 hover:bg-emerald-500/10",
  community:  "bg-purple-500/5 hover:bg-purple-500/10",
  futures:    "bg-indigo-500/5 hover:bg-indigo-500/10",
  people:     "bg-pink-500/5 hover:bg-pink-500/10",
  security:   "bg-rose-500/5 hover:bg-rose-500/10",
};

export function OmegaDirectorBar() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["omega-org-chart"],
    queryFn: () => omegaApi.getOrgChart(),
    staleTime: 120_000,
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-28 shrink-0 rounded-xl" />
        ))}
      </div>
    );
  }

  const ceo = data?.ceo;

  const ORDER = ['marketing','tech','operations','finance','community','futures','people','security'];
  const rawDirectors = (data?.directors ?? []).filter(d => d.code !== 'NOVA');
  const directors = ORDER
    .map(dept => rawDirectors.find(d => d.department.toLowerCase() === dept))
    .filter((d): d is NonNullable<typeof d> => d !== undefined);

  return (
    <div className="flex items-start gap-3 overflow-x-auto pb-2 scrollbar-thin">
      {/* NOVA CEO */}
      {ceo && (
        <div className="shrink-0 flex flex-col items-center gap-2 rounded-xl border-2 border-yellow-500/60 bg-yellow-500/8 shadow-lg shadow-yellow-500/10 px-5 py-3 min-w-[110px] cursor-default">
          <Crown className="h-5 w-5 text-yellow-400" />
          <div className="text-center">
            <p className="font-mono text-sm font-bold text-yellow-400">{ceo.code}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">CEO · NOVA</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-emerald-400">Online 24/7</span>
          </div>
        </div>
      )}

      {/* Arrow separator */}
      {ceo && directors.length > 0 && (
        <div className="flex items-center self-center shrink-0 text-muted-foreground/40 text-lg font-thin">→</div>
      )}

      {/* Directors */}
      {directors.map((d) => {
        const dept = d.department.toLowerCase();
        const style = DEPT_STYLE[dept] ?? { border: "border-border/50", text: "text-foreground", glow: "" };
        const bg = DEPT_BG[dept] ?? "bg-muted/5 hover:bg-muted/10";
        const active = d.sub_agents.filter((a) => ["active","online","in_task"].includes(a.status)).length;

        return (
          <button
            key={d.id}
            onClick={() => navigate(`/omega/department/${dept}`)}
            className={`shrink-0 flex flex-col items-center gap-1.5 rounded-xl border ${style.border} ${bg} shadow-sm ${style.glow} px-4 py-2.5 min-w-[100px] transition-all duration-150 hover:scale-[1.03] cursor-pointer`}
          >
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full shrink-0 ${STATUS_DOT[d.status] ?? STATUS_DOT.idle}`} />
              <span className={`font-mono text-xs font-bold ${style.text}`}>{d.code}</span>
            </div>
            <span className="text-[10px] text-muted-foreground capitalize">{d.department}</span>
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <Users className="h-2.5 w-2.5" />
              <span>{active}/{d.sub_agents.length} ag.</span>
            </div>
          </button>
        );
      })}

    </div>
  );
}
