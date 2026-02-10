import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { getGroupById } from "@/lib/data/groups";
import { GroupForm } from "@/components/forms/group-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface EditGroupPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditGroupPage({ params }: EditGroupPageProps) {
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

  const group = await getGroupById(id);

  if (!group || (dealerId && group.dealerId !== dealerId)) {
    notFound();
  }

  const [branches, facilities, periods, trainers] = await Promise.all([
    prisma.branch.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.facility.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.period.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, name: true },
      orderBy: { startDate: "desc" },
    }),
    prisma.trainer.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: "asc" },
    }),
  ]);

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
            {dictionary.common.edit}: {group.name}
          </h1>
          <p className="text-muted-foreground">
            Grup bilgilerini guncelleyin
          </p>
        </div>
      </div>

      <GroupForm
        group={group}
        branches={branches}
        facilities={facilities}
        periods={periods}
        trainers={trainers}
        locale={locale}
        dictionary={dictionary}
      />
    </div>
  );
}
