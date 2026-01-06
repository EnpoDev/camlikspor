import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { UserRole } from "@/lib/types";
import { getStudentById } from "@/lib/data/students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  CreditCard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, differenceInYears } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";

interface StudentDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

const dateLocales = { tr: tr, en: enUS, es: es };

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
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

  const student = await getStudentById(id);

  if (!student || (dealerId && student.dealerId !== dealerId)) {
    notFound();
  }

  type StudentGroup = (typeof student.groups)[number];
  type Payment = (typeof student.payments)[number];

  const age = differenceInYears(new Date(), student.birthDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/students`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-muted-foreground">
              Ogrenci No: {student.studentNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/students/${id}/edit`}>
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
              Kisisel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ad Soyad</p>
                <p className="font-medium">
                  {student.firstName} {student.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Yas</p>
                <p className="font-medium">{age} yas</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dogum Tarihi</p>
                <p className="font-medium">
                  {format(student.birthDate, "d MMMM yyyy", { locale: dateLocale })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cinsiyet</p>
                <p className="font-medium">
                  {student.gender === "MALE" ? "Erkek" : "Kadin"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Durum</p>
                <Badge variant={student.isActive ? "default" : "secondary"}>
                  {student.isActive
                    ? dictionary.common.active
                    : dictionary.common.inactive}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kayit Tarihi</p>
                <p className="font-medium">
                  {format(student.registrationDate, "d MMMM yyyy", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>
            {student.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
            )}
            {student.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
            )}
            {student.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{student.address}</span>
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
              <p className="font-medium">{student.parentName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{student.parentPhone}</span>
            </div>
            {student.parentEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.parentEmail}</span>
              </div>
            )}
            {student.emergencyContact && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Acil Durum Iletisim
                </p>
                <p className="font-medium">{student.emergencyContact}</p>
                {student.emergencyPhone && (
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{student.emergencyPhone}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Egitim Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Brans</p>
                <p className="font-medium">{student.branch.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sube</p>
                <p className="font-medium">{student.location.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tesis</p>
                <p className="font-medium">{student.facility.name}</p>
              </div>
            </div>
            {student.groups.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Gruplar</p>
                <div className="flex flex-wrap gap-2">
                  {student.groups.map((sg: StudentGroup) => (
                    <Badge key={sg.id} variant="outline">
                      {sg.group.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Ucret Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Aylik Aidat</p>
                <p className="font-medium">
                  {student.monthlyFee.toLocaleString("tr-TR")} TL
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kayit Ucreti</p>
                <p className="font-medium">
                  {student.registrationFee.toLocaleString("tr-TR")} TL
                </p>
              </div>
              {student.discountType && (
                <div>
                  <p className="text-sm text-muted-foreground">Indirim</p>
                  <Badge variant="secondary">
                    {student.discountType.name} (%{student.discountType.percentage})
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {student.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Son Odemeler</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Tur</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.payments.map((payment: Payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(payment.dueDate, "d MMM yyyy", { locale: dateLocale })}
                    </TableCell>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell>
                      {payment.amount.toLocaleString("tr-TR")} TL
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "COMPLETED"
                            ? "default"
                            : payment.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {payment.status === "COMPLETED"
                          ? "Odendi"
                          : payment.status === "PENDING"
                          ? "Bekliyor"
                          : "Basarisiz"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {student.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notlar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{student.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
