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
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface StudentDevelopmentPageProps {
  params: Promise<{ locale: string }>;
}

const categoryLabels: Record<string, string> = {
  technical: "Teknik",
  physical: "Fiziksel",
  mental: "Zihinsel",
  tactical: "Taktik",
};

const metricLabels: Record<string, string> = {
  ball_control: "Top Kontrolü",
  passing: "Pas",
  shooting: "Şut",
  dribbling: "Dribling",
  speed: "Hız",
  endurance: "Dayanıklılık",
  strength: "Güç",
  agility: "Çeviklik",
  teamwork: "Takım Çalışması",
  concentration: "Konsantrasyon",
  motivation: "Motivasyon",
  discipline: "Disiplin",
  positioning: "Pozisyon Alma",
  vision: "Vizyon",
};

function getScoreBadge(score: number) {
  if (score >= 8) return <Badge variant="default">{score}/10</Badge>;
  if (score >= 6) return <Badge variant="secondary">{score}/10</Badge>;
  if (score >= 4) return <Badge variant="outline">{score}/10</Badge>;
  return <Badge variant="destructive">{score}/10</Badge>;
}

export default async function StudentDevelopmentPage({ params }: StudentDevelopmentPageProps) {
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

  const developments = await prisma.studentDevelopment.findMany({
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
          <h1 className="text-3xl font-bold tracking-tight">Öğrenci Gelişimi</h1>
          <p className="text-muted-foreground">
            Öğrenci gelişim kayıtlarını görüntüleyin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {developments.length} Gelişim Kaydı
          </CardTitle>
        </CardHeader>
        <CardContent>
          {developments.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Öğrenci</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Metrik</TableHead>
                  <TableHead>Puan</TableHead>
                  <TableHead>Notlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {developments.map((dev) => (
                  <TableRow key={dev.id}>
                    <TableCell className="font-medium">
                      {dev.student.firstName} {dev.student.lastName}
                    </TableCell>
                    <TableCell>
                      {new Date(dev.date).toLocaleDateString("tr-TR")}
                    </TableCell>
                    <TableCell>
                      {categoryLabels[dev.category] || dev.category}
                    </TableCell>
                    <TableCell>
                      {metricLabels[dev.metric] || dev.metric}
                    </TableCell>
                    <TableCell>{getScoreBadge(dev.score)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {dev.notes || "-"}
                    </TableCell>
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
