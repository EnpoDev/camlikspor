import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Calendar, TrendingUp } from "lucide-react";
import { getTrainingStats } from "@/lib/data/training";
import Link from "next/link";

interface TrainingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TrainingPage({ params }: TrainingPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId = session?.user?.dealerId;
  if (!dealerId) return null;

  const stats = await getTrainingStats(dealerId);

  const cards = [
    {
      title: dictionary.training.overview.totalPlans,
      value: stats.totalPlans,
      icon: BookOpen,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
      href: `/${locale}/training/plans`,
    },
    {
      title: dictionary.training.overview.activePlans,
      value: stats.activePlans,
      icon: TrendingUp,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/50",
      href: `/${locale}/training/plans`,
    },
    {
      title: dictionary.training.overview.totalSessions,
      value: stats.totalSessions,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      href: `/${locale}/training/calendar`,
    },
    {
      title: dictionary.training.overview.tacticalBoards,
      value: stats.totalBoards,
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      href: `/${locale}/training/tactical-board`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.training.overview.title}
        </h1>
        <p className="text-muted-foreground">{dictionary.training.title}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className={`hover:shadow-md transition-shadow ${card.bgColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
