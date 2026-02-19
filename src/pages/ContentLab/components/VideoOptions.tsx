import { Label } from "@/components/ui/label";
import type { VideoDuration, VideoStyle } from "@/lib/api/contentLab";

const DURATIONS: { value: VideoDuration; label: string }[] = [
  { value: 5, label: "5 segundos" },
  { value: 10, label: "10 segundos" },
];

const STYLES: { value: VideoStyle; label: string; desc: string }[] = [
  { value: "realistic", label: "Realista", desc: "Footage real" },
  { value: "cinematic", label: "Cinematográfico", desc: "Look de cine" },
  { value: "animated", label: "Animado", desc: "Motion graphics" },
];

interface VideoOptionsProps {
  duration: VideoDuration;
  style: VideoStyle;
  onDurationChange: (d: VideoDuration) => void;
  onStyleChange: (s: VideoStyle) => void;
}

export function VideoOptions({ duration, style, onDurationChange, onStyleChange }: VideoOptionsProps) {
  return (
    <div className="space-y-3 mt-3">
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
    </div>
  );
}
