import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { StudentForm } from "@/components/forms/student-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewStudentPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewStudentPage({ params }: NewStudentPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  const [branches, locations, facilities, discountTypes] = await Promise.all([
    prisma.branch.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.location.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.facility.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.discountType.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, name: true, percentage: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/students`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.students.addStudent}
          </h1>
          <p className="text-muted-foreground">
            Yeni ogrenci kaydi olusturun
          </p>
        </div>
      </div>

      <StudentForm
        branches={branches}
        locations={locations}
        facilities={facilities}
        discountTypes={discountTypes}
        locale={locale}
        dictionary={dictionary}
      />
    </div>
  );
}
