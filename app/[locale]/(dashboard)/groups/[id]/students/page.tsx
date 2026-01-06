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
import { ArrowLeft, Users, Eye, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface GroupStudentsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function GroupStudentsPage({
  params,
}: GroupStudentsPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      students: {
        where: { isActive: true },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
              parentPhone: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!group || (dealerId && group.dealerId !== dealerId)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/groups/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {group.name} - Ogrenciler
          </h1>
          <p className="text-muted-foreground">
            Bu gruptaki ogrencilerin listesi
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {group.students.length} Ogrenci
          </CardTitle>
        </CardHeader>
        <CardContent>
          {group.students.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Bu grupta ogrenci bulunmuyor
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Veli Telefon</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">Islemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.students.map((sg) => (
                  <TableRow key={sg.student.id}>
                    <TableCell className="font-medium">
                      {sg.student.firstName} {sg.student.lastName}
                    </TableCell>
                    <TableCell>
                      {sg.student.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {sg.student.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {sg.student.parentPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {sg.student.parentPhone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {sg.student.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {sg.student.email}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={sg.student.isActive ? "default" : "secondary"}
                      >
                        {sg.student.isActive
                          ? dictionary.common.active
                          : dictionary.common.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/${locale}/students/${sg.student.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
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
