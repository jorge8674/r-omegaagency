export const ResultBlock = ({ data }: { data: any }) => (
  <div className="rounded-lg bg-secondary/50 p-3 mt-3">
    <pre className="text-sm whitespace-pre-wrap overflow-x-auto">{typeof data === "string" ? data : JSON.stringify(data, null, 2)}</pre>
  </div>
);

export function OpportunityCards({ data }: { data: any }) {
  const raw = data?.data || data;
  const opportunities = raw?.opportunities || raw?.data || (Array.isArray(raw) ? raw : []);
  if (Array.isArray(opportunities) && opportunities.length > 0 && opportunities[0]?.title) {
    return (
      <div className="mt-3 space-y-3">
        {opportunities.map((opp: any, i: number) => (
          <div key={i} className="border border-border/50 rounded-lg p-4 bg-secondary/30">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm">{opp.title}</h4>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                opp.potential_impact === 'high' ? 'bg-green-500/20 text-green-400' :
                opp.potential_impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-muted text-muted-foreground'
              }`}>
                {opp.potential_impact?.toUpperCase()} IMPACT
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{opp.description}</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>⚡ Esfuerzo: {opp.effort_required}</span>
              <span>📈 ROI estimado: {opp.estimated_roi}x</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <ResultBlock data={data} />;
}

export function QuickWinsList({ data }: { data: any }) {
  const raw = data?.data || data;
  const wins = raw?.quick_wins || raw?.data || (Array.isArray(raw) ? raw : []);
  if (Array.isArray(wins) && wins.length > 0) {
    return (
      <div className="mt-3 space-y-2">
        {wins.map((w: any, i: number) => (
          <div key={i} className="border border-border/50 rounded-lg p-3 bg-secondary/30">
            <p className="text-sm whitespace-pre-line">{typeof w === 'string' ? w : w.title || w.description || JSON.stringify(w)}</p>
          </div>
        ))}
      </div>
    );
  }
  return <ResultBlock data={data} />;
}

export function BrandProfileCard({ data }: { data: any }) {
  const raw = data?.data || data;
  if (!raw?.brand_name && !raw?.tone) return <ResultBlock data={data} />;
  return (
    <div className="mt-3 border border-border/50 rounded-lg p-4 bg-secondary/30 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{raw.brand_name}</h4>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">{raw.tone}</span>
      </div>
      {raw.personality_traits?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {raw.personality_traits.map((t: string, i: number) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">{t}</span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span>😀 Emojis: {raw.emoji_usage || 'N/A'}</span>
        <span>📏 Formalidad: {raw.formality_level ?? 'N/A'}/10</span>
      </div>
      {raw.sample_posts?.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Posts de ejemplo:</p>
          {raw.sample_posts.map((p: string, i: number) => <p key={i} className="text-sm">• {p}</p>)}
        </div>
      )}
    </div>
  );
}

export function ExperimentCard({ data }: { data: any }) {
  const raw = data?.data || data;
  if (!raw?.experiment_id && !raw?.hypothesis) return <ResultBlock data={data} />;
  return (
    <div className="mt-3 border border-border/50 rounded-lg p-4 bg-secondary/30 space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">{raw.hypothesis}</h4>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          raw.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
        }`}>{raw.status?.toUpperCase()}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span>🔬 Variable: {raw.variable_tested}</span>
        <span>📱 Plataforma: {raw.platform}</span>
        <span>👥 Muestra: {raw.target_sample_size}</span>
        <span>🆔 {raw.experiment_id}</span>
      </div>
    </div>
  );
}

export function ValidationCard({ data }: { data: any }) {
  const raw = data?.data || data;
  if (!raw?.compliance_score && raw?.compliance_score !== 0) return <ResultBlock data={data} />;
  const score = Math.round((raw.compliance_score || 0) * 100);
  return (
    <div className="mt-3 border border-border/50 rounded-lg p-4 bg-secondary/30 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Resultado de Validación</h4>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          raw.is_compliant ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>{raw.is_compliant ? '✅ Cumple' : '❌ No Cumple'}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-xs font-medium">{score}%</span>
      </div>
      {raw.violations?.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">⚠️ Violaciones:</p>
          {raw.violations.map((v: string, i: number) => <p key={i} className="text-sm text-red-400">• {v}</p>)}
        </div>
      )}
      {raw.suggestions?.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">💡 Sugerencias:</p>
          {raw.suggestions.map((s: string, i: number) => <p key={i} className="text-sm whitespace-pre-line">{s}</p>)}
        </div>
      )}
    </div>
  );
}

export function ImproveCard({ data }: { data: any }) {
  const raw = data?.data || data;
  if (!raw?.improved && !raw?.original) return <ResultBlock data={data} />;
  const score = Math.round((raw.tone_alignment_score || 0) * 100);
  return (
    <div className="mt-3 border border-border/50 rounded-lg p-4 bg-secondary/30 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Contenido Mejorado</h4>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">Alineación: {score}%</span>
      </div>
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-sm whitespace-pre-line">{raw.improved}</p>
      </div>
      {raw.changes_made?.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">📝 Cambios realizados:</p>
          {raw.changes_made.map((c: string, i: number) => <p key={i} className="text-sm">• {c}</p>)}
        </div>
      )}
    </div>
  );
}
