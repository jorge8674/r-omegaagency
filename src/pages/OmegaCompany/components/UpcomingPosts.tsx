import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api/core";
import { format, addDays, isWithinInterval, startOfToday } from "date-fns";
import { es } from "date-fns/locale";

interface ScheduledPost {
  id: string;
  scheduled_at: string;
  platform: string;
  client_name: string;
  title: string;
  status: string;
}

export function UpcomingPosts() {
  const { data, isLoading } = useQuery({
    queryKey: ["omega-upcoming-posts"],
    queryFn: () => apiCall<ScheduledPost[]>("/omega/upcoming-posts/"),
    refetchInterval: 60000,
    retry: 1,
    staleTime: 0,
  });

  const today = startOfToday();
  const in7Days = addDays(today, 7);

  const posts = (data ?? []).filter((p) => {
    const d = new Date(p.scheduled_at);
    return isWithinInterval(d, { start: today, end: in7Days });
  });

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4 text-primary" />
          Posts Próximos (7 días)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CalendarDays className="mb-2 h-8 w-8 opacity-30" />
            <p className="text-sm">Sin posts programados</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-3 rounded-lg border border-border/30 bg-muted/20 px-3 py-2"
              >
                <span className="shrink-0 text-[10px] font-mono text-muted-foreground w-20">
                  {format(new Date(post.scheduled_at), "dd MMM HH:mm", { locale: es })}
                </span>
                <Badge variant="outline" className="shrink-0 text-[10px] capitalize">
                  {post.platform}
                </Badge>
                <p className="flex-1 truncate text-xs">{post.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{post.client_name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
