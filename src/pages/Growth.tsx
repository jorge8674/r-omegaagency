import { useState } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Rocket, Mic2, FlaskConical } from "lucide-react";

const PLATFORMS = ["instagram", "tiktok", "facebook", "twitter", "linkedin", "youtube"];

export default function Growth() {
  const { toast } = useToast();

  // Opportunities
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [findingOpps, setFindingOpps] = useState(false);
  const [oppsResult, setOppsResult] = useState<any>(null);
  const [findingQuickWins, setFindingQuickWins] = useState(false);
  const [quickWinsResult, setQuickWinsResult] = useState<any>(null);

  // Brand Voice
  const [brandName, setBrandName] = useState("");
  const [brandDesc, setBrandDesc] = useState("");
  const [samplePosts, setSamplePosts] = useState("");
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [brandProfile, setBrandProfile] = useState<any>(null);
  const [validateText, setValidateText] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [improveText, setImproveText] = useState("");
  const [improving, setImproving] = useState(false);
  const [improvedResult, setImprovedResult] = useState<any>(null);

  // Experiments
  const [hypothesis, setHypothesis] = useState("");
  const [variable, setVariable] = useState("");
  const [designing, setDesigning] = useState(false);
  const [experimentResult, setExperimentResult] = useState<any>(null);

  const handleFindOpps = async () => {
    setFindingOpps(true);
    try {
      const result = await api.identifyOpportunities({ niche, platform, account_data: {} });
      setOppsResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setFindingOpps(false);
    }
  };

  const handleQuickWins = async () => {
    setFindingQuickWins(true);
    try {
      const result = await api.quickWins(niche, platform);
      setQuickWinsResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setFindingQuickWins(false);
    }
  };

  const handleCreateProfile = async () => {
    setCreatingProfile(true);
    try {
      const result = await api.createBrandProfile(
        brandName,
        brandDesc,
        samplePosts,
      );
      setBrandProfile(result);
      toast({ title: "Perfil de marca creado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setCreatingProfile(false);
    }
  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const result = await api.validateContent(validateText, brandProfile || {});
      setValidationResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setValidating(false);
    }
  };

  const handleImprove = async () => {
    setImproving(true);
    try {
      const result = await api.improveContent(improveText, brandProfile || {});
      setImprovedResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setImproving(false);
    }
  };

  const handleDesignExperiment = async () => {
    setDesigning(true);
    try {
      const result = await api.designExperiment(hypothesis, variable, platform);
      setExperimentResult(result);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setDesigning(false);
    }
  };

  const OpportunityCards = ({ data }: { data: any }) => {
    const opportunities = data?.data?.opportunities || data?.opportunities || data?.data || [];
    if (Array.isArray(opportunities) && opportunities.length > 0 && opportunities[0]?.title) {
      return (
        <div className="mt-3 space-y-3">
          {opportunities.map((opp: any, i: number) => (
            <div key={i} className="border border-border/50 rounded-lg p-4 bg-secondary/30">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{opp.title}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  opp.potential_impact === 'high' ? 'bg-success/20 text-success' :
                  opp.potential_impact === 'medium' ? 'bg-chart-3/20 text-chart-3' : 'bg-muted text-muted-foreground'
                }`}>
                  {opp.potential_impact?.toUpperCase()} IMPACT
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{opp.description}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>⚡ Esfuerzo: {opp.effort_required}</span>
                <span>📈 ROI estimado: {opp.estimated_roi}x</span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return <ResultBlock data={data} />;
  };

  const ResultBlock = ({ data }: { data: any }) => (
    <div className="rounded-lg bg-secondary/50 p-3 mt-3">
      <pre className="text-sm whitespace-pre-wrap overflow-x-auto">{typeof data === "string" ? data : JSON.stringify(data, null, 2)}</pre>
    </div>
  );

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
                  <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="ej: fitness, moda..." />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Plataforma</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gradient-primary" onClick={handleFindOpps} disabled={findingOpps || !niche}>
                  {findingOpps && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Oportunidades
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleQuickWins} disabled={findingQuickWins || !niche}>
                  {findingQuickWins && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Quick Wins
                </Button>
              </div>
              {oppsResult && <OpportunityCards data={oppsResult} />}
              {quickWinsResult && <OpportunityCards data={quickWinsResult} />}
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
              <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Nombre de la marca" />
              <Textarea value={brandDesc} onChange={(e) => setBrandDesc(e.target.value)} placeholder="Descripción de la marca..." rows={2} />
              <Textarea value={samplePosts} onChange={(e) => setSamplePosts(e.target.value)} placeholder="3 posts de ejemplo (uno por línea)" rows={3} />
              <Button className="w-full gradient-primary" onClick={handleCreateProfile} disabled={creatingProfile || !brandName}>
                {creatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Perfil
              </Button>
              {brandProfile && <ResultBlock data={brandProfile} />}

              {brandProfile && (
                <div className="border-t border-border pt-3 space-y-3">
                  <Textarea placeholder="Contenido a validar..." value={validateText} onChange={(e) => setValidateText(e.target.value)} rows={2} />
                  <Button variant="outline" className="w-full" onClick={handleValidate} disabled={validating || !validateText}>
                    {validating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Validar Contenido
                  </Button>
                  {validationResult && <ResultBlock data={validationResult} />}

                  <Textarea placeholder="Contenido a mejorar..." value={improveText} onChange={(e) => setImproveText(e.target.value)} rows={2} />
                  <Button variant="outline" className="w-full" onClick={handleImprove} disabled={improving || !improveText}>
                    {improving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mejorar Contenido
                  </Button>
                  {improvedResult && <ResultBlock data={improvedResult} />}
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
              <Input value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} placeholder="Hipótesis: ej. 'Los reels cortos generan más engagement'" />
              <Input value={variable} onChange={(e) => setVariable(e.target.value)} placeholder="Variable a testear: ej. 'duración del video'" />
              <Button className="w-full gradient-primary" onClick={handleDesignExperiment} disabled={designing || !hypothesis}>
                {designing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Diseñar Experimento
              </Button>
              {experimentResult && <ResultBlock data={experimentResult} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
