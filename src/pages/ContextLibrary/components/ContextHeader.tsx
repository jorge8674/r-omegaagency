import { BookOpen, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  onAdd: () => void;
}

export function ContextHeader({ search, onSearchChange, onAdd }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Context Library
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Base de conocimiento para todos los agentes del sistema
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Agregar Documento
        </Button>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
