import { BrandingData } from "./useBrandingEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  { key: "whatsapp", label: "WhatsApp", placeholder: "+1 787 000 0000" },
] as const;

export function TabContact({ branding, update }: Props) {
  const { social_links } = branding;

  const updateSocial = (key: string, value: string) => {
    update("social_links", { ...social_links, [key]: value });
  };

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
