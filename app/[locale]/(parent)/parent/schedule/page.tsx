import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getParentStudents } from "@/lib/actions/parents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentSelector } from "@/components/parent/StudentSelector";
import { Users, Calendar } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 1, label: "Pazartesi" },
  { value: 2, label: "Salı" },
  { value: 3, label: "Çarşamba" },
  { value: 4, label: "Perşembe" },
  { value: 5, label: "Cuma" },
  { value: 6, label: "Cumartesi" },
  { value: 0, label: "Pazar" },
];

export default async function ParentSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/parent-login");

  const students = await getParentStudents(session.user.id);
  if (students.length === 0) {
    return <div>Kayıtlı öğrenci bulunamadı</div>;
  }

  const params = await searchParams;
  const selectedStudentId = params.studentId || students[0].id;
  const student = students.find((s) => s.id === selectedStudentId);

  // Extract schedules from active student groups
  const activeGroups = student?.groups.filter((sg) => sg.isActive) || [];
  const allSchedules = activeGroups.flatMap((sg) =>
    (sg.group.schedules || []).map(schedule => ({
      ...schedule,
      groupName: sg.group.name,
    }))
  );

  // Group schedules by day of week
  const schedulesByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day.value] = allSchedules.filter((s) => s.dayOfWeek === day.value);
    return acc;
  }, {} as Record<number, typeof allSchedules>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ders Programı</h1>
        <p className="text-muted-foreground">Haftalık antrenman programı</p>
      </div>

      <StudentSelector students={students} selectedId={selectedStudentId} />

      {/* Active Groups Info */}
      {activeGroups.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {activeGroups.map((sg) => (
            <Card key={sg.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{sg.group.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{sg.group.period?.name || "Dönem belirtilmemiş"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{sg.group.schedules?.length || 0} ders saati</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Weekly Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Haftalık Ders Programı</CardTitle>
          <CardDescription>
            Çocuğunuzun antrenman programı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.value} className="space-y-2">
                <div className="font-semibold text-center p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  {day.label}
                </div>
                <div className="space-y-2">
                  {schedulesByDay[day.value]?.length > 0 ? (
                    schedulesByDay[day.value].map((schedule) => (
                      <Card key={schedule.id} className="p-3 bg-slate-50 dark:bg-slate-900">
                        <div className="text-sm font-medium">
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {schedule.groupName}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground p-3">
                      Ders yok
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
