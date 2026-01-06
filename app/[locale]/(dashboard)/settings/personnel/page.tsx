import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createPersonnelTypeAction,
  updatePersonnelTypeAction,
  deletePersonnelTypeAction,
} from "@/lib/actions/settings";

interface PersonnelPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PersonnelPage({ params }: PersonnelPageProps) {
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

  const personnelTypes = await prisma.personnelType.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.personnel}
      subtitle="Personel turlerini yonetin"
      iconName="Users"
      items={personnelTypes}
      columns={[
        { key: "name", label: "Personel Turu Adi" },
        { key: "description", label: "Aciklama" },
      ]}
      dialogTitle="Personel Turu"
      dialogFields={[
        { name: "name", label: "Personel Turu Adi", type: "text", required: true },
        { name: "description", label: "Aciklama", type: "textarea" },
      ]}
      addButtonLabel="Personel Turu Ekle"
      createAction={createPersonnelTypeAction}
      updateAction={updatePersonnelTypeAction}
      deleteAction={deletePersonnelTypeAction}
      dictionary={dictionary}
    />
  );
}
