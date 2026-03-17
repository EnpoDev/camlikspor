import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentAttendance } from "@/lib/actions/students-portal";
import { AttendanceStatusBadge } from "@/components/parent/AttendanceStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CheckCircle2, XCircle, Clock3, CalendarOff, BookOpen, BarChart3 } from "lucide-react";

export default async function StudentAttendancePage() {
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

  const { records, stats } = await getStudentAttendance(student.id, 50);

  const statCards = [
    {
      label: "Toplam Ders",
      value: stats.total,
      icon: BookOpen,
      color: "text-slate-700 dark:text-slate-200",
      bg: "bg-slate-100 dark:bg-slate-800",
    },
    {
      label: "Katildi",
      value: stats.present,
      icon: CheckCircle2,
      color: "text-green-700 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Devamsiz",
      value: stats.absent,
      icon: XCircle,
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950",
    },
    {
      label: "Gec Kaldi",
      value: stats.late,
      icon: Clock3,
      color: "text-yellow-700 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      label: "Katilim Orani",
      value: `${stats.attendanceRate}%`,
      icon: BarChart3,
      color: "text-primary dark:text-primary",
      bg: "bg-primary/10 dark:bg-primary/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-full" />
        <div className="pl-4">
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Yoklama Takibi
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Ders katilim durumun
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
            >
              <div className={`inline-flex rounded-lg p-2 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                {card.value}
              </p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Attendance Rate Bar */}
      {stats.total > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-black uppercase tracking-wide text-slate-700 dark:text-slate-300">
              Katilim Durumu
            </p>
            <p className="text-sm font-bold text-primary">{stats.attendanceRate}%</p>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${stats.attendanceRate}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              Katildi: {stats.present}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
              Gec: {stats.late}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              Devamsiz: {stats.absent}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              Izinli: {stats.excused}
            </span>
          </div>
        </div>
      )}

      {/* Attendance History Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white">
            Yoklama Gecmisi
          </h2>
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarOff className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <p className="font-medium text-slate-500 dark:text-slate-400">
              Henuz yoklama kaydi bulunmuyor
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Tarih
                </TableHead>
                <TableHead className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Ders / Grup
                </TableHead>
                <TableHead className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Durum
                </TableHead>
                <TableHead className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Notlar
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((attendance) => (
                <TableRow
                  key={attendance.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                    {format(new Date(attendance.session.date), "dd MMMM yyyy", {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    {attendance.session.group?.name || "-"}
                  </TableCell>
                  <TableCell>
                    <AttendanceStatusBadge
                      status={attendance.status as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                    {attendance.notes || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
