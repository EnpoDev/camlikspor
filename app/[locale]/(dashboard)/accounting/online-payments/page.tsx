import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OnlinePaymentsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OnlinePaymentsPage({ params }: OnlinePaymentsPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.accounting.onlinePayments.title}
        </h1>
        <p className="text-muted-foreground">PayTR ile yapilan odemeler</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Online Odeme Gecmisi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            {dictionary.common.noData}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
