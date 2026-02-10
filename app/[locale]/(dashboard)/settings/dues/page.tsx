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
} from "@/lib/actions/settings";

interface DuesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DuesPage({ params }: DuesPageProps) {
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

  const dueTypes = await prisma.duesType.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.duesTypes}
      subtitle="Aidat tiplerini yonetin"
      iconName="Banknote"
      items={dueTypes}
      columns={[
        { key: "name", label: "Aidat Adi" },
        { key: "amount", label: "Tutar", format: "currency" },
      ]}
      dialogTitle="Aidat Tipi"
      dialogFields={[
        { name: "name", label: "Aidat Adi", type: "text", required: true },
        { name: "amount", label: "Tutar (TL)", type: "number", min: 0, step: 0.01 },
      ]}
      addButtonLabel="Aidat Tipi Ekle"
      createAction={createDuesTypeAction}
      updateAction={updateDuesTypeAction}
      deleteAction={deleteDuesTypeAction}
      dictionary={dictionary}
    />
  );
}
