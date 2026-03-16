import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createOtherPaymentTypeAction,
  updateOtherPaymentTypeAction,
  deleteOtherPaymentTypeAction,
} from "@/lib/actions/other-payment-types";

interface OtherPaymentTypesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OtherPaymentTypesPage({ params }: OtherPaymentTypesPageProps) {
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

  const otherPaymentTypes = await prisma.otherPaymentType.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title="Diğer Ödeme Tipleri"
      subtitle="Diğer ödeme tiplerini yönetin"
      iconName="Package"
      items={otherPaymentTypes}
      columns={[
        { key: "name", label: "Ödeme Tipi Adı" },
      ]}
      dialogTitle="Ödeme Tipi"
      dialogFields={[
        { name: "name", label: "Ödeme Tipi Adı", type: "text", required: true },
      ]}
      addButtonLabel="Ödeme Tipi Ekle"
      createAction={createOtherPaymentTypeAction}
      updateAction={updateOtherPaymentTypeAction}
      deleteAction={deleteOtherPaymentTypeAction}
      dictionary={dictionary}
    />
  );
}
