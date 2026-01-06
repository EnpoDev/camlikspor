import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AttendanceForm } from "./attendance-form";

interface NewAttendancePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ groupId?: string }>;
}

export default async function NewAttendancePage({
  params,
  searchParams,
}: NewAttendancePageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;
  const { groupId } = await searchParams;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  // Get groups
  const groups = await prisma.group.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Get trainers
  const trainers = await prisma.trainer.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    select: { id: true, firstName: true, lastName: true },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  // If groupId is provided, get students for that group
  let initialStudents: { id: string; firstName: string; lastName: string; photoUrl: string | null }[] = [];
  if (groupId) {
    initialStudents = await prisma.student.findMany({
      where: {
        isActive: true,
        groups: {
          some: { groupId },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/attendance`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.attendance.takeAttendance}
          </h1>
          <p className="text-muted-foreground">
            Grup secin ve yoklama alin
          </p>
        </div>
      </div>

      <AttendanceForm
        groups={groups}
        trainers={trainers}
        initialGroupId={groupId}
        initialStudents={initialStudents}
        locale={locale}
        dictionary={dictionary}
      />
    </div>
  );
}
