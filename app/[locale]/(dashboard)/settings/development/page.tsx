import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createDevelopmentTypeAction,
  updateDevelopmentTypeAction,
  deleteDevelopmentTypeAction,
} from "@/lib/actions/settings";

interface DevelopmentPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DevelopmentPage({ params }: DevelopmentPageProps) {
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

  const developmentTypes = await prisma.developmentType.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.studentDevelopment}
      subtitle="Ogrenci gelisim turlerini yonetin"
      iconName="TrendingUp"
      items={developmentTypes}
      columns={[
        { key: "name", label: "Gelisim Turu Adi" },
        { key: "description", label: "Aciklama" },
      ]}
      dialogTitle="Gelisim Turu"
      dialogFields={[
        { name: "name", label: "Gelisim Turu Adi", type: "text", required: true },
        { name: "description", label: "Aciklama", type: "textarea" },
      ]}
      addButtonLabel="Gelisim Turu Ekle"
      createAction={createDevelopmentTypeAction}
      updateAction={updateDevelopmentTypeAction}
      deleteAction={deleteDevelopmentTypeAction}
      dictionary={dictionary}
    />
  );
}
