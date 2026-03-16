import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createDuesTypeAction,
  updateDuesTypeAction,
  deleteDuesTypeAction,
} from "@/lib/actions/dues-types";

interface DuesTypesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DuesTypesPage({ params }: DuesTypesPageProps) {
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

  const duesTypes = await prisma.duesType.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title="Aidat Tipleri"
      subtitle="Aidat tiplerini yönetin"
      iconName="Banknote"
      items={duesTypes}
      columns={[
        { key: "name", label: "Aidat Tipi Adı" },
      ]}
      dialogTitle="Aidat Tipi"
      dialogFields={[
        { name: "name", label: "Aidat Tipi Adı", type: "text", required: true },
      ]}
      addButtonLabel="Aidat Tipi Ekle"
      createAction={createDuesTypeAction}
      updateAction={updateDuesTypeAction}
      deleteAction={deleteDuesTypeAction}
      dictionary={dictionary}
    />
  );
}
