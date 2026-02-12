import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload } from "lucide-react";

export default function Media() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Medios</h1>
          <p className="text-muted-foreground">Gestiona imágenes y videos para tus publicaciones</p>
        </div>
        <Button className="gradient-primary">
          <Upload className="mr-2 h-4 w-4" />
          Subir Archivo
        </Button>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-1">Sin archivos</h3>
          <p className="text-sm text-muted-foreground">Sube imágenes y videos para usar en tus publicaciones</p>
        </CardContent>
      </Card>
    </div>
  );
}
