import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart3,
  Users,
  Calendar,
  Gift,
  Package,
  Wallet,
} from "lucide-react";

interface ReportsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.reports.title}
        </h1>
        <p className="text-muted-foreground">Rapor turunuzu secin</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Link key={report.title} href={report.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <report.icon className={`h-6 w-6 ${report.color}`} />
                  {report.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
