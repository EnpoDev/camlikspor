import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import Link from "next/link";

interface SmsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SmsPage({ params }: SmsPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.sms.title}
          </h1>
          <p className="text-muted-foreground">Netgsm SMS Yonetimi</p>
        </div>
        <Link href={`/${locale}/sms/send`}>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            {dictionary.sms.send}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {dictionary.sms.balance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 SMS</div>
            <p className="text-sm text-muted-foreground">Kalan bakiye</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Gonderilen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">SMS gonderildi</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {dictionary.sms.history}
          </CardTitle>
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
