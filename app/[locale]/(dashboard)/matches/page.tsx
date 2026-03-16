import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Permission } from "@/lib/types";
import { hasPermission } from "@/lib/utils/permissions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllMatchesByDealer } from "@/lib/actions/matches";
import { MatchesList } from "./components/matches-list";

interface MatchesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MatchesPage({ params }: MatchesPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  const userPermissions = session.user.permissions || [];
  if (!hasPermission(userPermissions, Permission.MATCHES_VIEW)) {
    redirect(`/${locale}/dashboard`);
  }

  const canCreate = hasPermission(userPermissions, Permission.MATCHES_CREATE);

  const matches = await getAllMatchesByDealer(session.user.dealerId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maç Yönetimi</h1>
          <p className="text-muted-foreground">
            Kulübünüzün maçlarını yönetin ve görünürlüklerini ayarlayın
          </p>
        </div>
        {canCreate && (
          <Link href={`/${locale}/matches/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Maç Ekle
            </Button>
          </Link>
        )}
      </div>

      <MatchesList matches={matches} locale={locale} canEdit={hasPermission(userPermissions, Permission.MATCHES_EDIT)} canDelete={hasPermission(userPermissions, Permission.MATCHES_DELETE)} />
    </div>
  );
}
