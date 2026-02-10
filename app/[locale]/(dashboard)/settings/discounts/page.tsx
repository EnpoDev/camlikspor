import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createDiscountTypeAction,
  updateDiscountTypeAction,
  deleteDiscountTypeAction,
} from "@/lib/actions/settings";

interface DiscountsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DiscountsPage({ params }: DiscountsPageProps) {
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

  const discountTypes = await prisma.discountType.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.discountTypes}
      subtitle="Indirim tiplerini yonetin"
      iconName="Percent"
      items={discountTypes}
      columns={[
        { key: "name", label: "Indirim Adi" },
        { key: "percentage", label: "Oran (%)", format: "percentage" },
      ]}
      dialogTitle="Indirim Tipi"
      dialogFields={[
        { name: "name", label: "Indirim Adi", type: "text", required: true },
        { name: "percentage", label: "Oran (%)", type: "number", min: 0, max: 100, required: true },
      ]}
      addButtonLabel="Indirim Tipi Ekle"
      createAction={createDiscountTypeAction}
      updateAction={updateDiscountTypeAction}
      deleteAction={deleteDiscountTypeAction}
      dictionary={dictionary}
    />
  );
}
