import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";
import { VIDEO_PROVIDER_LABELS, type VideoProvider } from "@/lib/api/contentLab";

interface VideoResultProps {
  videoUrl: string;
  provider?: VideoProvider;
}

export function VideoResult({ videoUrl, provider = "runway" }: VideoResultProps) {
  const badgeLabel = VIDEO_PROVIDER_LABELS[provider]?.badge ?? "Video AI";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1 bg-purple-500/15 text-purple-600 border-purple-500/30">
          <Video className="h-3 w-3" /> {badgeLabel}
        </Badge>
      </div>
      <video
        src={videoUrl}
        controls
        loop
        muted
        playsInline
        className="w-full rounded-lg border border-border/50 bg-black"
      >
        Tu navegador no soporta video HTML5.
      </video>
    </div>
  );
}
