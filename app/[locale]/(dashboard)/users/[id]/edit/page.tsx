import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { getUserById } from "@/lib/data/users";
import { UserForm } from "@/components/forms/user-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface EditUserPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const isSuperAdmin = session?.user?.role === UserRole.SUPER_ADMIN;
  const dealerId = session?.user?.dealerId;

  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  if (!isSuperAdmin && user.dealerId !== dealerId) {
    notFound();
  }

  let dealers: { id: string; name: string }[] = [];

  if (isSuperAdmin) {
    dealers = await prisma.dealer.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } else if (dealerId) {
    // DEALER_ADMIN: own dealer + sub-dealers
    dealers = await prisma.dealer.findMany({
      where: {
        OR: [
          { id: dealerId },
          { parentDealerId: dealerId, isActive: true },
        ],
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/users`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.common.edit}: {user.name}
          </h1>
          <p className="text-muted-foreground">
            Kullanici bilgilerini guncelleyin
          </p>
        </div>
      </div>

      <UserForm
        user={user}
        dealers={dealers}
        locale={locale}
        dictionary={dictionary}
        isSuperAdmin={isSuperAdmin}
        currentDealerId={dealerId || undefined}
      />
    </div>
  );
}
