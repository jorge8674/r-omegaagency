// 125 lines
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, FileText, RefreshCw, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useOmegaDepartment, generateReportFromBackend, saveReport, type DeptReport } from "./hooks/useOmegaDepartment";
import { DirectorCard } from "./components/DirectorCard";
import { SubAgentGrid } from "./components/SubAgentGrid";
import { DeptActivityFeed } from "./components/DeptActivityFeed";

const DEPT_TITLE: Record<string, string> = {
  marketing:  "text-orange-400",
  tech:       "text-blue-400",
  operations: "text-green-400",
  finance:    "text-emerald-400",
  community:  "text-purple-400",
  futures:    "text-indigo-400",
  people:     "text-pink-400",
  security:   "text-rose-400",
};

export default function OmegaDepartment() {
  const { dept = "" } = useParams<{ dept: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const { director, isLoading, refetch } = useOmegaDepartment(dept);

  const handleReport = async () => {
    console.log(">>> handleReport called", { director: !!director, dept });
    if (!director) return;
    setGenerating(true);
    try {
      await refetch();
      console.log(">>> calling generateReportFromBackend for", dept);
      const content = await generateReportFromBackend(director, dept);
      console.log(">>> report content received, length:", content?.length);
      const report: DeptReport = {
        id: `${dept}-${Date.now()}`,
        department: dept,
        director: director.code,
        content,
        createdAt: new Date().toISOString(),
        format: "markdown",
      };
      saveReport(report);
      window.dispatchEvent(new Event("omega_report_added"));
      toast({
        title: "✅ Reporte generado",
        description: "Ver en tab Reportes de OMEGA Company",
      });
    } finally {
      setGenerating(false);
    }
  };

  const titleColor = DEPT_TITLE[dept] ?? "text-foreground";

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" className="gap-1.5 -ml-2" onClick={() => navigate("/omega")}>
            <ArrowLeft className="h-4 w-4" />
            OMEGA Company
          </Button>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 shrink-0"
          onClick={handleReport}
          disabled={generating || isLoading || !director}
        >
          <FileText className="h-3.5 w-3.5" />
          {generating ? "Generando…" : "Solicitar Reporte"}
        </Button>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl font-bold tracking-tight capitalize ${titleColor}`}>
              {dept.charAt(0).toUpperCase() + dept.slice(1)}
            </h1>
            {!isLoading && director && (
              <Badge variant="outline" className={`border-current ${titleColor}`}>
                {director.code}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Cargando…" : director
              ? `${director.sub_agents.length} agentes en el departamento`
              : "Departamento no encontrado"
            }
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-44 w-full" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        </div>
      ) : !director ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-sm">Departamento no encontrado: <span className="font-mono">{dept}</span></p>
        </div>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="gap-1.5"><Users className="h-3.5 w-3.5" />Overview</TabsTrigger>
            <TabsTrigger value="agents" className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" />Sub-Agentes</TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5"><Activity className="h-3.5 w-3.5" />Actividad</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <DirectorCard director={director} />
          </TabsContent>
          <TabsContent value="agents">
            <SubAgentGrid agents={director.sub_agents} />
          </TabsContent>
          <TabsContent value="activity">
            <DeptActivityFeed dept={dept} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
