import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createLocationAction,
  updateLocationAction,
  deleteLocationAction,
} from "@/lib/actions/settings";

interface LocationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocationsPage({ params }: LocationsPageProps) {
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

  const locations = await prisma.location.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.locations}
      subtitle="Subeleri yonetin"
      iconName="MapPin"
      items={locations}
      columns={[
        { key: "name", label: "Sube Adi" },
        { key: "address", label: "Adres" },
      ]}
      dialogTitle="Sube"
      dialogFields={[
        { name: "name", label: "Sube Adi", type: "text", required: true },
        { name: "address", label: "Adres", type: "textarea" },
      ]}
      addButtonLabel="Sube Ekle"
      createAction={createLocationAction}
      updateAction={updateLocationAction}
      deleteAction={deleteLocationAction}
      dictionary={dictionary}
    />
  );
}
