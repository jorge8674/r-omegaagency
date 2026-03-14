import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { Platform } from "@/lib/api/socialAccounts";
import type { PendingAccount } from "./ContextTab";

const PLATFORMS = [
  { value: "instagram" as Platform, label: "Instagram" },
  { value: "facebook" as Platform, label: "Facebook" },
  { value: "tiktok" as Platform, label: "TikTok" },
  { value: "twitter" as Platform, label: "X / Twitter" },
  { value: "linkedin" as Platform, label: "LinkedIn" },
  { value: "youtube" as Platform, label: "YouTube" },
  { value: "pinterest" as Platform, label: "Pinterest" },
];

interface SocialAccountFormProps {
  platform: Platform;
  setPlatform: (v: Platform) => void;
  username: string;
  setUsername: (v: string) => void;
  profileUrl: string;
  setProfileUrl: (v: string) => void;
  pendingAccounts: PendingAccount[];
  onAdd: () => void;
  onRemove: (i: number) => void;
}

export function SocialAccountForm({
  platform, setPlatform, username, setUsername,
  profileUrl, setProfileUrl, pendingAccounts, onAdd, onRemove,
}: SocialAccountFormProps) {
  const platformLabel = (p: string) => PLATFORMS.find((pl) => pl.value === p)?.label ?? p;

  return (
    <div className="border-t border-border pt-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Agregar Cuenta Social</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Plataforma</Label>
          <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Nombre de usuario *</Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@usuario" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">URL del perfil (opcional)</Label>
        <Input value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} placeholder="https://instagram.com/usuario" />
      </div>
      <div className="flex justify-end">
        <Button size="sm" className="gradient-primary" onClick={onAdd} disabled={!username.trim()}>
          <Plus className="mr-1 h-3 w-3" /> Agregar
        </Button>
      </div>
      {pendingAccounts.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">{pendingAccounts.length} cuenta(s) pendiente(s) de guardar</p>
          {pendingAccounts.map((acc, i) => (
            <div key={i} className="flex items-center gap-2 rounded border border-border/30 bg-muted/20 px-3 py-1.5">
              <span className="text-sm font-medium flex-1 truncate">{acc.username}</span>
              <span className="text-xs text-muted-foreground">{platformLabel(acc.platform)}</span>
              <button type="button" onClick={() => onRemove(i)} className="p-0.5 rounded hover:bg-muted">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
