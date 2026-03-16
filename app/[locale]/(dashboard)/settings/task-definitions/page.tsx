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
} from "@/lib/actions/task-definitions";

interface TaskDefinitionsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TaskDefinitionsPage({ params }: TaskDefinitionsPageProps) {
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
      title="Görev Tanımları"
      subtitle="Görev tanımlarını yönetin"
      iconName="ListTodo"
      items={taskDefinitions}
      columns={[
        { key: "name", label: "Görev Tanımı Adı" },
      ]}
      dialogTitle="Görev Tanımı"
      dialogFields={[
        { name: "name", label: "Görev Tanımı Adı", type: "text", required: true },
      ]}
      addButtonLabel="Görev Tanımı Ekle"
      createAction={createTaskDefinitionAction}
      updateAction={updateTaskDefinitionAction}
      deleteAction={deleteTaskDefinitionAction}
      dictionary={dictionary}
    />
  );
}
