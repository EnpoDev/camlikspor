import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
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
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { GroupActions } from "./group-actions";

interface GroupsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GroupsPage({ params }: GroupsPageProps) {
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

  const groups = await prisma.group.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    include: {
      branch: { select: { name: true } },
      facility: { select: { name: true } },
      period: { select: { name: true } },
      _count: { select: { students: { where: { isActive: true } } } },
    },
    orderBy: { name: "asc" },
  });

  type Group = (typeof groups)[number];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.groups.title}
          </h1>
          <p className="text-muted-foreground">{dictionary.groups.groupList}</p>
        </div>
        <Link href={`/${locale}/groups/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.groups.addGroup}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {groups.length} {dictionary.common.entries}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.groups.name}</TableHead>
                  <TableHead>{dictionary.groups.branch}</TableHead>
                  <TableHead>{dictionary.groups.facility}</TableHead>
                  <TableHead>{dictionary.groups.period}</TableHead>
                  <TableHead>{dictionary.groups.studentCount}</TableHead>
                  <TableHead>{dictionary.common.status}</TableHead>
                  <TableHead className="text-right">{dictionary.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group: Group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.branch.name}</TableCell>
                    <TableCell>{group.facility.name}</TableCell>
                    <TableCell>{group.period?.name || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {group._count.students} / {group.maxCapacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={group.isActive ? "default" : "secondary"}>
                        {group.isActive
                          ? dictionary.common.active
                          : dictionary.common.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <GroupActions
                        groupId={group.id}
                        groupName={group.name}
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
    </div>
  );
}
