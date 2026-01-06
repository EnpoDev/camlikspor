import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getPreRegistrations, type PreRegistrationListItem } from "@/lib/data/pre-registration";
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
import { Plus, Phone, Mail, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PreRegistrationStatusBadge } from "./components/status-badge";
import { PreRegistrationActions } from "./components/actions";

interface PreRegistrationPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}

const dateLocales = {
  tr: tr,
  en: enUS,
  es: es,
};

export default async function PreRegistrationPage({
  params,
  searchParams,
}: PreRegistrationPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;
  const { page = "1", status = "ALL", search = "" } = await searchParams;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const dateLocale = dateLocales[locale];

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  const { data: preRegistrations, total } = await getPreRegistrations(
    { dealerId, status, search },
    parseInt(page),
    10
  );

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.preRegistration.title}
          </h1>
          <p className="text-muted-foreground">
            {dictionary.preRegistration.list}
          </p>
        </div>
        <Link href={`/${locale}/pre-registration/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.preRegistration.addNew}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {dictionary.common.showing} {preRegistrations.length} {dictionary.common.of} {total}{" "}
            {dictionary.common.entries}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {preRegistrations.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.students.fullName}</TableHead>
                  <TableHead>{dictionary.students.parentName}</TableHead>
                  <TableHead>{dictionary.students.parentPhone}</TableHead>
                  <TableHead>{dictionary.students.branch}</TableHead>
                  <TableHead>{dictionary.common.status}</TableHead>
                  <TableHead>{dictionary.students.registrationDate}</TableHead>
                  <TableHead className="text-right">
                    {dictionary.common.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preRegistrations.map((reg: PreRegistrationListItem) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">
                      {reg.firstName} {reg.lastName}
                    </TableCell>
                    <TableCell>{reg.parentName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {reg.parentPhone}
                      </div>
                    </TableCell>
                    <TableCell>{reg.branchInterest || "-"}</TableCell>
                    <TableCell>
                      <PreRegistrationStatusBadge
                        status={reg.status}
                        dictionary={dictionary}
                      />
                    </TableCell>
                    <TableCell>
                      {format(reg.createdAt, "d MMM yyyy", { locale: dateLocale })}
                    </TableCell>
                    <TableCell className="text-right">
                      <PreRegistrationActions
                        id={reg.id}
                        locale={locale}
                        dictionary={dictionary}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/${locale}/pre-registration?page=${p}&status=${status}&search=${search}`}
            >
              <Button variant={p === parseInt(page) ? "default" : "outline"} size="sm">
                {p}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
