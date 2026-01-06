import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { UserRole } from "@/lib/types";
import { DealerForm } from "@/components/forms/dealer-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewDealerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewDealerPage({ params }: NewDealerPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (session?.user?.role !== UserRole.SUPER_ADMIN) {
    redirect(`/${locale}/dashboard`);
  }

  const dictionary = await getDictionary(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/dealers`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.dealers.addDealer}
          </h1>
          <p className="text-muted-foreground">
            Yeni bayi olusturun
          </p>
        </div>
      </div>

      <DealerForm locale={locale} dictionary={dictionary} />
    </div>
  );
}
