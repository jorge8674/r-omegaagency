import { BrandingData } from "./useBrandingEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface Props {
  branding: BrandingData;
  update: <K extends keyof BrandingData>(key: K, value: BrandingData[K]) => void;
}

const socialFields = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/tu-agencia" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/tu-agencia" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/tu-agencia" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@tu-agencia" },
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/tu-agencia" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@tu-agencia" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "+1 787 000 0000" },
] as const;

export function TabContact({ branding, update }: Props) {
  const { social_links, legal_pages } = branding;

  const updateSocial = (key: string, value: string) => {
    update("social_links", { ...social_links, [key]: value });
  };

  const pages = legal_pages ?? [];
  const setPage = (i: number, k: "title" | "content", v: string) => {
    const items = [...pages];
    items[i] = { ...items[i], [k]: v };
    update("legal_pages", items);
  };
  const addPage = () => update("legal_pages", [...pages, { title: "", content: "" }]);
  const removePage = (i: number) => update("legal_pages", pages.filter((_, j) => j !== i));

  return (
    <div className="space-y-6">
      {/* Contacto */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-display text-lg">Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Email de contacto</label>
              <Input placeholder="contacto@tuagencia.com" value={branding.contact_email}
                onChange={(e) => update("contact_email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Teléfono</label>
              <Input placeholder="+1 787 000 0000" value={branding.contact_phone}
                onChange={(e) => update("contact_phone", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Redes Sociales */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-display text-lg">Redes Sociales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {socialFields.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs text-muted-foreground">{label}</label>
              <Input placeholder={placeholder}
                value={(social_links as any)[key] || ""}
                onChange={(e) => updateSocial(key, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Páginas Legales */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-display text-lg">Páginas Legales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pages.map((page, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Página {i + 1}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"
                  onClick={() => removePage(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Input placeholder="Título (ej: Política de Privacidad)" value={page.title}
                onChange={(e) => setPage(i, "title", e.target.value)} />
              <Textarea placeholder="Contenido de la página legal..." value={page.content}
                onChange={(e) => setPage(i, "content", e.target.value)} rows={4} />
            </div>
          ))}
          {pages.length < 5 && (
            <Button variant="outline" size="sm" className="w-full border-dashed" onClick={addPage}>
              <Plus className="h-4 w-4 mr-1" /> Añadir Página Legal
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-display text-lg">Footer</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="© 2026 Mi Agencia. Todos los derechos reservados."
            value={branding.footer_text}
            onChange={(e) => update("footer_text", e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
