import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { getPreRegistrationById } from "@/lib/data/pre-registration";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConvertToStudentForm } from "@/components/forms/convert-to-student-form";

interface ConvertPreRegistrationPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ConvertPreRegistrationPage({
  params,
}: ConvertPreRegistrationPageProps) {
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

  const preRegistration = await getPreRegistrationById(id);

  if (!preRegistration || (dealerId && preRegistration.dealerId !== dealerId)) {
    notFound();
  }

  if (preRegistration.status === "CONVERTED") {
    redirect(`/${locale}/pre-registration/${id}`);
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
        <Link href={`/${locale}/pre-registration/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ogrenciye Donustur
          </h1>
          <p className="text-muted-foreground">
            {preRegistration.firstName} {preRegistration.lastName} onkaydini
            ogrenci kaydina donusturun
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Onkayit Bilgileri
          </CardTitle>
          <CardDescription>
            Asagidaki bilgiler onkayittan alinacaktir
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Ad Soyad</p>
            <p className="font-medium">
              {preRegistration.firstName} {preRegistration.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Veli Adi</p>
            <p className="font-medium">{preRegistration.parentName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Veli Telefon</p>
            <p className="font-medium">{preRegistration.parentPhone}</p>
          </div>
          {preRegistration.parentEmail && (
            <div>
              <p className="text-sm text-muted-foreground">Veli E-posta</p>
              <p className="font-medium">{preRegistration.parentEmail}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ConvertToStudentForm
        preRegistration={preRegistration}
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
