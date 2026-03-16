import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Permission } from "@/lib/types";
import { hasPermission } from "@/lib/utils/permissions";
import { prisma } from "@/lib/prisma";
import { SponsorForm } from "../../components/sponsor-form";

interface EditSponsorPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditSponsorPage({ params }: EditSponsorPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  if (!hasPermission(session.user.permissions || [], Permission.SPONSORS_EDIT)) {
    redirect(`/${locale}/sponsors`);
  }

  const sponsor = await prisma.sponsor.findUnique({
    where: { id },
  });

  if (!sponsor || sponsor.dealerId !== session.user.dealerId) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sponsor Düzenle</h1>
        <p className="text-muted-foreground">
          {sponsor.name} sponsorunu düzenleyin
        </p>
      </div>

      <div className="max-w-2xl">
        <SponsorForm locale={locale} sponsor={sponsor} />
      </div>
    </div>
  );
}
