import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { TrainerForm } from "@/components/forms/trainer-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewTrainerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewTrainerPage({ params }: NewTrainerPageProps) {
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

  const [branches, taskDefinitions] = await Promise.all([
    prisma.branch.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.taskDefinition.findMany({
      where: dealerId ? { dealerId, isActive: true } : { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/trainers`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.trainers.addTrainer}
          </h1>
          <p className="text-muted-foreground">
            Yeni antrenor kaydi olusturun
          </p>
        </div>
      </div>

      <TrainerForm
        branches={branches}
        taskDefinitions={taskDefinitions}
        locale={locale}
        dictionary={dictionary}
      />
    </div>
  );
}
