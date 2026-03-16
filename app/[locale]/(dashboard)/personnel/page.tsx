import { auth } from "@/lib/auth";
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
import { Plus, Phone, Mail, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePersonnelAction } from "@/lib/actions/personnel";
import { PersonnelDeleteButton } from "@/components/personnel/personnel-delete-button";

interface PersonnelPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PersonnelPage({ params }: PersonnelPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  const personnel = await prisma.personnel.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    include: {
      personnelType: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { firstName: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personel Yönetimi</h1>
          <p className="text-muted-foreground">
            Personel kayıtlarını yönetin
          </p>
        </div>
        <Link href={`/${locale}/personnel/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Personel Ekle
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {personnel.length} Personel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {personnel.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Maaş</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personnel.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">
                      {person.firstName} {person.lastName}
                    </TableCell>
                    <TableCell>{person.personnelType.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {person.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      {person.salary
                        ? new Intl.NumberFormat('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                          }).format(person.salary)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={person.isActive ? "default" : "secondary"}>
                        {person.isActive ? dictionary.common.active : dictionary.common.inactive}
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
                            <Link href={`/${locale}/personnel/${person.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Görüntüle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/${locale}/personnel/${person.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Düzenle
                            </Link>
                          </DropdownMenuItem>
                          <PersonnelDeleteButton
                            personnelId={person.id}
                            personnelName={`${person.firstName} ${person.lastName}`}
                          />
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
