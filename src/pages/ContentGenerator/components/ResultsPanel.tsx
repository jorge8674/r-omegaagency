import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, ExternalLink } from "lucide-react";
import { ScriptResult } from "./ScriptResult";
import { BrandValidator } from "./BrandValidator";
import type { ScriptScene, BrandValidationResult } from "../types";

interface Props {
  caption: string;
  imageUrl: string | null;
  hashtags: string[];
  scriptScenes: ScriptScene[];
  scriptRaw: string;
  brandResult: BrandValidationResult | null;
  validatingBrand: boolean;
  onCopy: (text: string) => void;
  onValidateBrand: () => void;
}

export function ResultsPanel({
  caption, imageUrl, hashtags, scriptScenes, scriptRaw,
  brandResult, validatingBrand, onCopy, onValidateBrand,
}: Props) {
  const hasContent = !!(caption || imageUrl || hashtags.length || scriptScenes.length || scriptRaw);
  if (!hasContent && !brandResult) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Resultados</h3>

      {/* Caption */}
      {caption && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Caption</label>
            <Button size="sm" variant="ghost" onClick={() => onCopy(caption)}>
              <Copy className="h-4 w-4 mr-1" /> Copiar
            </Button>
          </div>
          <p className="text-sm bg-secondary/50 rounded-lg p-3 whitespace-pre-wrap">{caption}</p>
        </div>
      )}

      {/* Image */}
      {imageUrl && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Imagen Generada</label>
          <img
            src={imageUrl}
            alt="Contenido generado"
            className="rounded-lg max-h-64 object-contain w-full"
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" /> Abrir
              </a>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const a = document.createElement("a");
                a.href = imageUrl;
                a.download = "generated-image.png";
                a.click();
              }}
            >
              <Download className="h-4 w-4 mr-1" /> Descargar
            </Button>
          </div>
        </div>
      )}

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Hashtags</label>
            <Button size="sm" variant="ghost" onClick={() => onCopy(hashtags.join(" "))}>
              <Copy className="h-4 w-4 mr-1" /> Copiar
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {hashtags.map((tag, i) => (
              <Badge key={i} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Script */}
      <ScriptResult scenes={scriptScenes} raw={scriptRaw} />

      {/* Brand Validation */}
      {(caption || scriptRaw) && (
        <Button
          onClick={onValidateBrand}
          disabled={validatingBrand}
          variant="outline"
          className="w-full"
        >
          {validatingBrand ? "Validando…" : "🛡️ Validar Brand Voice"}
        </Button>
      )}
      {brandResult && <BrandValidator result={brandResult} />}
    </div>
  );
}
