import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";

interface AttendancePageProps {
  params: Promise<{ locale: string }>;
}

const dateLocales = { tr: tr, en: enUS, es: es };

export default async function AttendancePage({ params }: AttendancePageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const dateLocale = dateLocales[locale];

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const sessions = await prisma.attendanceSession.findMany({
    where: dealerId ? { group: { dealerId } } : {},
    include: {
      group: { select: { name: true } },
      trainer: { select: { firstName: true, lastName: true } },
      _count: { select: { attendances: true } },
    },
    orderBy: { date: "desc" },
    take: 20,
  });

  const groups = await prisma.group.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.attendance.title}
          </h1>
          <p className="text-muted-foreground">
            {dictionary.attendance.attendanceList}
          </p>
        </div>
        <Link href={`/${locale}/attendance/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.attendance.takeAttendance}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.slice(0, 6).map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/${locale}/attendance/new?groupId=${group.id}`}>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dictionary.attendance.takeAttendance}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Son Yoklamalar</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{session.group.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.trainer.firstName} {session.trainer.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {format(session.date, "d MMMM yyyy", { locale: dateLocale })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session._count.attendances} ogrenci
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
