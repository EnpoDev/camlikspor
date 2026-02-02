import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { getSmsBalanceAction, getSmsHistory, getSmsStats } from "@/lib/actions/sms";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface SmsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SmsPage({ params }: SmsPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const [balanceResult, historyResult, stats] = await Promise.all([
    getSmsBalanceAction(),
    getSmsHistory(1, 10),
    getSmsStats(),
  ]);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SENT: "bg-green-100 text-green-800",
    DELIVERED: "bg-blue-100 text-blue-800",
    FAILED: "bg-red-100 text-red-800",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Clock className="h-4 w-4" />,
    SENT: <CheckCircle className="h-4 w-4" />,
    DELIVERED: <CheckCircle className="h-4 w-4" />,
    FAILED: <XCircle className="h-4 w-4" />,
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Bekliyor",
    SENT: "Gönderildi",
    DELIVERED: "İletildi",
    FAILED: "Başarısız",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.sms.title}
          </h1>
          <p className="text-muted-foreground">Netgsm SMS Yönetimi</p>
        </div>
        <Link href={`/${locale}/sms/send`}>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            {dictionary.sms.send}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {dictionary.sms.balance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceResult.success ? balanceResult.balance : "-"} SMS
            </div>
            <p className="text-sm text-muted-foreground">
              {balanceResult.success ? "Kalan bakiye" : balanceResult.message}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Gönderilen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
            <p className="text-sm text-muted-foreground">SMS gönderildi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Başarısız</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-sm text-muted-foreground">SMS gönderilemedi</p>
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
          {historyResult.messages.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <div className="space-y-4">
              {historyResult.messages.map((sms) => (
                <div
                  key={sms.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium line-clamp-2">{sms.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{sms.recipientCount} alıcı</span>
                      <span>
                        {formatDistanceToNow(new Date(sms.createdAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge className={statusColors[sms.status]}>
                    <span className="flex items-center gap-1">
                      {statusIcons[sms.status]}
                      {statusLabels[sms.status]}
                    </span>
                  </Badge>
                </div>
              ))}
              {historyResult.total > 10 && (
                <div className="text-center pt-4">
                  <Link href={`/${locale}/sms/history`}>
                    <Button variant="outline" size="sm">
                      Tümünü Gör ({historyResult.total} mesaj)
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
