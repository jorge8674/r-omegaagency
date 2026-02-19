import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalendar } from "./hooks/useCalendar";
import { CalendarGrid } from "./components/CalendarGrid";
import { ScheduleForm } from "./components/ScheduleForm";
import { PostQueue } from "./components/PostQueue";
import { OptimalTimes } from "./components/OptimalTimes";
import { BlockAssignment } from "./components/BlockAssignment";

export default function CalendarPage() {
  const cal = useCalendar();
  const defaultTab = cal.prefilledTab || "calendar";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Calendario</h1>
        <p className="text-muted-foreground">Visualiza, programa y gestiona publicaciones</p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="schedule">Agendar Post</TabsTrigger>
          <TabsTrigger value="assign">Asignar Bloque</TabsTrigger>
          <TabsTrigger value="queue">Cola de Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <CalendarGrid
            currentMonth={cal.currentMonth}
            days={cal.days}
            isLoading={cal.postsLoading}
            onPrevMonth={cal.goToPrev}
            onNextMonth={cal.goToNext}
            onToday={cal.goToToday}
            onRefresh={cal.refetchCalendar}
          />
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ScheduleForm
              scheduling={cal.scheduling}
              onSubmit={cal.schedulePost}
              prefilledText={cal.prefilledText}
              prefilledContentType={cal.prefilledContentType}
            />
            <OptimalTimes
              fetching={cal.fetchingOptimal}
              result={cal.optimalResult}
              onFetch={cal.fetchOptimalTimes}
            />
          </div>
        </TabsContent>

        <TabsContent value="assign" className="mt-4">
          <BlockAssignment />
        </TabsContent>

        <TabsContent value="queue" className="mt-4">
          <PostQueue
            items={cal.queueItems}
            isLoading={cal.queueLoading}
            onApprove={cal.approvePost}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}