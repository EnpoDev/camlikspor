import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { getPreRegistrationById } from "@/lib/data/pre-registration";
import { PreRegistrationForm } from "@/components/forms/pre-registration-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface EditPreRegistrationPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditPreRegistrationPage({
  params,
}: EditPreRegistrationPageProps) {
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

  const preRegistration = await getPreRegistrationById(id);

  if (!preRegistration || (dealerId && preRegistration.dealerId !== dealerId)) {
    notFound();
  }

  const branches = await prisma.branch.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/pre-registration/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.common.edit}: {preRegistration.firstName}{" "}
            {preRegistration.lastName}
          </h1>
          <p className="text-muted-foreground">
            Onkayit bilgilerini guncelleyin
          </p>
        </div>
      </div>

      <PreRegistrationForm
        preRegistration={preRegistration}
        branches={branches}
        locale={locale}
        dictionary={dictionary}
      />
    </div>
  );
}
