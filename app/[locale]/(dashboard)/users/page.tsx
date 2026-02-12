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
import { Plus, Mail } from "lucide-react";
import Link from "next/link";
import { UserActionsDropdown } from "@/components/users/user-actions-dropdown";

interface UsersPageProps {
  params: Promise<{ locale: string }>;
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  DEALER_ADMIN: "Bayi Admin",
  TRAINER: "Antrenor",
};

export default async function UsersPage({ params }: UsersPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  const dealerId = session?.user?.dealerId || undefined;
  const isSuperAdmin = session?.user?.role === UserRole.SUPER_ADMIN;

  let users: Awaited<ReturnType<typeof prisma.user.findMany<{ include: { dealer: { select: { name: true } } }; orderBy: { createdAt: "desc" } }>>>;
  if (isSuperAdmin) {
    users = await prisma.user.findMany({
      include: {
        dealer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (dealerId) {
    // DEALER_ADMIN: show users from own dealer + sub-dealers
    const subDealerIds = await prisma.dealer.findMany({
      where: { parentDealerId: dealerId },
      select: { id: true },
    });
    const allDealerIds = [dealerId, ...subDealerIds.map((d) => d.id)];
    users = await prisma.user.findMany({
      where: { dealerId: { in: allDealerIds } },
      include: {
        dealer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    users = [];
  }

  type User = (typeof users)[number];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.users.title}
          </h1>
          <p className="text-muted-foreground">{dictionary.users.userList}</p>
        </div>
        <Link href={`/${locale}/users/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.users.addUser}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {users.length} {dictionary.common.entries}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.users.name}</TableHead>
                  <TableHead>{dictionary.users.email}</TableHead>
                  <TableHead>{dictionary.users.role}</TableHead>
                  <TableHead>{dictionary.sidebar?.dealers || "Bayi"}</TableHead>
                  <TableHead>{dictionary.common.status}</TableHead>
                  <TableHead className="text-right">{dictionary.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User) => (
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
                    <TableCell>{user.dealer?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive
                          ? dictionary.common.active
                          : dictionary.common.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActionsDropdown
                        userId={user.id}
                        userName={user.name}
                        locale={locale}
                        currentUserId={session?.user?.id || ""}
                        dictionary={{
                          view: dictionary.common.view,
                          edit: dictionary.common.edit,
                          delete: dictionary.common.delete,
                        }}
                      />
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
