import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, ExternalLink, Loader2, Palette, Layout, Layers, Star, Phone } from "lucide-react";
import { useBrandingEditor } from "@/components/branding/useBrandingEditor";
import { TabIdentity } from "@/components/branding/TabIdentity";
import { TabHero } from "@/components/branding/TabHero";

export default function ResellerBranding() {
  const { resellerId, slug, branding, loading, saving, uploading, update, save, uploadFile } = useBrandingEditor();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Editor de Landing</h1>
            <p className="text-sm text-muted-foreground mt-1">Personaliza tu página pública</p>
          </div>
          {slug && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              /{slug}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {slug && (
            <Button variant="outline" size="sm" onClick={() => window.open(`/landing/${slug}`, "_blank")}>
              <ExternalLink className="h-4 w-4 mr-1" /> Ver Landing
            </Button>
          )}
          <Button className="gradient-primary text-primary-foreground" size="sm" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="w-full justify-start bg-secondary/30 border border-border">
          <TabsTrigger value="identity" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Palette className="h-4 w-4 mr-1" /> Identidad Visual
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
            <Phone className="h-4 w-4 mr-1" /> Contacto & Footer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="mt-6">
          <TabIdentity branding={branding} update={update} uploading={uploading} uploadFile={uploadFile} />
        </TabsContent>
        <TabsContent value="hero" className="mt-6">
          <TabHero branding={branding} update={update} uploading={uploading} uploadFile={uploadFile} />
        </TabsContent>
        <TabsContent value="sections" className="mt-6">
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">Secciones — Próximamente</p>
          </div>
        </TabsContent>
        <TabsContent value="social" className="mt-6">
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">Social Proof — Próximamente</p>
          </div>
        </TabsContent>
        <TabsContent value="contact" className="mt-6">
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">Contacto & Footer — Próximamente</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
