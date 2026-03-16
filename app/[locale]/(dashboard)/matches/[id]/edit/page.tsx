import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Permission } from "@/lib/types";
import { hasPermission } from "@/lib/utils/permissions";
import { prisma } from "@/lib/prisma";
import { MatchForm } from "../../components/match-form";

interface EditMatchPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditMatchPage({ params }: EditMatchPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  if (!hasPermission(session.user.permissions || [], Permission.MATCHES_EDIT)) {
    redirect(`/${locale}/matches`);
  }

  const match = await prisma.match.findUnique({
    where: { id },
  });

  if (!match || match.dealerId !== session.user.dealerId) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Maç Düzenle</h1>
        <p className="text-muted-foreground">
          {match.homeTeam} - {match.awayTeam} maçını düzenleyin
        </p>
      </div>

      <div className="max-w-3xl">
        <MatchForm locale={locale} match={match} />
      </div>
    </div>
  );
}
