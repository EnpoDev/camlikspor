import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createExpenseItemAction,
  updateExpenseItemAction,
  deleteExpenseItemAction,
} from "@/lib/actions/settings";

interface ExpenseItemsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ExpenseItemsPage({ params }: ExpenseItemsPageProps) {
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

  const expenseItems = await prisma.expenseItem.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.expenseItems}
      subtitle="Gider kalemlerini yonetin"
      iconName="TrendingDown"
      items={expenseItems}
      columns={[
        { key: "name", label: "Gider Kalemi Adi" },
      ]}
      dialogTitle="Gider Kalemi"
      dialogFields={[
        { name: "name", label: "Gider Kalemi Adi", type: "text", required: true },
      ]}
      addButtonLabel="Gider Kalemi Ekle"
      createAction={createExpenseItemAction}
      updateAction={updateExpenseItemAction}
      deleteAction={deleteExpenseItemAction}
      dictionary={dictionary}
    />
  );
}
