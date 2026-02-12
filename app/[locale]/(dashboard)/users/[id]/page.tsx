import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Mail, User, Shield, Building2, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";

interface UserDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

const dateLocales = { tr: tr, en: enUS, es: es };

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  DEALER_ADMIN: "Bayi Admin",
  TRAINER: "Antrenor",
};

export default async function UserDetailPage({
  params,
}: UserDetailPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const dateLocale = dateLocales[locale];

  const isSuperAdmin = session?.user?.role === UserRole.SUPER_ADMIN;
  const dealerId = isSuperAdmin
    ? undefined
    : session?.user?.dealerId || undefined;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      dealer: { select: { name: true, slug: true } },
      permissions: true,
    },
  });

  if (!user) {
    notFound();
  }

  // DEALER_ADMIN: allow access to own dealer + sub-dealer users
  if (!isSuperAdmin && dealerId) {
    const subDealerIds = await prisma.dealer.findMany({
      where: { parentDealerId: dealerId },
      select: { id: true },
    });
    const allowedDealerIds = [dealerId, ...subDealerIds.map((d) => d.id)];
    if (!user.dealerId || !allowedDealerIds.includes(user.dealerId)) {
      notFound();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/users`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={user.isActive ? "default" : "secondary"}>
            {user.isActive
              ? dictionary.common.active
              : dictionary.common.inactive}
          </Badge>
          <Link href={`/${locale}/users/${id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {dictionary.common.edit}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {dictionary.users?.name || "Kullanici Bilgileri"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {dictionary.users?.name || "Ad"}
                </p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {dictionary.users?.role || "Yetki"}
                </p>
                <Badge variant="outline">
                  {roleLabels[user.role] || user.role}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{dictionary.common.date}</p>
                <p className="font-medium">
                  {format(user.createdAt, "d MMMM yyyy", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
              {user.lastLoginAt && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Son Giris
                  </p>
                  <p className="font-medium">
                    {format(user.lastLoginAt, "d MMM yyyy HH:mm", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dealer & Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {dictionary.users?.permissions || "Izinler"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.dealer && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Bayi</p>
                  <p className="font-medium">{user.dealer.name}</p>
                </div>
              </div>
            )}
            {user.permissions.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {dictionary.users?.permissions || "Izinler"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {user.permissions.map((perm) => (
                    <Badge key={perm.id} variant="outline" className="text-xs">
                      {perm.permission}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {user.permissions.length === 0 && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Varsayilan rol izinleri kullaniliyor ({roleLabels[user.role] || user.role})
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
