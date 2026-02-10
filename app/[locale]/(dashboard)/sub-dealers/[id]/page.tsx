import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { getSubDealerById } from "@/lib/data/sub-dealers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Building2,
  Mail,
  Phone,
  MapPin,
  Package,
  ShoppingCart,
  Users,
  Globe,
  Plus,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";

interface SubDealerDetailPageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

const dateLocales = { tr: tr, en: enUS, es: es };

export default async function SubDealerDetailPage({
  params,
}: SubDealerDetailPageProps) {
  const { locale, id } = await params;
  const session = await auth();

  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  if (session.user.isSubDealer) {
    redirect(`/${locale}/dashboard`);
  }

  const dict = await getDictionary(locale);
  const dateLocale = dateLocales[locale];

  const subDealer = await getSubDealerById(id, session.user.dealerId);

  if (!subDealer) {
    notFound();
  }

  // Fetch users assigned to this sub-dealer
  const subDealerUsers = await prisma.user.findMany({
    where: { dealerId: id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    DEALER_ADMIN: "Bayi Admin",
    TRAINER: "Antrenor",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/sub-dealers`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {subDealer.name}
            </h1>
            <p className="text-muted-foreground font-mono">{subDealer.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={subDealer.isActive ? "default" : "secondary"}>
            {subDealer.isActive
              ? dict.common?.active || "Aktif"
              : dict.common?.inactive || "Pasif"}
          </Badge>
          <Link href={`/${locale}/sub-dealers/${id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {dict.common?.edit || "Duzenle"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {dict.subDealers?.totalProducts || "Toplam Urun"}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subDealer._count.products}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {dict.subDealers?.totalOrders || "Toplam Siparis"}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subDealer._count.orders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {dict.subDealers?.totalSubDealers || "Alt Bayiler"}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subDealer._count.subDealers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {dict.users?.title || "Kullanicilar"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subDealer._count.users}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {dict.subDealers?.formTitle || "Bayi Bilgileri"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subDealer.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{subDealer.email}</span>
              </div>
            )}
            {subDealer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{subDealer.phone}</span>
              </div>
            )}
            {subDealer.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{subDealer.address}</span>
              </div>
            )}
            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{dict.common?.date || "Tarih"}</p>
                <p className="font-medium">
                  {format(subDealer.createdAt, "d MMMM yyyy", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hiyerarsi</p>
                <p className="font-medium">Seviye {subDealer.hierarchyLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {dict.subDealers?.domain || "Domain"} & {dict.settings?.title || "Ayarlar"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {dict.subDealers?.customDomain || "Ozel Domain"}
                </p>
                <p className="font-medium">
                  {subDealer.customDomain || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {dict.subDealers?.subdomain || "Subdomain"}
                </p>
                <p className="font-medium">
                  {subDealer.subdomain || "-"}
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={subDealer.inheritParentProducts ? "default" : "secondary"}>
                  {dict.subDealers?.inheritProducts || "Urun Kalitimi"}:{" "}
                  {subDealer.inheritParentProducts
                    ? dict.common?.active || "Aktif"
                    : dict.common?.inactive || "Pasif"}
                </Badge>
                <Badge variant={subDealer.canCreateOwnProducts ? "default" : "secondary"}>
                  {dict.subDealers?.canCreateProducts || "Urun Olusturabilir"}:{" "}
                  {subDealer.canCreateOwnProducts
                    ? dict.common?.yes || "Evet"
                    : dict.common?.no || "Hayir"}
                </Badge>
              </div>
            </div>
            {subDealer.parentDealer && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Ust Bayi
                </p>
                <p className="font-medium">{subDealer.parentDealer.name}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Users Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {dict.users?.title || "Kullanicilar"} ({subDealerUsers.length})
          </CardTitle>
          <Link href={`/${locale}/users/new?dealerId=${id}`}>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              {dict.users?.addUser || "Kullanici Ekle"}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {subDealerUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>Bu alt bayiye henuz kullanici atanmamis.</p>
              <Link href={`/${locale}/users/new?dealerId=${id}`}>
                <Button variant="outline" size="sm" className="mt-3">
                  <Plus className="mr-2 h-4 w-4" />
                  Ilk kullaniciyi ekle
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dict.users?.name || "Ad Soyad"}</TableHead>
                  <TableHead>{dict.users?.email || "E-posta"}</TableHead>
                  <TableHead>{dict.users?.role || "Rol"}</TableHead>
                  <TableHead>{dict.common?.status || "Durum"}</TableHead>
                  <TableHead className="text-right">{dict.common?.actions || "Islemler"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subDealerUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {roleLabels[user.role] || user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive
                          ? dict.common?.active || "Aktif"
                          : dict.common?.inactive || "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/${locale}/users/${user.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          {dict.common?.edit || "Duzenle"}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
