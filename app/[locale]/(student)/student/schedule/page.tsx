import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentSchedule } from "@/lib/actions/students-portal";
import { Calendar, MapPin, Clock } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 1, label: "Pazartesi" },
  { value: 2, label: "Salı" },
  { value: 3, label: "Çarşamba" },
  { value: 4, label: "Perşembe" },
  { value: 5, label: "Cuma" },
  { value: 6, label: "Cumartesi" },
  { value: 0, label: "Pazar" },
];

export default async function StudentSchedulePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/tr/student-login");
  }

  const student = await prisma.student.findFirst({
    where: { email: session.user.email! },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!student) {
    redirect("/tr/student-login");
  }

  const schedulesByDay = await getStudentSchedule(student.id);

  // Determine today's day of week (0=Sunday ... 6=Saturday)
  const todayDayOfWeek = new Date().getDay();

  const hasAnySchedule = Object.values(schedulesByDay).some(
    (day) => day.length > 0
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-full" />
        <div className="pl-4">
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Ders Programı
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Haftalık antrenman programın
          </p>
        </div>
      </div>

      {!hasAnySchedule ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Aktif gruba kayıtlı değilsiniz
          </p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Ders programı için grup kaydının yapılması gerekiyor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
          {DAYS_OF_WEEK.map((day) => {
            const sessions = schedulesByDay[day.value] || [];
            const isToday = day.value === todayDayOfWeek;

            return (
              <div
                key={day.value}
                className={`rounded-xl border bg-white dark:bg-slate-900 overflow-hidden flex flex-col ${
                  isToday
                    ? "border-primary shadow-md shadow-primary/10"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* Day Header */}
                <div
                  className={`px-3 py-2.5 text-center ${
                    isToday
                      ? "bg-primary text-white"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-widest">
                    {day.label}
                  </p>
                  {isToday && (
                    <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80 mt-0.5">
                      Bugün
                    </p>
                  )}
                </div>

                {/* Sessions */}
                <div className="flex-1 p-2 space-y-2">
                  {sessions.length > 0 ? (
                    sessions.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`rounded-lg p-2.5 ${
                          isToday
                            ? "bg-primary/10 dark:bg-primary/20 border border-primary/20"
                            : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <p
                          className={`text-xs font-black uppercase tracking-wide truncate ${
                            isToday
                              ? "text-primary dark:text-primary"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {schedule.groupName}
                        </p>
                        <div className="mt-1.5 space-y-1">
                          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="text-[11px] font-medium">
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                          </div>
                          {schedule.facilityName && (
                            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="text-[11px] truncate">
                                {schedule.facilityName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-[11px] text-slate-400 dark:text-slate-600 font-medium">
                      Antrenman yok
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
