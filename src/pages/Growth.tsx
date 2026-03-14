import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Rocket, Mic2, FlaskConical } from "lucide-react";
import { useGrowth } from "@/hooks/useGrowth";
import {
  OpportunityCards, QuickWinsList, BrandProfileCard,
  ExperimentCard, ValidationCard, ImproveCard,
} from "@/components/growth/GrowthCards";

const PLATFORMS = ["instagram", "tiktok", "facebook", "twitter", "linkedin", "youtube"];

export default function Growth() {
  const g = useGrowth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Growth & Brand Voice</h1>
        <p className="text-muted-foreground">Crecimiento, identidad de marca y experimentos</p>
      </div>

      <Tabs defaultValue="opportunities">
        <TabsList>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="brand-voice">Brand Voice</TabsTrigger>
          <TabsTrigger value="experiments">Experimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4 mt-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Identificar Oportunidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">Nicho</Label>
                  <Input value={g.niche} onChange={(e) => g.setNiche(e.target.value)} placeholder="ej: fitness, moda..." />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Plataforma</Label>
                  <Select value={g.platform} onValueChange={g.setPlatform}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gradient-primary" onClick={g.handleFindOpps} disabled={g.findingOpps || !g.niche}>
                  {g.findingOpps && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Oportunidades
                </Button>
                <Button variant="outline" className="flex-1" onClick={g.handleQuickWins} disabled={g.findingQuickWins || !g.niche}>
                  {g.findingQuickWins && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Quick Wins
                </Button>
              </div>
              {g.oppsResult && <OpportunityCards data={g.oppsResult} />}
              {g.quickWinsResult && <QuickWinsList data={g.quickWinsResult} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand-voice" className="space-y-4 mt-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Mic2 className="h-5 w-5 text-primary" />
                Perfil de Marca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input value={g.brandName} onChange={(e) => g.setBrandName(e.target.value)} placeholder="Nombre de la marca" />
              <Textarea value={g.brandDesc} onChange={(e) => g.setBrandDesc(e.target.value)} placeholder="Descripción de la marca..." rows={2} />
              <Textarea value={g.samplePosts} onChange={(e) => g.setSamplePosts(e.target.value)} placeholder="3 posts de ejemplo (uno por línea)" rows={3} />
              <Button className="w-full gradient-primary" onClick={g.handleCreateProfile} disabled={g.creatingProfile || !g.brandName}>
                {g.creatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Perfil
              </Button>
              {g.brandProfile && <BrandProfileCard data={g.brandProfile} />}
              {g.brandProfile && (
                <div className="border-t border-border pt-3 space-y-3">
                  <Textarea placeholder="Contenido a validar..." value={g.validateText} onChange={(e) => g.setValidateText(e.target.value)} rows={2} />
                  <Button variant="outline" className="w-full" onClick={g.handleValidate} disabled={g.validating || !g.validateText}>
                    {g.validating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Validar Contenido
                  </Button>
                  {g.validationResult && <ValidationCard data={g.validationResult} />}
                  <Textarea placeholder="Contenido a mejorar..." value={g.improveText} onChange={(e) => g.setImproveText(e.target.value)} rows={2} />
                  <Button variant="outline" className="w-full" onClick={g.handleImprove} disabled={g.improving || !g.improveText}>
                    {g.improving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mejorar Contenido
                  </Button>
                  {g.improvedResult && <ImproveCard data={g.improvedResult} />}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiments" className="space-y-4 mt-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                Diseñar Experimento A/B
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input value={g.hypothesis} onChange={(e) => g.setHypothesis(e.target.value)} placeholder="Hipótesis: ej. 'Los reels cortos generan más engagement'" />
              <Input value={g.variable} onChange={(e) => g.setVariable(e.target.value)} placeholder="Variable a testear: ej. 'duración del video'" />
              <Button className="w-full gradient-primary" onClick={g.handleDesignExperiment} disabled={g.designing || !g.hypothesis}>
                {g.designing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Diseñar Experimento
              </Button>
              {g.experimentResult && <ExperimentCard data={g.experimentResult} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
