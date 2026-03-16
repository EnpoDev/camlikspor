import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createEquipmentAction,
  updateEquipmentAction,
  deleteEquipmentAction,
} from "@/lib/actions/equipment";

interface EquipmentPageProps {
  params: Promise<{ locale: string }>;
}

export default async function EquipmentPage({ params }: EquipmentPageProps) {
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

  const equipment = await prisma.material.findMany({
    where: dealerId ? { dealerId, isActive: true } : { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title="Malzemeler"
      subtitle="Malzemeleri yönetin"
      iconName="Package"
      items={equipment}
      columns={[
        { key: "name", label: "Malzeme Adı" },
        { key: "description", label: "Açıklama" },
        { key: "price", label: "Fiyat", format: "currency" },
      ]}
      dialogTitle="Malzeme"
      dialogFields={[
        { name: "name", label: "Malzeme Adı", type: "text", required: true },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "price", label: "Fiyat", type: "number", required: true, defaultValue: "0" },
      ]}
      addButtonLabel="Malzeme Ekle"
      createAction={createEquipmentAction}
      updateAction={updateEquipmentAction}
      deleteAction={deleteEquipmentAction}
      dictionary={dictionary}
    />
  );
}
