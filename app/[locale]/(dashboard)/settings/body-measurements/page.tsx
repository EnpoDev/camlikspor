import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ruler } from "lucide-react";

interface BodyMeasurementsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BodyMeasurementsPage({ params }: BodyMeasurementsPageProps) {
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

  const measurements = await prisma.bodyMeasurement.findMany({
    where: dealerId
      ? {
          student: {
            dealerId,
            isActive: true,
          },
        }
      : {},
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { date: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beden Ölçüleri</h1>
          <p className="text-muted-foreground">
            Öğrenci beden ölçülerini görüntüleyin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            {measurements.length} Ölçüm Kaydı
          </CardTitle>
        </CardHeader>
        <CardContent>
          {measurements.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Öğrenci</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Boy (cm)</TableHead>
                  <TableHead>Kilo (kg)</TableHead>
                  <TableHead>Göğüs (cm)</TableHead>
                  <TableHead>Bel (cm)</TableHead>
                  <TableHead>Kol (cm)</TableHead>
                  <TableHead>Bacak (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements.map((measurement) => (
                  <TableRow key={measurement.id}>
                    <TableCell className="font-medium">
                      {measurement.student.firstName} {measurement.student.lastName}
                    </TableCell>
                    <TableCell>
                      {new Date(measurement.date).toLocaleDateString("tr-TR")}
                    </TableCell>
                    <TableCell>{measurement.height || "-"}</TableCell>
                    <TableCell>{measurement.weight || "-"}</TableCell>
                    <TableCell>{measurement.chestSize || "-"}</TableCell>
                    <TableCell>{measurement.waistSize || "-"}</TableCell>
                    <TableCell>{measurement.armSize || "-"}</TableCell>
                    <TableCell>{measurement.legSize || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
