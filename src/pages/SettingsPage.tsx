import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Building, Users, ScrollText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useOrganization } from "@/hooks/useOrganization";
import { useProfile } from "@/hooks/useProfile";
import { SettingsOrgTab } from "@/components/settings/SettingsOrgTab";
import { SettingsTeamTab } from "@/components/settings/SettingsTeamTab";

export default function SettingsPage() {
  const { loading, organization, team, auditLogs, updateOrg, updateRole, isAdmin } = useOrganization();
  const { avatarUrl, updateAvatar } = useProfile();

  const [orgName, setOrgName] = useState("");
  const [nameInit, setNameInit] = useState(false);

  if (organization && !nameInit) {
    setOrgName(organization.name);
    setNameInit(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Administra tu organización y preferencias</p>
      </div>

      <Tabs defaultValue="org" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="org" className="gap-2">
            <Building className="h-4 w-4" /> Organización
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" /> Equipo
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <ScrollText className="h-4 w-4" /> Auditoría
          </TabsTrigger>
        </TabsList>

        <TabsContent value="org">
          <SettingsOrgTab
            avatarUrl={avatarUrl}
            organization={organization}
            isAdmin={isAdmin}
            orgName={orgName}
            setOrgName={setOrgName}
            updateAvatar={updateAvatar}
            updateOrg={updateOrg}
          />
        </TabsContent>

        <TabsContent value="team">
          <SettingsTeamTab team={team} isAdmin={isAdmin} updateRole={updateRole} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ScrollText className="h-4 w-4 text-primary" />
                Logs de Auditoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Sin actividad registrada aún</p>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map((log: any) => (
                    <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border/50 p-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">
                          {log.action} <span className="text-muted-foreground">en {log.entity_type}</span>
                        </p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{JSON.stringify(log.details)}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.created_at), "dd MMM HH:mm", { locale: es })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
