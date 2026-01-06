import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { getStudentById } from "@/lib/data/students";
import { StudentForm } from "@/components/forms/student-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface EditStudentPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  const student = await getStudentById(id);

  if (!student || (dealerId && student.dealerId !== dealerId)) {
    notFound();
  }

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
        <Link href={`/${locale}/students/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.common.edit}: {student.firstName} {student.lastName}
          </h1>
          <p className="text-muted-foreground">
            Ogrenci bilgilerini guncelleyin
          </p>
        </div>
      </div>

      <StudentForm
        student={student}
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
