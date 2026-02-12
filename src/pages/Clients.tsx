import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

export default function Clients() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gestiona tus clientes y sus cuentas sociales</p>
        </div>
        <Button className="gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-1">Sin clientes aún</h3>
          <p className="text-sm text-muted-foreground mb-4">Agrega tu primer cliente para empezar</p>
          <Button className="gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Cliente
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
