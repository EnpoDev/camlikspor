import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Dumbbell,
  UsersRound,
  Calculator,
  AlertCircle,
  Gift,
  UserPlus,
  Images,
  ArrowRight,
} from "lucide-react";
import { getDashboardStats, type DashboardStats } from "@/lib/data/dashboard";
import { format } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";
import { UserRole, Permission } from "@/lib/types";
import { hasPermission } from "@/lib/utils/permissions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

const dateLocales = {
  tr: tr,
  en: enUS,
  es: es,
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const dateLocale = dateLocales[locale];

  // Get real stats from database
  const dealerId = session?.user?.role === UserRole.SUPER_ADMIN
    ? null
    : session?.user?.dealerId;
  const stats = await getDashboardStats(dealerId);

  // Check permissions for quick actions
  const userPermissions = session?.user?.permissions || [];
  const canManageHeroSlides = hasPermission(userPermissions, Permission.HERO_SLIDES_VIEW);

  const statCards = [
    {
      title: dictionary.dashboard.totalStudents,
      value: stats.totalStudents.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/20",
    },
    {
      title: dictionary.dashboard.totalTrainers,
      value: stats.totalTrainers.toString(),
      icon: Dumbbell,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
    },
    {
      title: dictionary.dashboard.totalGroups,
      value: stats.totalGroups.toString(),
      icon: UsersRound,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800",
    },
    {
      title: dictionary.dashboard.monthlyIncome,
      value: `${stats.monthlyIncome.toLocaleString(locale)} TL`,
      icon: Calculator,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.dashboard.welcome}, {session?.user?.name}!
        </h1>
        <p className="text-muted-foreground">{dictionary.dashboard.title}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat: typeof statCards[number]) => (
          <Card key={stat.title} className={stat.bgColor}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-900 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Images className="h-5 w-5 text-blue-600" />
            Ana Sayfa Slider Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Ana sayfadaki slider görsellerini ve metinlerini düzenleyin
          </p>
          <Link href={`/${locale}/hero-slides`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Düzenle
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Alert for pending payments */}
      {stats.pendingPayments > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <span className="text-sm">
              {stats.pendingPayments} {dictionary.dashboard.pendingPayments}
            </span>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {dictionary.dashboard.todayAttendance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.todayAttendance.total > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{dictionary.attendance.present}</span>
                  <Badge variant="default" aria-label={`${dictionary.attendance.present}: ${stats.todayAttendance.present}`}>
                    <span aria-hidden="true">{stats.todayAttendance.present}</span>
                    <span className="sr-only">{stats.todayAttendance.present} {dictionary.attendance.present}</span>
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{dictionary.attendance.absent}</span>
                  <Badge variant="destructive" aria-label={`${dictionary.attendance.absent}: ${stats.todayAttendance.absent}`}>
                    <span aria-hidden="true">{stats.todayAttendance.absent}</span>
                    <span className="sr-only">{stats.todayAttendance.absent} {dictionary.attendance.absent}</span>
                  </Badge>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">{dictionary.common.total}</span>
                  <span className="font-medium">{stats.todayAttendance.total}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{dictionary.common.noData}</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Birthdays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-pink-500" />
              {dictionary.dashboard.upcomingBirthdays}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.upcomingBirthdays.length > 0 ? (
              <div className="space-y-2">
                {stats.upcomingBirthdays.map((student: DashboardStats["upcomingBirthdays"][number]) => (
                  <div key={student.id} className="flex justify-between text-sm">
                    <span>{student.name}</span>
                    <span className="text-muted-foreground">
                      {format(student.birthDate, "d MMM", { locale: dateLocale })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{dictionary.common.noData}</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Pre-registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              {dictionary.dashboard.recentPreRegistrations}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentPreRegistrations.length > 0 ? (
              <div className="space-y-2">
                {stats.recentPreRegistrations.map((reg: DashboardStats["recentPreRegistrations"][number]) => (
                  <div key={reg.id} className="flex justify-between text-sm">
                    <span>{reg.studentName}</span>
                    <span className="text-muted-foreground">
                      {format(reg.createdAt, "d MMM", { locale: dateLocale })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{dictionary.common.noData}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
