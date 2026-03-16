import { i18n, type Locale } from "@/lib/i18n/config";
import { getPublicDealer } from "@/lib/utils/get-public-dealer";
import { notFound } from "next/navigation";
import { PaymentInquiryForm } from "./payment-inquiry-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Search } from "lucide-react";

interface PaymentInquiryPageProps {
  params: Promise<{ locale: string; dealerSlug: string }>;
}

export async function generateMetadata() {
  const dealer = await getPublicDealer();

  if (!dealer) {
    return { title: "Sayfa Bulunamadı" };
  }

  return {
    title: `Aidat Sorgulama - ${dealer.name}`,
    description: `${dealer.name} - Aidat ve ödeme sorgulama sayfası`,
  };
}

export default async function PaymentInquiryPage({
  params,
}: PaymentInquiryPageProps) {
  const { locale: localeParam, dealerSlug } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  const dealer = await getPublicDealer();

  if (!dealer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-full">
              <CreditCard className="h-8 w-8 text-primary dark:text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-slate-900 dark:text-white">
            Aidat Sorgulama
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            TC Kimlik Numaranız veya Telefon Numaranız ile aidat bilgilerinizi sorgulayabilirsiniz
          </p>
        </div>

        {/* Search Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Ödeme Bilgisi Sorgula
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <PaymentInquiryForm dealerId={dealer.id} locale={locale} />
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Nasıl Sorgularım?
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                TC Kimlik Numaranızı veya kayıtlı telefon numaranızı yukarıdaki alana girerek ödeme bilgilerinizi görebilirsiniz.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-900">
            <CardContent className="p-6">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                📞 Yardım
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Sorularınız için bizimle iletişime geçebilirsiniz: <br />
                {dealer.contactPhone && <strong>{dealer.contactPhone}</strong>}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
