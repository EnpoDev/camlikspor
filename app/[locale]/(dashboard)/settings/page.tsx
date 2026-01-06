import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Calendar,
  GitBranch,
  MapPin,
  Building2,
  Package,
  TrendingUp,
  Users,
  Receipt,
  CreditCard,
  Briefcase,
  Ruler,
  Percent,
  DollarSign,
  Key,
} from "lucide-react";

interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const settingsItems = [
    {
      title: dictionary.settings.periods,
      icon: Calendar,
      href: `/${locale}/settings/periods`,
      color: "text-blue-500",
    },
    {
      title: dictionary.settings.branches,
      icon: GitBranch,
      href: `/${locale}/settings/branches`,
      color: "text-green-500",
    },
    {
      title: dictionary.settings.locations,
      icon: MapPin,
      href: `/${locale}/settings/locations`,
      color: "text-purple-500",
    },
    {
      title: dictionary.settings.facilities,
      icon: Building2,
      href: `/${locale}/settings/facilities`,
      color: "text-orange-500",
    },
    {
      title: dictionary.settings.materials,
      icon: Package,
      href: `/${locale}/settings/materials`,
      color: "text-cyan-500",
    },
    {
      title: dictionary.settings.studentDevelopment,
      icon: TrendingUp,
      href: `/${locale}/settings/development`,
      color: "text-emerald-500",
    },
    {
      title: dictionary.settings.personnel,
      icon: Users,
      href: `/${locale}/settings/personnel`,
      color: "text-indigo-500",
    },
    {
      title: dictionary.settings.expenseItems,
      icon: Receipt,
      href: `/${locale}/settings/expense-items`,
      color: "text-red-500",
    },
    {
      title: dictionary.settings.incomeItems,
      icon: CreditCard,
      href: `/${locale}/settings/income-items`,
      color: "text-green-600",
    },
    {
      title: dictionary.settings.taskDefinitions,
      icon: Briefcase,
      href: `/${locale}/settings/tasks`,
      color: "text-amber-500",
    },
    {
      title: dictionary.settings.sizeDefinitions,
      icon: Ruler,
      href: `/${locale}/settings/sizes`,
      color: "text-pink-500",
    },
    {
      title: dictionary.settings.discountTypes,
      icon: Percent,
      href: `/${locale}/settings/discounts`,
      color: "text-violet-500",
    },
    {
      title: dictionary.settings.duesTypes,
      icon: DollarSign,
      href: `/${locale}/settings/dues`,
      color: "text-teal-500",
    },
    {
      title: dictionary.settings.changePassword,
      icon: Key,
      href: `/${locale}/settings/password`,
      color: "text-gray-500",
    },
  ];

  type SettingsItem = (typeof settingsItems)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.settings.title}
        </h1>
        <p className="text-muted-foreground">Sistem ayarlarini yonetin</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {settingsItems.map((item: SettingsItem) => (
          <Link key={item.title} href={item.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-base">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  {item.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
