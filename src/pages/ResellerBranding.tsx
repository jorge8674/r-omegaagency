import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, ExternalLink, Loader2, Palette, Layout, Layers, Star, Phone, RefreshCw, DollarSign } from "lucide-react";
import { useBrandingEditor } from "@/components/branding/useBrandingEditor";
import { TabIdentity } from "@/components/branding/TabIdentity";
import { TabHero } from "@/components/branding/TabHero";
import { TabSections } from "@/components/branding/TabSections";
import { TabSocialProof } from "@/components/branding/TabSocialProof";
import { TabContact } from "@/components/branding/TabContact";
import { TabPricing } from "@/components/branding/TabPricing";
import { useState, useCallback } from "react";

export default function ResellerBranding() {
  const { resellerId, slug, branding, loading, saving, uploading, update, save, uploadFile } = useBrandingEditor();
  const [previewKey, setPreviewKey] = useState(0);

  const refreshPreview = useCallback(() => setPreviewKey((k) => k + 1), []);

  if (!resellerId) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">No se proporcionó reseller_id</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      </div>
    );
  }

  const landingUrl = slug ? `/landing/${slug}` : `/landing/${resellerId}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Editor de Branding</h1>
            <p className="text-sm text-muted-foreground mt-1">Personaliza la landing page de tu agencia</p>
          </div>
          {slug && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              /{slug}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open(landingUrl, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-1" /> Ver Landing
          </Button>
          <Button className="gradient-primary text-primary-foreground" size="sm" onClick={async () => { await save(); refreshPreview(); }} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="flex gap-6 items-start">
        {/* Left: Editor (60%) */}
        <div className="w-full lg:w-[60%] min-w-0">
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="w-full justify-start bg-secondary/30 border border-border flex-wrap">
              <TabsTrigger value="identity" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Palette className="h-4 w-4 mr-1" /> Identidad
              </TabsTrigger>
              <TabsTrigger value="hero" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Layout className="h-4 w-4 mr-1" /> Hero
              </TabsTrigger>
              <TabsTrigger value="sections" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Layers className="h-4 w-4 mr-1" /> Secciones
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Star className="h-4 w-4 mr-1" /> Social Proof
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Phone className="h-4 w-4 mr-1" /> Contacto
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <DollarSign className="h-4 w-4 mr-1" /> Precios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="mt-6">
              <TabIdentity branding={branding} update={update} uploading={uploading} uploadFile={uploadFile} />
            </TabsContent>
            <TabsContent value="hero" className="mt-6">
              <TabHero branding={branding} update={update} uploading={uploading} uploadFile={uploadFile} />
            </TabsContent>
            <TabsContent value="sections" className="mt-6">
              <TabSections branding={branding} update={update} />
            </TabsContent>
            <TabsContent value="social" className="mt-6">
              <TabSocialProof branding={branding} update={update} />
            </TabsContent>
            <TabsContent value="contact" className="mt-6">
              <TabContact branding={branding} update={update} />
            </TabsContent>
            <TabsContent value="pricing" className="mt-6">
              <TabPricing plans={branding.pricing_plans || []} onChange={(plans) => update("pricing_plans", plans)} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Live Preview (40%) */}
        <div className="hidden lg:flex lg:w-[40%] flex-col sticky top-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-display text-muted-foreground uppercase tracking-wider">Preview en vivo</span>
            <Button variant="ghost" size="sm" onClick={refreshPreview} className="h-7 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" /> Refrescar
            </Button>
          </div>
          <div className="rounded-xl border border-border overflow-hidden bg-card shadow-lg" style={{ height: "calc(100vh - 200px)" }}>
            <iframe
              key={previewKey}
              src={landingUrl}
              className="w-full h-full"
              style={{ transform: "scale(0.55)", transformOrigin: "top left", width: "182%", height: "182%" }}
              title="Landing Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
