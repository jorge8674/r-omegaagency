import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Camera, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsOrgTabProps {
  avatarUrl: string | null;
  organization: { name: string; slug?: string } | null;
  isAdmin: boolean;
  orgName: string;
  setOrgName: (v: string) => void;
  updateAvatar: { mutate: (file: File, opts: object) => void; isPending: boolean };
  updateOrg: { mutate: (data: { name: string }, opts: object) => void; isPending: boolean };
}

export function SettingsOrgTab({
  avatarUrl,
  organization,
  isAdmin,
  orgName,
  setOrgName,
  updateAvatar,
  updateOrg,
}: SettingsOrgTabProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Archivo muy grande", description: "Máximo 2MB", variant: "destructive" });
      return;
    }
    updateAvatar.mutate(file, {
      onSuccess: () => toast({ title: "Foto de perfil actualizada" }),
      onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  const handleSaveOrg = () => {
    if (!orgName.trim()) return;
    updateOrg.mutate(
      { name: orgName.trim() },
      {
        onSuccess: () => toast({ title: "Organización actualizada" }),
        onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            Foto de Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="h-20 w-20">
              {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {organization?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Cambiar foto</p>
            <p className="text-xs text-muted-foreground">JPG, PNG. Máximo 2MB.</p>
            {updateAvatar.isPending && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <Loader2 className="h-3 w-3 animate-spin" /> Subiendo...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            Datos de la Organización
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={!isAdmin} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={organization?.slug ?? ""} disabled />
            <p className="text-xs text-muted-foreground">Identificador único (no editable)</p>
          </div>
          {isAdmin && (
            <Button className="gradient-primary" onClick={handleSaveOrg} disabled={updateOrg.isPending}>
              {updateOrg.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
