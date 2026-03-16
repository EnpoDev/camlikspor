import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Permission } from "@/lib/types";
import { hasPermission } from "@/lib/utils/permissions";
import { SponsorForm } from "../components/sponsor-form";

interface NewSponsorPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewSponsorPage({ params }: NewSponsorPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  if (!hasPermission(session.user.permissions || [], Permission.SPONSORS_CREATE)) {
    redirect(`/${locale}/sponsors`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Sponsor Ekle</h1>
        <p className="text-muted-foreground">
          Kulübünüze yeni bir sponsor ekleyin
        </p>
      </div>

      <div className="max-w-2xl">
        <SponsorForm locale={locale} />
      </div>
    </div>
  );
}
