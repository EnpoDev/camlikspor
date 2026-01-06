import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createIncomeItemAction,
  updateIncomeItemAction,
  deleteIncomeItemAction,
} from "@/lib/actions/settings";

interface IncomeItemsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function IncomeItemsPage({ params }: IncomeItemsPageProps) {
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

  const incomeItems = await prisma.incomeItem.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.incomeItems}
      subtitle="Gelir kalemlerini yonetin"
      iconName="TrendingUp"
      items={incomeItems}
      columns={[
        { key: "name", label: "Gelir Kalemi Adi" },
      ]}
      dialogTitle="Gelir Kalemi"
      dialogFields={[
        { name: "name", label: "Gelir Kalemi Adi", type: "text", required: true },
      ]}
      addButtonLabel="Gelir Kalemi Ekle"
      createAction={createIncomeItemAction}
      updateAction={updateIncomeItemAction}
      deleteAction={deleteIncomeItemAction}
      dictionary={dictionary}
    />
  );
}
