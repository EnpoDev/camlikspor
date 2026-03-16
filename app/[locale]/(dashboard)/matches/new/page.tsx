import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Permission } from "@/lib/types";
import { hasPermission } from "@/lib/utils/permissions";
import { MatchForm } from "../components/match-form";

interface NewMatchPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewMatchPage({ params }: NewMatchPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  if (!hasPermission(session.user.permissions || [], Permission.MATCHES_CREATE)) {
    redirect(`/${locale}/matches`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Maç Ekle</h1>
        <p className="text-muted-foreground">
          Fikstüre yeni bir maç ekleyin
        </p>
      </div>

      <div className="max-w-3xl">
        <MatchForm locale={locale} />
      </div>
    </div>
  );
}
