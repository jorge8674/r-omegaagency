import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { VideoDuration, VideoStyle, VideoProvider } from "@/lib/api/contentLab";

type ProviderStatus = "available" | "disabled" | "requires_setup" | "beta";

const PROVIDER_STATUS: Record<VideoProvider, ProviderStatus> = {
  kling:   "available",
  runway:  "requires_setup",
  hunyuan: "disabled",
  wan:     "beta",
};

const STATUS_BADGE: Record<ProviderStatus, { label: string; className: string }> = {
  available:     { label: "Activo",          className: "text-green-500" },
  requires_setup:{ label: "Configurar key",  className: "text-yellow-500" },
  disabled:      { label: "No disponible",   className: "text-muted-foreground" },
  beta:          { label: "Beta",            className: "text-orange-500" },
};

const PROVIDERS: { value: VideoProvider; label: string }[] = [
  { value: "kling",   label: "Kling v2" },
  { value: "runway",  label: "Runway Gen-3" },
  { value: "hunyuan", label: "Hunyuan" },
  { value: "wan",     label: "Wan" },
];

const DURATIONS: { value: VideoDuration; label: string }[] = [
  { value: 5,  label: "5 segundos" },
  { value: 10, label: "10 segundos" },
];

const STYLES: { value: VideoStyle; label: string; desc: string }[] = [
  { value: "realistic",  label: "Realista",        desc: "Footage real" },
  { value: "cinematic",  label: "Cinematográfico", desc: "Look de cine" },
  { value: "animated",   label: "Animado",         desc: "Motion graphics" },
];

interface VideoOptionsProps {
  duration: VideoDuration;
  style: VideoStyle;
  provider: VideoProvider;
  onDurationChange: (d: VideoDuration) => void;
  onStyleChange:    (s: VideoStyle) => void;
  onProviderChange: (p: VideoProvider) => void;
}

export function VideoOptions({
  duration, style, provider,
  onDurationChange, onStyleChange, onProviderChange,
}: VideoOptionsProps) {
  return (
    <TooltipProvider>
      <div className="space-y-3 mt-3">

        {/* Proveedor */}
        <div className="space-y-1.5">
          <Label>Proveedor de IA</Label>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((p) => {
              const status = PROVIDER_STATUS[p.value];
              const badge  = STATUS_BADGE[status];
              const isDisabled = status === "disabled";
              const isSetup    = status === "requires_setup";
              const isSelected = provider === p.value;

              const btn = (
                <button
                  key={p.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onProviderChange(p.value)}
                  className={[
                    "p-2.5 rounded-lg border text-left text-sm font-medium transition-all w-full",
                    isDisabled  ? "opacity-40 cursor-not-allowed border-border/30" :
                    isSelected  ? "border-primary bg-primary/10 text-primary" :
                                  "border-border/50 hover:border-primary/50",
                  ].join(" ")}
                >
                  <div>{p.label}</div>
                  <div className={`text-[10px] mt-0.5 flex items-center gap-1 ${badge.className}`}>
                    {status === "available" && <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />}
                    {badge.label}
                  </div>
                </button>
              );

              return isSetup ? (
                <Tooltip key={p.value}>
                  <TooltipTrigger asChild>{btn}</TooltipTrigger>
                  <TooltipContent side="top">
                    Actualiza RUNWAY_API_KEY en Railway Dashboard
                  </TooltipContent>
                </Tooltip>
              ) : btn;
            })}
          </div>
        </div>

        {/* Duración */}
        <div className="space-y-1.5">
          <Label>Duración</Label>
          <div className="grid grid-cols-2 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => onDurationChange(d.value)}
                className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                  duration === d.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estilo (solo Runway) */}
        {provider === "runway" && (
          <div className="space-y-1.5">
            <Label>Estilo de video</Label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onStyleChange(s.value)}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    style === s.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </TooltipProvider>
  );
}

