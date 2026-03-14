import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const roleBadgeClass: Record<string, string> = {
  admin: "bg-primary/20 text-primary border-primary/30",
  editor: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  viewer: "bg-muted text-muted-foreground border-border",
};

interface TeamMember {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
}

interface SettingsTeamTabProps {
  team: TeamMember[];
  isAdmin: boolean;
  updateRole: { mutate: (data: { userId: string; role: string }, opts: object) => void };
}

export function SettingsTeamTab({ team, isAdmin, updateRole }: SettingsTeamTabProps) {
  const { toast } = useToast();

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Miembros del Equipo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {team.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No hay miembros</p>
        ) : (
          <div className="space-y-3">
            {team.map((member) => (
              <div key={member.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {(member.full_name || "U").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.full_name || "Sin nombre"}</p>
                  <p className="text-xs text-muted-foreground">{member.user_id.slice(0, 8)}...</p>
                </div>
                {isAdmin ? (
                  <Select
                    value={member.role}
                    onValueChange={(v) =>
                      updateRole.mutate(
                        { userId: member.user_id, role: v },
                        {
                          onSuccess: () => toast({ title: "Rol actualizado" }),
                          onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
                        }
                      )
                    }
                  >
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className={roleBadgeClass[member.role] ?? ""}>
                    {roleLabels[member.role] ?? member.role}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
