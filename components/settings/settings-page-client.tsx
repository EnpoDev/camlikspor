"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsDialog, type SettingsField } from "./settings-dialog";
import { SettingsTable, type SettingsColumn } from "./settings-table";
import { type SettingsFormState } from "@/lib/actions/settings";
import {
  ListTodo,
  GitBranch,
  MapPin,
  Building2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Ruler,
  Percent,
  Banknote,
  Package,
} from "lucide-react";

const iconMap = {
  ListTodo,
  GitBranch,
  MapPin,
  Building2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Ruler,
  Percent,
  Banknote,
  Package,
};

export type IconName = keyof typeof iconMap;

interface SettingsPageClientProps {
  title: string;
  subtitle: string;
  iconName: IconName;
  items: Record<string, unknown>[];
  columns: SettingsColumn[];
  dialogTitle: string;
  dialogFields: SettingsField[];
  addButtonLabel: string;
  createAction: (
    prevState: SettingsFormState,
    formData: FormData
  ) => Promise<SettingsFormState>;
  updateAction: (
    id: string,
    prevState: SettingsFormState,
    formData: FormData
  ) => Promise<SettingsFormState>;
  deleteAction: (id: string) => Promise<SettingsFormState>;
  dictionary: { common: { noData: string; active: string; inactive: string; status: string } };
}

export function SettingsPageClient({
  title,
  subtitle,
  iconName,
  items,
  columns,
  dialogTitle,
  dialogFields,
  addButtonLabel,
  createAction,
  updateAction,
  deleteAction,
  dictionary,
}: SettingsPageClientProps) {
  const Icon = iconMap[iconName];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <SettingsDialog
          title={dialogTitle}
          fields={dialogFields}
          createAction={createAction}
          triggerLabel={addButtonLabel}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {items.length} {dialogTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsTable
            items={items}
            columns={columns}
            dialogTitle={dialogTitle}
            dialogFields={dialogFields}
            createAction={createAction}
            updateAction={updateAction}
            deleteAction={deleteAction}
            emptyMessage={dictionary.common.noData}
            dictionary={dictionary}
          />
        </CardContent>
      </Card>
    </div>
  );
}
