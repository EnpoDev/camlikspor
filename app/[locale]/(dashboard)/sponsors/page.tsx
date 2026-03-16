import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Permission } from "@/lib/types";
import { hasPermission } from "@/lib/utils/permissions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllSponsorsByDealer } from "@/lib/actions/sponsors";
import { SponsorsList } from "./components/sponsors-list";

interface SponsorsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SponsorsPage({ params }: SponsorsPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  const userPermissions = session.user.permissions || [];
  if (!hasPermission(userPermissions, Permission.SPONSORS_VIEW)) {
    redirect(`/${locale}/dashboard`);
  }

  const canCreate = hasPermission(userPermissions, Permission.SPONSORS_CREATE);

  const sponsors = await getAllSponsorsByDealer(session.user.dealerId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sponsor Yönetimi</h1>
          <p className="text-muted-foreground">
            Kulübünüzün sponsorlarını yönetin ve sıralamalarını düzenleyin
          </p>
        </div>
        {canCreate && (
          <Link href={`/${locale}/sponsors/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Sponsor Ekle
            </Button>
          </Link>
        )}
      </div>

      <SponsorsList sponsors={sponsors} locale={locale} canEdit={hasPermission(userPermissions, Permission.SPONSORS_EDIT)} canDelete={hasPermission(userPermissions, Permission.SPONSORS_DELETE)} />
    </div>
  );
}
