import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { es } from "date-fns/locale";
import type { CalendarDayData } from "../types";
import { STATUS_COLORS, STATUS_LABELS, WEEKDAYS } from "../types";

interface CalendarGridProps {
  currentMonth: Date;
  days: CalendarDayData[];
  isLoading: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarGrid({
  currentMonth, days, isLoading,
  onPrevMonth, onNextMonth, onToday,
}: CalendarGridProps) {
  return (
    <>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="font-display text-lg capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onToday}>Hoy</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {WEEKDAYS.map((d) => (
                <div key={d} className="bg-secondary px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
              {days.map((day, i) => (
                <div
                  key={i}
                  className={`min-h-[80px] bg-card p-1.5 ${!day.inMonth ? "opacity-30" : ""} ${day.today ? "ring-1 ring-primary ring-inset" : ""}`}
                >
                  <span className={`text-xs font-medium ${day.today ? "flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    {format(day.date, "d")}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {day.posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex items-center gap-1 rounded px-1 py-0.5 bg-secondary/50 cursor-pointer hover:bg-secondary" title={post.title}>
                        <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_COLORS[post.status] ?? "bg-muted-foreground"}`} />
                        <span className="text-[10px] truncate">{post.title}</span>
                      </div>
                    ))}
                    {day.posts.length > 3 && (
                      <span className="text-[10px] text-muted-foreground px-1">+{day.posts.length - 3} más</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 text-xs text-muted-foreground mt-4">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[key]}`} />
            {label}
          </span>
        ))}
      </div>
    </>
  );
}
