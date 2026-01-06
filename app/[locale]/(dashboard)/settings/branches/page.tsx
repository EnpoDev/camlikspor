import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createBranchAction,
  updateBranchAction,
  deleteBranchAction,
} from "@/lib/actions/settings";

interface BranchesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BranchesPage({ params }: BranchesPageProps) {
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

  const branches = await prisma.branch.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.branches}
      subtitle="Spor branslarini yonetin"
      iconName="GitBranch"
      items={branches}
      columns={[
        { key: "name", label: "Brans Adi" },
        { key: "description", label: "Aciklama" },
      ]}
      dialogTitle="Brans"
      dialogFields={[
        { name: "name", label: "Brans Adi", type: "text", required: true },
        { name: "description", label: "Aciklama", type: "textarea" },
      ]}
      addButtonLabel="Brans Ekle"
      createAction={createBranchAction}
      updateAction={updateBranchAction}
      deleteAction={deleteBranchAction}
      dictionary={dictionary}
    />
  );
}
