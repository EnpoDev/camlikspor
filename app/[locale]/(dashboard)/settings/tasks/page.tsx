import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { SettingsPageClient } from "@/components/settings/settings-page-client";
import {
  createTaskDefinitionAction,
  updateTaskDefinitionAction,
  deleteTaskDefinitionAction,
} from "@/lib/actions/settings";

interface TasksPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TasksPage({ params }: TasksPageProps) {
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

  const taskDefinitions = await prisma.taskDefinition.findMany({
    where: dealerId ? { dealerId } : {},
    orderBy: { name: "asc" },
  });

  return (
    <SettingsPageClient
      title={dictionary.settings.taskDefinitions}
      subtitle="Gorev tanimlarini yonetin"
      iconName="ListTodo"
      items={taskDefinitions}
      columns={[
        { key: "name", label: "Gorev Adi" },
        { key: "description", label: "Aciklama" },
      ]}
      dialogTitle="Gorev Tanimi"
      dialogFields={[
        { name: "name", label: "Gorev Adi", type: "text", required: true },
        { name: "description", label: "Aciklama", type: "textarea" },
      ]}
      addButtonLabel="Gorev Tanimi Ekle"
      createAction={createTaskDefinitionAction}
      updateAction={updateTaskDefinitionAction}
      deleteAction={deleteTaskDefinitionAction}
      dictionary={dictionary}
    />
  );
}
