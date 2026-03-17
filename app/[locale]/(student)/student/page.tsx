import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  CreditCard,
  CheckCircle,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";

const DAY_NAMES = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const DAY_NAMES_FULL = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

function getUpcomingSchedules(
  schedules: { dayOfWeek: number; startTime: string; endTime: string; groupName?: string }[],
  limit = 3
) {
  const today = new Date();
  const todayDay = today.getDay();

  const upcoming: {
    dayOfWeek: number;
    dayName: string;
    startTime: string;
    endTime: string;
    groupName?: string;
    daysFromNow: number;
  }[] = [];

  for (let offset = 0; offset <= 7; offset++) {
    const checkDay = (todayDay + offset) % 7;
    const matchingSchedules = schedules.filter((s) => s.dayOfWeek === checkDay);
    for (const s of matchingSchedules) {
      if (offset === 0) {
        const [hours, minutes] = s.startTime.split(":").map(Number);
        const scheduleTime = new Date();
        scheduleTime.setHours(hours, minutes, 0, 0);
        if (scheduleTime <= today) continue;
      }
      upcoming.push({
        ...s,
        dayName: DAY_NAMES_FULL[checkDay],
        daysFromNow: offset,
      });
    }
    if (upcoming.length >= limit) break;
  }

  return upcoming.slice(0, limit);
}

export default async function StudentDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user || session.user.role !== "STUDENT") {
    redirect(`/${locale}/student-login`);
  }

  const student = await prisma.student.findFirst({
    where: { email: session.user.email, isActive: true },
    include: {
      branch: true,
      location: true,
      facility: true,
      groups: {
        where: { group: { isActive: true } },
        include: {
          group: {
            include: { schedules: true },
          },
        },
      },
    },
  });

  if (!student) {
    redirect(`/${locale}/student-login`);
  }

  const firstName = student.firstName;
  const activeGroups = student.groups.filter((sg) => sg.isActive);

  const allSchedules = activeGroups.flatMap((sg) =>
    sg.group.schedules.map((s) => ({
      ...s,
      groupName: sg.group.name,
    }))
  );

  const weeklyTrainingCount = new Set(allSchedules.map((s) => s.dayOfWeek)).size;
  const upcomingSchedules = getUpcomingSchedules(allSchedules);

  // Attendance this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyAttendance = await prisma.attendance.count({
    where: {
      studentId: student.id,
      createdAt: { gte: startOfMonth },
      status: "PRESENT",
    },
  });

  // Payment status
  const pendingPayment = await prisma.payment.findFirst({
    where: {
      studentId: student.id,
      status: "PENDING",
    },
    orderBy: { dueDate: "asc" },
  });

  const paymentStatus = pendingPayment ? "Bekliyor" : "Güncel";
  const paymentStatusColor = pendingPayment ? "text-yellow-400" : "text-green-400";

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wide text-white">
              Hoş Geldin, {firstName}!
            </h1>
            <p className="text-slate-400 mt-1">
              {student.branch?.name} &bull; {student.location?.name}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5">
          <Shield className="w-full h-full text-white" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Aktif Grup
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeGroups.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Haftalık Antrenman
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {weeklyTrainingCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Bu Ay Yoklama
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {monthlyAttendance}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Ödeme Durumu
                </p>
                <p className={`text-xl font-black ${paymentStatusColor}`}>
                  {paymentStatus}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Trainings */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-wide text-slate-900 dark:text-white mb-4">
          Yaklaşan Antrenmanlar
        </h2>
        {upcomingSchedules.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {upcomingSchedules.map((schedule, index) => (
              <Card
                key={index}
                className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {schedule.groupName || "Antrenman"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {schedule.dayName}
                        {schedule.daysFromNow === 0
                          ? " (Bugün)"
                          : schedule.daysFromNow === 1
                          ? " (Yarın)"
                          : ""}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Yaklaşan antrenman bulunamadı
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-wide text-slate-900 dark:text-white mb-4">
          Hızlı Erişim
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href={`/${locale}/student/student/schedule`}>
            <Card className="cursor-pointer border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-primary/30 transition-all group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Programımı Gör
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Antrenman takvimini incele
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/${locale}/student/student/attendance`}>
            <Card className="cursor-pointer border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-green-500/30 transition-all group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Yoklama Geçmişi
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Katılım durumunu görüntüle
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/${locale}/student/student/development`}>
            <Card className="cursor-pointer border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-500/30 transition-all group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Gelişim Raporu
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Performans analizini gör
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
