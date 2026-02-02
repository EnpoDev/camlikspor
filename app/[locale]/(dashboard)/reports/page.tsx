import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Gift,
  Package,
  Wallet,
} from "lucide-react";
import {
  getFinancialSummary,
  getStudentSummary,
  getAttendanceSummary,
  getPaymentCollectionRate,
  getMonthlyData,
  getTopGroupsByAttendance,
  getStudentsWithOverduePayments,
} from "@/lib/data/reports";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ReportsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const session = await auth();
  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const dealerId = session.user.dealerId;

  const [
    financialSummary,
    studentSummary,
    attendanceSummary,
    collectionRate,
    monthlyData,
    topGroups,
    overdueStudents,
  ] = await Promise.all([
    getFinancialSummary(dealerId),
    getStudentSummary(dealerId),
    getAttendanceSummary(dealerId),
    getPaymentCollectionRate(dealerId),
    getMonthlyData(dealerId, 6),
    getTopGroupsByAttendance(dealerId, 5),
    getStudentsWithOverduePayments(dealerId, 5),
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Report type shortcuts
  const reportTypes = [
    {
      title: dictionary.reports.general,
      icon: BarChart3,
      href: `/${locale}/reports/general`,
      color: "text-blue-500",
    },
    {
      title: dictionary.reports.attendance,
      icon: Calendar,
      href: `/${locale}/reports/attendance`,
      color: "text-green-500",
    },
    {
      title: dictionary.reports.studentsByPeriod,
      icon: Users,
      href: `/${locale}/reports/students`,
      color: "text-purple-500",
    },
    {
      title: dictionary.reports.materials,
      icon: Package,
      href: `/${locale}/reports/materials`,
      color: "text-orange-500",
    },
    {
      title: dictionary.reports.salaries,
      icon: Wallet,
      href: `/${locale}/reports/salaries`,
      color: "text-red-500",
    },
    {
      title: dictionary.reports.birthdays,
      icon: Gift,
      href: `/${locale}/reports/birthdays`,
      color: "text-pink-500",
    },
  ];

  type ReportType = (typeof reportTypes)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.reports.title}
        </h1>
        <p className="text-muted-foreground">Futbol okulu performans analizi</p>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialSummary.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gider</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(financialSummary.totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Gelir</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                financialSummary.netIncome >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(financialSummary.netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">Gelir - Gider</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Bekleyen Ödemeler
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(financialSummary.pendingPayments)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(financialSummary.overduePayments)} gecikmiş
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student & Attendance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Öğrenci Durumu
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentSummary.activeStudents}
            </div>
            <p className="text-xs text-muted-foreground mb-4">Aktif öğrenci</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />+{studentSummary.newThisMonth}{" "}
                bu ay
              </div>
              {studentSummary.withdrawnThisMonth > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <ArrowDownRight className="h-4 w-4" />-
                  {studentSummary.withdrawnThisMonth} ayrılan
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Devam Oranı</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              %{attendanceSummary.averageAttendance}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Ortalama katılım
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span>{attendanceSummary.totalSessions} oturum</span>
              <span className="text-green-600">
                {attendanceSummary.presentCount} katılım
              </span>
              <span className="text-red-600">
                {attendanceSummary.absentCount} devamsız
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Aylık Tahsilat
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%{collectionRate.rate}</div>
            <p className="text-xs text-muted-foreground mb-2">Tahsilat oranı</p>
            <Progress value={collectionRate.rate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(collectionRate.collected)} /{" "}
              {formatCurrency(collectionRate.total)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart & Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Aylık Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-16">{data.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex gap-2 h-4">
                      <div
                        className="bg-green-500 rounded"
                        style={{
                          width: `${Math.min(
                            (data.income /
                              Math.max(...monthlyData.map((d) => d.income), 1)) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                      <div
                        className="bg-red-400 rounded"
                        style={{
                          width: `${Math.min(
                            (data.expense /
                              Math.max(
                                ...monthlyData.map((d) => d.expense),
                                1
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-green-600">
                      {formatCurrency(data.income)}
                    </span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className="text-red-600">
                      {formatCurrency(data.expense)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Gelir</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded" />
                <span>Gider</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Groups */}
        <Card>
          <CardHeader>
            <CardTitle>En İyi Gruplar (Devam Oranı)</CardTitle>
          </CardHeader>
          <CardContent>
            {topGroups.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Henüz veri yok
              </p>
            ) : (
              <div className="space-y-4">
                {topGroups.map((group, index) => (
                  <div key={group.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {group.studentCount} öğrenci
                      </p>
                    </div>
                    <Badge
                      variant={
                        group.attendanceRate >= 80 ? "default" : "secondary"
                      }
                    >
                      %{group.attendanceRate}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Overdue Payments List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Gecikmiş Ödemeler
          </CardTitle>
          <Link href={`/${locale}/payments?status=overdue`}>
            <Button variant="outline" size="sm">
              Tümünü Gör
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {overdueStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Gecikmiş ödeme bulunmuyor
            </p>
          ) : (
            <div className="space-y-4">
              {overdueStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.parentName} - {student.parentPhone}
                    </p>
                    {student.oldestDueDate && (
                      <p className="text-xs text-red-500">
                        Son ödeme:{" "}
                        {format(new Date(student.oldestDueDate), "dd MMM yyyy", {
                          locale: tr,
                        })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      {formatCurrency(student.overdueAmount)}
                    </p>
                    <Link href={`/${locale}/students/${student.id}`}>
                      <Button variant="ghost" size="sm">
                        Detay
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Report Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Detaylı Raporlar</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {reportTypes.map((report: ReportType) => (
            <Link key={report.title} href={report.href}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <report.icon className={`h-8 w-8 ${report.color} mb-2`} />
                  <p className="text-sm font-medium text-center">
                    {report.title}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
