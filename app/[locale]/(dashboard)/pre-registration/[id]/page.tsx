import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { UserRole } from "@/lib/types";
import { getPreRegistrationById } from "@/lib/data/pre-registration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  User,
  Users,
  Calendar,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";

interface PreRegistrationDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

const dateLocales = { tr: tr, en: enUS, es: es };

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Beklemede", variant: "secondary" },
  CONTACTED: { label: "Iletisime Gecildi", variant: "outline" },
  CONVERTED: { label: "Donusturuldu", variant: "default" },
  CANCELLED: { label: "Iptal", variant: "destructive" },
};

export default async function PreRegistrationDetailPage({
  params,
}: PreRegistrationDetailPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const dateLocale = dateLocales[locale];

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  const preRegistration = await getPreRegistrationById(id);

  if (!preRegistration || (dealerId && preRegistration.dealerId !== dealerId)) {
    notFound();
  }

  const statusInfo = statusLabels[preRegistration.status] || {
    label: preRegistration.status,
    variant: "secondary" as const,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/pre-registration`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {preRegistration.firstName} {preRegistration.lastName}
            </h1>
            <p className="text-muted-foreground">Onkayit Detaylari</p>
          </div>
        </div>
        <div className="flex gap-2">
          {preRegistration.status !== "CONVERTED" && (
            <Link href={`/${locale}/pre-registration/${id}/convert`}>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Ogrenciye Donustur
              </Button>
            </Link>
          )}
          <Link href={`/${locale}/pre-registration/${id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {dictionary.common.edit}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Ogrenci Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ad Soyad</p>
                <p className="font-medium">
                  {preRegistration.firstName} {preRegistration.lastName}
                </p>
              </div>
              {preRegistration.birthDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Dogum Tarihi</p>
                  <p className="font-medium">
                    {format(preRegistration.birthDate, "d MMMM yyyy", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              )}
              {preRegistration.gender && (
                <div>
                  <p className="text-sm text-muted-foreground">Cinsiyet</p>
                  <p className="font-medium">
                    {preRegistration.gender === "MALE" ? "Erkek" : "Kadin"}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Durum</p>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kayit Tarihi</p>
                <p className="font-medium">
                  {format(preRegistration.createdAt, "d MMMM yyyy HH:mm", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>
            {preRegistration.branchInterest && (
              <div>
                <p className="text-sm text-muted-foreground">Ilgilendigi Brans</p>
                <p className="font-medium">{preRegistration.branchInterest}</p>
              </div>
            )}
            {preRegistration.source && (
              <div>
                <p className="text-sm text-muted-foreground">Kaynak</p>
                <p className="font-medium">{preRegistration.source}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Veli Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Veli Adi</p>
              <p className="font-medium">{preRegistration.parentName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{preRegistration.parentPhone}</span>
            </div>
            {preRegistration.parentEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{preRegistration.parentEmail}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {preRegistration.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notlar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{preRegistration.notes}</p>
          </CardContent>
        </Card>
      )}

      {preRegistration.convertedToStudentId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Donusum Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Donusturuldu</p>
                <p className="font-medium">
                  {preRegistration.convertedAt
                    ? format(preRegistration.convertedAt, "d MMMM yyyy HH:mm", {
                        locale: dateLocale,
                      })
                    : "-"}
                </p>
              </div>
            </div>
            <Link href={`/${locale}/students/${preRegistration.convertedToStudentId}`}>
              <Button variant="outline">Ogrenci Kaydini Goruntule</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
