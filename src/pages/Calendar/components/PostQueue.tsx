import { CalendarDays, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { QueueItem } from "../types";

interface PostQueueProps {
  items: QueueItem[];
  isLoading: boolean;
  onApprove: (postId: string) => Promise<void>;
}

export function PostQueue({ items, isLoading, onApprove }: PostQueueProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Cola de Publicación
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={item.id ?? i} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {item.title ?? item.content?.slice(0, 60) ?? `Post ${i + 1}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.platform} · {item.scheduled_at
                      ? format(new Date(item.scheduled_at), "dd/MM HH:mm")
                      : "Sin fecha"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.status ?? "pending"}
                  </Badge>
                  {item.status !== "approved" && item.id && (
                    <Button size="sm" variant="outline" onClick={() => onApprove(item.id!)}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay posts en la cola
          </p>
        )}
      </CardContent>
    </Card>
  );
}
