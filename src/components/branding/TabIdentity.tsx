import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import type { BrandingData } from "./useBrandingEditor";
import { useRef } from "react";

interface Props {
  branding: BrandingData;
  update: <K extends keyof BrandingData>(key: K, value: BrandingData[K]) => void;
  uploading: boolean;
  uploadFile: (file: File, field: "logo_url" | "hero_media_url") => void;
}

export function TabIdentity({ branding, update, uploading, uploadFile }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* Agency Name */}
      <Card className="glass">
        <CardHeader><CardTitle className="text-sm font-display">Nombre de Agencia</CardTitle></CardHeader>
        <CardContent>
          <Input
            placeholder="Mi Agencia"
            value={branding.agency_name}
            onChange={(e) => update("agency_name", e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Logo */}
      <Card className="glass">
        <CardHeader><CardTitle className="text-sm font-display">Logo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {branding.logo_url ? (
            <div className="relative inline-block">
              <img src={branding.logo_url} alt="Logo" className="h-[120px] w-[120px] object-contain rounded-lg border border-border bg-secondary/30 p-2" />
              <button
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                onClick={() => update("logo_url", "")}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadFile(f, "logo_url");
            e.target.value = "";
          }} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
            Subir Logo
          </Button>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card className="glass">
        <CardHeader><CardTitle className="text-sm font-display">Colores</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color Primario</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={branding.primary_color || "#D4A017"}
                  onChange={(e) => update("primary_color", e.target.value)}
                  className="h-10 w-10 rounded border-0 cursor-pointer bg-transparent"
                />
                <Input
                  value={branding.primary_color || "#D4A017"}
                  onChange={(e) => update("primary_color", e.target.value)}
                  placeholder="#D4A017"
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Color Secundario</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={branding.secondary_color || "#1a1a2e"}
                  onChange={(e) => update("secondary_color", e.target.value)}
                  className="h-10 w-10 rounded border-0 cursor-pointer bg-transparent"
                />
                <Input
                  value={branding.secondary_color || "#1a1a2e"}
                  onChange={(e) => update("secondary_color", e.target.value)}
                  placeholder="#1a1a2e"
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
          {/* Live Preview */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-muted-foreground">Preview:</span>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: branding.primary_color || "#D4A017", color: "#000" }}
            >
              Botón Primario
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: branding.secondary_color || "#1a1a2e", color: "#fff" }}
            >
              Botón Secundario
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
