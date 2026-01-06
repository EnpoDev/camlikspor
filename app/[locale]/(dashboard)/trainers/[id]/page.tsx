import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { UserRole } from "@/lib/types";
import { getTrainerById } from "@/lib/data/trainers";
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
  User,
  Briefcase,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, differenceInYears } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";

interface TrainerDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

const dateLocales = { tr: tr, en: enUS, es: es };

export default async function TrainerDetailPage({
  params,
}: TrainerDetailPageProps) {
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

  const trainer = await getTrainerById(id);

  if (!trainer || (dealerId && trainer.dealerId !== dealerId)) {
    notFound();
  }

  type TrainerBranch = (typeof trainer.branches)[number];
  type TrainerGroup = (typeof trainer.groups)[number];
  type SalaryPayment = (typeof trainer.salaryPayments)[number];

  const age = trainer.birthDate
    ? differenceInYears(new Date(), trainer.birthDate)
    : null;

  const salaryTypeLabels: Record<string, string> = {
    fixed: "Sabit",
    per_hour: "Saat Basina",
    per_session: "Seans Basina",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/trainers`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {trainer.firstName} {trainer.lastName}
            </h1>
            <p className="text-muted-foreground">Antrenor Detaylari</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/trainers/${id}/edit`}>
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
                  {trainer.firstName} {trainer.lastName}
                </p>
              </div>
              {age && (
                <div>
                  <p className="text-sm text-muted-foreground">Yas</p>
                  <p className="font-medium">{age} yas</p>
                </div>
              )}
              {trainer.birthDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Dogum Tarihi</p>
                  <p className="font-medium">
                    {format(trainer.birthDate, "d MMMM yyyy", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              )}
              {trainer.gender && (
                <div>
                  <p className="text-sm text-muted-foreground">Cinsiyet</p>
                  <p className="font-medium">
                    {trainer.gender === "MALE" ? "Erkek" : "Kadin"}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Durum</p>
                <Badge variant={trainer.isActive ? "default" : "secondary"}>
                  {trainer.isActive
                    ? dictionary.common.active
                    : dictionary.common.inactive}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ise Baslama</p>
                <p className="font-medium">
                  {format(trainer.hireDate, "d MMMM yyyy", { locale: dateLocale })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{trainer.phone}</span>
            </div>
            {trainer.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{trainer.email}</span>
              </div>
            )}
            {trainer.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{trainer.address}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Gorev ve Brans Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainer.branches.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Branslar</p>
                <div className="flex flex-wrap gap-2">
                  {trainer.branches.map((tb: TrainerBranch) => (
                    <Badge key={tb.branch.id} variant="outline">
                      {tb.branch.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {trainer.groups.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Gruplar</p>
                <div className="flex flex-wrap gap-2">
                  {trainer.groups.map((tg: TrainerGroup) => (
                    <Badge key={tg.group.id} variant="secondary">
                      {tg.group.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {trainer.user && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Kullanici Hesabi</p>
                <p className="font-medium">{trainer.user.email}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Maas Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Maas</p>
                <p className="font-medium">
                  {trainer.salary.toLocaleString("tr-TR")} TL
                </p>
              </div>
              {trainer.salaryType && (
                <div>
                  <p className="text-sm text-muted-foreground">Maas Tipi</p>
                  <p className="font-medium">
                    {salaryTypeLabels[trainer.salaryType] || trainer.salaryType}
                  </p>
                </div>
              )}
            </div>
            {trainer.bankName && (
              <div>
                <p className="text-sm text-muted-foreground">Banka</p>
                <p className="font-medium">{trainer.bankName}</p>
              </div>
            )}
            {trainer.bankAccount && (
              <div>
                <p className="text-sm text-muted-foreground">IBAN</p>
                <p className="font-mono text-sm">{trainer.bankAccount}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {trainer.salaryPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Maas Gecmisi</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ay</TableHead>
                  <TableHead>Yil</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Odeme Tarihi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainer.salaryPayments.map((payment: SalaryPayment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell>{payment.year}</TableCell>
                    <TableCell>
                      {payment.amount.toLocaleString("tr-TR")} TL
                    </TableCell>
                    <TableCell>
                      {payment.paidAt
                        ? format(payment.paidAt, "d MMM yyyy", {
                            locale: dateLocale,
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {trainer.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notlar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{trainer.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
