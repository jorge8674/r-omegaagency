import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, ImageIcon, VideoIcon } from "lucide-react";
import type { BrandingData } from "./useBrandingEditor";
import { useRef } from "react";

interface Props {
  branding: BrandingData;
  update: <K extends keyof BrandingData>(key: K, value: BrandingData[K]) => void;
  uploading: boolean;
  uploadFile: (file: File, field: "logo_url" | "hero_media_url") => void;
}

export function TabHero({ branding, update, uploading, uploadFile }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isVideo = branding.hero_type === "video";

  return (
    <div className="space-y-6">
      {/* Hero Type */}
      <Card className="glass">
        <CardHeader><CardTitle className="text-sm font-display">Tipo de Hero</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={branding.hero_type === "image" ? "default" : "outline"}
              className={branding.hero_type === "image" ? "gradient-primary text-primary-foreground" : ""}
              size="sm"
              onClick={() => update("hero_type", "image")}
            >
              <ImageIcon className="h-4 w-4 mr-1" /> Imagen
            </Button>
            <Button
              variant={branding.hero_type === "video" ? "default" : "outline"}
              className={branding.hero_type === "video" ? "gradient-primary text-primary-foreground" : ""}
              size="sm"
              onClick={() => update("hero_type", "video")}
            >
              <VideoIcon className="h-4 w-4 mr-1" /> Video
            </Button>
            <Button
              variant={branding.hero_type === "none" ? "default" : "outline"}
              className={branding.hero_type === "none" ? "gradient-primary text-primary-foreground" : ""}
              size="sm"
              onClick={() => update("hero_type", "none")}
            >
              Sin media
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hero Media — hidden when "none" */}
      {branding.hero_type !== "none" && (
        <Card className="glass">
          <CardHeader><CardTitle className="text-sm font-display">Media del Hero</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {branding.hero_media_url && (
              <div className="rounded-lg overflow-hidden border border-border max-h-[280px]">
                {isVideo ? (
                  <video src={branding.hero_media_url} autoPlay loop muted playsInline className="w-full max-h-[280px] object-cover" />
                ) : (
                  <img src={branding.hero_media_url} alt="Hero" className="w-full max-h-[280px] object-cover" />
                )}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept={isVideo ? "video/mp4,video/webm" : "image/*"}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, "hero_media_url");
                e.target.value = "";
              }}
            />
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
                {branding.hero_media_url ? "Cambiar" : "Subir"} {isVideo ? "Video" : "Imagen"}
              </Button>
              {branding.hero_media_url && (
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => update("hero_media_url", "")}>
                  Eliminar media
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Máximo 15MB</p>
          </CardContent>
        </Card>
      )}

      {/* Hero Texts */}
      <Card className="glass">
        <CardHeader><CardTitle className="text-sm font-display">Textos del Hero</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Título principal</Label>
            <Input placeholder="Potencia tu marca digital" value={branding.hero_title} onChange={(e) => update("hero_title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Input placeholder="Estrategia + IA para resultados reales" value={branding.hero_subtitle} onChange={(e) => update("hero_subtitle", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Texto del CTA</Label>
              <Input placeholder="Empezar Ahora" value={branding.hero_cta_text} onChange={(e) => update("hero_cta_text", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL del CTA</Label>
              <Input placeholder="https://..." value={branding.hero_cta_url} onChange={(e) => update("hero_cta_url", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
