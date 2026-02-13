"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import Link from "next/link";

interface TrainingSessionItem {
  id: string;
  date: Date;
  status: string;
  notes: string | null;
  plan: {
    id: string;
    title: string;
    focusArea: string | null;
    duration: number;
  };
  group: {
    id: string;
    name: string;
  };
}

interface TrainingPlanItem {
  id: string;
  title: string;
  date: Date;
  focusArea: string | null;
  duration: number;
  status: string;
  difficulty: string;
  _count: { sessions: number };
}

interface TrainingCalendarProps {
  sessions: TrainingSessionItem[];
  plans?: TrainingPlanItem[];
  dictionary: {
    calendar: Record<string, unknown>;
    plans: Record<string, unknown>;
  };
  locale: string;
}

const STATUS_COLORS: Record<string, string> = {
  PLANNED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function TrainingCalendar({ sessions, plans = [], dictionary, locale }: TrainingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() || 7; // Monday as 1

  const daysInMonth = lastDay.getDate();
  const prevMonthDays = startDay - 1;

  const monthNames = locale === "tr"
    ? ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    : locale === "es"
    ? ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dayNames = locale === "tr"
    ? ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]
    : locale === "es"
    ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getSessionsForDay = (day: number) => {
    return sessions.filter((s) => {
      const d = new Date(s.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const getPlansForDay = (day: number) => {
    return plans.filter((p) => {
      const d = new Date(p.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const sessionStatus = (dictionary.calendar?.sessionStatus || {}) as Record<string, string>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {monthNames[month]} {year}
        </h3>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Empty cells for previous month */}
        {Array.from({ length: prevMonthDays }).map((_, i) => (
          <div key={`prev-${i}`} className="min-h-[80px] rounded-md bg-muted/30 p-1" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const daySessions = getSessionsForDay(day);
          const dayPlans = getPlansForDay(day);
          return (
            <Card
              key={day}
              className={`min-h-[80px] p-1 ${isToday(day) ? "ring-2 ring-primary" : ""}`}
            >
              <CardContent className="p-1">
                <div className={`text-xs font-medium ${isToday(day) ? "text-primary font-bold" : ""}`}>
                  {day}
                </div>
                <div className="mt-1 space-y-0.5">
                  {dayPlans.map((plan) => (
                    <Link key={`plan-${plan.id}`} href={`/${locale}/training/plans/${plan.id}`}>
                      <Badge
                        variant="secondary"
                        className="block truncate text-[10px] px-1 py-0 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 cursor-pointer hover:opacity-80"
                      >
                        <ClipboardList className="inline mr-0.5 h-2.5 w-2.5" />
                        {plan.title}
                      </Badge>
                    </Link>
                  ))}
                  {daySessions.map((session) => (
                    <Badge
                      key={session.id}
                      variant="secondary"
                      className={`block truncate text-[10px] px-1 py-0 ${STATUS_COLORS[session.status] || ""}`}
                    >
                      {session.plan.title}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-purple-100 dark:bg-purple-900" />
          <span>{(dictionary.calendar?.trainingPlan as string) || "Antrenman Planı"}</span>
        </div>
        {Object.entries(sessionStatus).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[key]?.split(" ")[0] || "bg-gray-300"}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
