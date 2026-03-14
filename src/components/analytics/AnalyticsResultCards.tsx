import { Brain, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResultBlock = ({ data }: { data: Record<string, unknown> }) => (
  <div className="rounded-lg bg-secondary/50 p-3 mt-3">
    <pre className="text-sm whitespace-pre-wrap overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
  </div>
);

export function MetricsResultCard({ metricsResult }: { metricsResult: Record<string, unknown> }) {
  const mr = (metricsResult?.data as Record<string, unknown>) || metricsResult;
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm">Análisis de Métricas</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {Object.entries((mr.metrics as Record<string, unknown>) || {}).map(([key, val]) => (
            <div key={key} className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{String(val)}</p>
              <p className="text-xs text-muted-foreground mt-1">{key.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>
        {mr.ai_insights && (
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">💡 AI Insights</p>
            <div className="text-sm leading-relaxed whitespace-pre-line">{String(mr.ai_insights)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function InsightsResultCard({ insightsResult }: { insightsResult: Record<string, unknown> }) {
  const ir = (insightsResult?.data as Record<string, unknown>) || insightsResult;
  const insightsText = String(ir?.insights || ir?.response_text || '');
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insightsText && (
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="text-sm leading-relaxed whitespace-pre-line">{insightsText}</div>
          </div>
        )}
        {Array.isArray(ir?.metrics_analyzed) && (
          <p className="text-xs text-muted-foreground">Métricas analizadas: {(ir.metrics_analyzed as string[]).join(', ')}</p>
        )}
        {ir?.generated_at && (
          <p className="text-xs text-muted-foreground">Generado: {new Date(String(ir.generated_at)).toLocaleString('es-ES')}</p>
        )}
        {!insightsText && <ResultBlock data={insightsResult} />}
      </CardContent>
    </Card>
  );
}

export function ForecastResultCard({ forecastResult }: { forecastResult: Record<string, unknown> }) {
  const fr = (forecastResult?.data as Record<string, unknown>) || forecastResult;
  const forecastList = (fr?.forecast || []) as Record<string, unknown>[];
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2"><LineChart className="h-4 w-4 text-primary" /> Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {Array.isArray(forecastList) && forecastList.length > 0 ? (
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-muted-foreground border-b border-border pb-2 mb-2">
              <span>Fecha</span><span className="text-right">Seguidores</span>
              <span className="text-right">Engagement</span><span className="text-right">Alcance</span>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-1">
              {forecastList.map((f, i) => {
                const date = String(f.date || f.label || f.metric || `Día ${i + 1}`);
                const followers = f.followers ?? f.value ?? f.predicted_followers;
                const engagement = f.engagement_rate ?? f.engagement;
                const reach = f.reach ?? f.predicted_reach;
                return (
                  <div key={i} className="grid grid-cols-4 gap-2 bg-secondary/30 rounded-lg px-3 py-2 text-sm">
                    <span className="text-muted-foreground">{date}</span>
                    <span className="text-right font-medium text-primary">
                      {followers != null ? Number(followers).toLocaleString() : '—'}
                    </span>
                    <span className="text-right">
                      {engagement != null ? `${(Number(engagement) < 1 ? (Number(engagement) * 100).toFixed(1) : Number(engagement).toFixed(1))}%` : '—'}
                    </span>
                    <span className="text-right">
                      {reach != null ? Number(reach).toLocaleString() : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {String((fr as Record<string, unknown>)?.message || (forecastResult as Record<string, unknown>)?.message || 'No hay datos suficientes para forecast.')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MonthlyReportCard({ reportResult }: { reportResult: Record<string, unknown> }) {
  const rr = (reportResult?.data as Record<string, unknown>) || reportResult;
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm">📊 Reporte Mensual — {String(rr?.client_name || '')}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {rr?.overall_score != null && (
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 rounded-lg p-3 text-center">
              <p className="text-3xl font-bold text-primary">{String(rr.overall_score)}/10</p>
              <p className="text-xs text-muted-foreground">Score General</p>
            </div>
          </div>
        )}
        {rr?.executive_summary && (
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Resumen Ejecutivo</p>
            <div className="text-sm leading-relaxed whitespace-pre-line">{String(rr.executive_summary)}</div>
          </div>
        )}
        {Array.isArray(rr?.key_wins) && (rr.key_wins as string[]).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-primary mb-1">🏆 Logros Clave</p>
            {(rr.key_wins as string[]).map((w, i) => (
              <p key={i} className="text-sm text-muted-foreground">✅ {w}</p>
            ))}
          </div>
        )}
        {Array.isArray(rr?.sections) && (rr.sections as Record<string, unknown>[]).map((sec, si) => (
          <div key={si} className="bg-secondary/30 rounded-lg p-3 space-y-2">
            <p className="font-medium text-sm">{String(sec.title)}</p>
            {Array.isArray(sec.metrics) && (sec.metrics as Record<string, unknown>[]).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(sec.metrics as Record<string, unknown>[]).map((m, mi) => (
                  <div key={mi} className="bg-secondary/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-primary">
                      {typeof m.current_value === 'number' && m.current_value < 1 ? (m.current_value * 100).toFixed(1) + '%' : String(m.current_value)}
                    </p>
                    <p className="text-xs text-muted-foreground">{String(m.metric_name || '').replace(/_/g, ' ')}</p>
                    {m.change_percentage != null && (
                      <p className={`text-xs font-semibold ${m.is_positive ? 'text-green-500' : 'text-destructive'}`}>
                        {m.is_positive ? '↑' : '↓'} {String(m.change_percentage)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {Array.isArray(sec.recommendations) && (sec.recommendations as string[]).length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Recomendaciones:</p>
                {(sec.recommendations as string[]).map((r, ri) => <p key={ri} className="text-sm">💡 {r}</p>)}
              </div>
            )}
          </div>
        ))}
        {Array.isArray(rr?.next_period_goals) && (rr.next_period_goals as string[]).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-primary mb-1">🎯 Metas Próximo Período</p>
            {(rr.next_period_goals as string[]).map((g, i) => (
              <p key={i} className="text-sm text-muted-foreground">• {g}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
