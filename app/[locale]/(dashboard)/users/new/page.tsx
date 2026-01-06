import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { UserForm } from "@/components/forms/user-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewUserPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewUserPage({ params }: NewUserPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const isSuperAdmin = session?.user?.role === UserRole.SUPER_ADMIN;

  const dealers = isSuperAdmin
    ? await prisma.dealer.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    : [];

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
            {dictionary.users.addUser}
          </h1>
          <p className="text-muted-foreground">
            Yeni kullanici hesabi olusturun
          </p>
        </div>
      </div>

      <UserForm
        dealers={dealers}
        locale={locale}
        dictionary={dictionary}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}
