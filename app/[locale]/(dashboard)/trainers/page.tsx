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
import { Plus, Phone, MoreHorizontal, Eye, Edit } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TrainersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TrainersPage({ params }: TrainersPageProps) {
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

  const trainers = await prisma.trainer.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    include: {
      branches: { include: { branch: { select: { name: true } } } },
    },
    orderBy: { firstName: "asc" },
  });

  type Trainer = (typeof trainers)[number];
  type TrainerBranch = Trainer["branches"][number];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.trainers.title}
          </h1>
          <p className="text-muted-foreground">
            {dictionary.trainers.trainerList}
          </p>
        </div>
        <Link href={`/${locale}/trainers/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {dictionary.trainers.addTrainer}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {trainers.length} {dictionary.common.entries}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trainers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.trainers.firstName}</TableHead>
                  <TableHead>{dictionary.trainers.lastName}</TableHead>
                  <TableHead>{dictionary.trainers.phone}</TableHead>
                  <TableHead>{dictionary.trainers.branch}</TableHead>
                  <TableHead>{dictionary.common.status}</TableHead>
                  <TableHead className="text-right">{dictionary.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((trainer: Trainer) => (
                  <TableRow key={trainer.id}>
                    <TableCell className="font-medium">
                      {trainer.firstName}
                    </TableCell>
                    <TableCell>{trainer.lastName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {trainer.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      {trainer.branches.map((b: TrainerBranch) => b.branch.name).join(", ") ||
                        "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={trainer.isActive ? "default" : "secondary"}
                      >
                        {trainer.isActive
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
                            <Link href={`/${locale}/trainers/${trainer.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Goruntule
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/${locale}/trainers/${trainer.id}/edit`}>
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
