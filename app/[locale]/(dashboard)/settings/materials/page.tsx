import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createMaterialAction,
  updateMaterialAction,
  deleteMaterialAction,
} from "@/lib/actions/settings";

interface MaterialsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MaterialsPage({ params }: MaterialsPageProps) {
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

  const materials = await prisma.material.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.materials}
      subtitle="Malzemeleri yonetin"
      iconName="Package"
      items={materials}
      columns={[
        { key: "name", label: "Malzeme Adi" },
      ]}
      dialogTitle="Malzeme"
      dialogFields={[
        { name: "name", label: "Malzeme Adi", type: "text", required: true },
      ]}
      addButtonLabel="Malzeme Ekle"
      createAction={createMaterialAction}
      updateAction={updateMaterialAction}
      deleteAction={deleteMaterialAction}
      dictionary={dictionary}
    />
  );
}
