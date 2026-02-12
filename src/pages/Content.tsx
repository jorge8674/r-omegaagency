import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function Content() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contenido</h1>
          <p className="text-muted-foreground">Crea y gestiona publicaciones para redes sociales</p>
        </div>
        <Button className="gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Publicación
        </Button>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-1">Sin publicaciones</h3>
          <p className="text-sm text-muted-foreground">Crea tu primera publicación</p>
        </CardContent>
      </Card>
    </div>
  );
}
