import { useState } from "react";
import type { Post } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays, ChevronLeft, ChevronRight, Loader2, Clock, Send, CheckCircle2,
} from "lucide-react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth,
  isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday,
} from "date-fns";
import { es } from "date-fns/locale";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted-foreground",
  scheduled: "bg-primary",
  published: "bg-success",
  failed: "bg-destructive",
};

const PLATFORMS = ["instagram", "tiktok", "facebook", "twitter", "linkedin"];

export default function CalendarPage() {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Supabase posts
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts" as any)
        .select("*")
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data as unknown as Post[];
    },
  });

  // Backend queue
  const { data: queueData, isLoading: queueLoading, refetch: refetchQueue } = useQuery({
    queryKey: ["scheduling-queue"],
    queryFn: () => api.getQueue("default"),
    retry: 1,
  });

  // Schedule post state
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleContent, setScheduleContent] = useState("");
  const [schedulePlatform, setSchedulePlatform] = useState("instagram");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduling, setScheduling] = useState(false);

  // Optimal times
  const [optimalPlatform, setOptimalPlatform] = useState("instagram");
  const [fetchingOptimal, setFetchingOptimal] = useState(false);
  const [optimalResult, setOptimalResult] = useState<any>(null);

  const handleSchedulePost = async () => {
    setScheduling(true);
    try {
      await api.schedulePost({
        title: scheduleTitle,
        content: scheduleContent,
        platform: schedulePlatform,
        scheduled_at: scheduleDate || new Date().toISOString(),
        client_id: "default",
      });
      toast({ title: "✅ Post agendado" });
      setScheduleTitle("");
      setScheduleContent("");
      refetchQueue();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setScheduling(false);
    }
  };

  const handleOptimalTimes = async () => {
    setFetchingOptimal(true);
    try {
      const result = await api.optimalTimes(optimalPlatform, "America/Mexico_City");
      setOptimalResult(result);
      toast({ title: "✅ Horarios calculados" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setFetchingOptimal(false);
    }
  };

  const handleApprovePost = async (postId: string) => {
    try {
      await api.approvePost(postId);
      toast({ title: "✅ Post aprobado" });
      refetchQueue();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getPostsForDay = (day: Date) =>
    (posts ?? []).filter((p) => {
      const postDate = p.scheduled_at ? new Date(p.scheduled_at) : new Date(p.created_at);
      return isSameDay(postDate, day);
    });

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const queueItems = Array.isArray(queueData) ? queueData : queueData?.posts ?? queueData?.queue ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Calendario</h1>
        <p className="text-muted-foreground">Visualiza, programa y gestiona publicaciones</p>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="schedule">Agendar Post</TabsTrigger>
          <TabsTrigger value="queue">Cola de Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="font-display text-lg capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date())}>Hoy</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                  {weekDays.map((d) => (
                    <div key={d} className="bg-secondary px-2 py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                  ))}
                  {days.map((day, i) => {
                    const dayPosts = getPostsForDay(day);
                    const inMonth = isSameMonth(day, currentMonth);
                    const today = isToday(day);
                    return (
                      <div key={i} className={`min-h-[80px] bg-card p-1.5 ${!inMonth ? "opacity-30" : ""} ${today ? "ring-1 ring-primary ring-inset" : ""}`}>
                        <span className={`text-xs font-medium ${today ? "flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>
                          {format(day, "d")}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {dayPosts.slice(0, 3).map((post) => (
                            <div key={post.id} className="flex items-center gap-1 rounded px-1 py-0.5 bg-secondary/50 cursor-pointer hover:bg-secondary" title={post.title}>
                              <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_COLORS[post.status] || "bg-muted-foreground"}`} />
                              <span className="text-[10px] truncate">{post.title}</span>
                            </div>
                          ))}
                          {dayPosts.length > 3 && <span className="text-[10px] text-muted-foreground px-1">+{dayPosts.length - 3} más</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 text-xs text-muted-foreground mt-4">
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-muted-foreground" /> Borrador</span>
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /> Programado</span>
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-success" /> Publicado</span>
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-destructive" /> Fallido</span>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Agendar Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm">Título</Label>
                  <Input value={scheduleTitle} onChange={(e) => setScheduleTitle(e.target.value)} placeholder="Título del post..." />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Contenido</Label>
                  <Textarea value={scheduleContent} onChange={(e) => setScheduleContent(e.target.value)} placeholder="Contenido..." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm">Plataforma</Label>
                    <Select value={schedulePlatform} onValueChange={setSchedulePlatform}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Fecha y hora</Label>
                    <Input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                  </div>
                </div>
                <Button className="w-full gradient-primary" onClick={handleSchedulePost} disabled={scheduling || !scheduleTitle}>
                  {scheduling ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : <><Send className="mr-2 h-4 w-4" /> Agendar Post</>}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Horarios Óptimos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={optimalPlatform} onValueChange={setOptimalPlatform}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
                <Button className="w-full" variant="outline" onClick={handleOptimalTimes} disabled={fetchingOptimal}>
                  {fetchingOptimal ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : 'Calcular Horarios Óptimos'}
                </Button>
                {optimalResult && (
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <pre className="text-sm whitespace-pre-wrap">{typeof optimalResult === "string" ? optimalResult : JSON.stringify(optimalResult, null, 2)}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queue" className="mt-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Cola de Publicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queueLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : queueItems.length > 0 ? (
                <div className="space-y-2">
                  {queueItems.map((item: any, i: number) => (
                    <div key={item.id || i} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{item.title || item.content?.slice(0, 60) || `Post ${i + 1}`}</p>
                        <p className="text-xs text-muted-foreground">{item.platform} · {item.scheduled_at ? format(new Date(item.scheduled_at), "dd/MM HH:mm") : "Sin fecha"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{item.status || "pending"}</Badge>
                        {item.status !== "approved" && item.id && (
                          <Button size="sm" variant="outline" onClick={() => handleApprovePost(item.id)}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No hay posts en la cola</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
