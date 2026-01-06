import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createSizeDefinitionAction,
  updateSizeDefinitionAction,
  deleteSizeDefinitionAction,
} from "@/lib/actions/settings";

interface SizesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SizesPage({ params }: SizesPageProps) {
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

  const sizeDefinitions = await prisma.sizeDefinition.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.sizeDefinitions}
      subtitle="Beden tanimlarini yonetin"
      iconName="Ruler"
      items={sizeDefinitions}
      columns={[
        { key: "name", label: "Beden Adi" },
        { key: "sizes", label: "Bedenler" },
      ]}
      dialogTitle="Beden Tanimi"
      dialogFields={[
        { name: "name", label: "Beden Adi", type: "text", required: true },
        { name: "sizes", label: "Bedenler (virgülle ayırın: XS,S,M,L,XL)", type: "text", required: true },
      ]}
      addButtonLabel="Beden Ekle"
      createAction={createSizeDefinitionAction}
      updateAction={updateSizeDefinitionAction}
      deleteAction={deleteSizeDefinitionAction}
      dictionary={dictionary}
    />
  );
}
