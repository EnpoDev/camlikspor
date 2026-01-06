import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Phone, Mail, Building2, MoreHorizontal, Eye, Edit } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DealersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DealersPage({ params }: DealersPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  // Only SuperAdmin can access this page
  if (session?.user?.role !== UserRole.SUPER_ADMIN) {
    redirect(`/${locale}/dashboard`);
  }

  const dictionary = await getDictionary(locale);

  const dealers = await prisma.dealer.findMany({
    include: {
      _count: {
        select: {
          users: true,
          students: { where: { isActive: true } },
          trainers: { where: { isActive: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.dealers.title}
          </h1>
          <p className="text-muted-foreground">{dictionary.dealers.dealerList}</p>
        </div>
        <Link href={`/${locale}/dealers/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.dealers.addDealer}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Bayi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktif Bayi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dealers.filter((d) => d.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ogrenci</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dealers.reduce((sum, d) => sum + d._count.students, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {dealers.length} {dictionary.common.entries}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dealers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.dealers.name}</TableHead>
                  <TableHead>{dictionary.dealers.slug}</TableHead>
                  <TableHead>{dictionary.dealers.phone}</TableHead>
                  <TableHead>Ogrenci</TableHead>
                  <TableHead>Antrenor</TableHead>
                  <TableHead>Kullanici</TableHead>
                  <TableHead>{dictionary.common.status}</TableHead>
                  <TableHead className="text-right">{dictionary.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dealers.map((dealer) => (
                  <TableRow key={dealer.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dealer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {dealer.slug}
                    </TableCell>
                    <TableCell>
                      {dealer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {dealer.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{dealer._count.students}</TableCell>
                    <TableCell>{dealer._count.trainers}</TableCell>
                    <TableCell>{dealer._count.users}</TableCell>
                    <TableCell>
                      <Badge variant={dealer.isActive ? "default" : "secondary"}>
                        {dealer.isActive
                          ? dictionary.common.active
                          : dictionary.common.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/${locale}/dealers/${dealer.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Goruntule
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/${locale}/dealers/${dealer.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              {dictionary.common.edit}
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
