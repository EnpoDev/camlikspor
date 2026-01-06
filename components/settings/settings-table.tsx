"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { SettingsDialog, type SettingsField } from "./settings-dialog";
import { type SettingsFormState } from "@/lib/actions/settings";

export interface SettingsColumn {
  key: string;
  label: string;
  render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode;
}

interface SettingsTableProps {
  items: Record<string, unknown>[];
  columns: SettingsColumn[];
  dialogTitle: string;
  dialogFields: SettingsField[];
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
  emptyMessage?: string;
  dictionary: { common: { noData: string; active: string; inactive: string; status: string } };
}

export function SettingsTable({
  items,
  columns,
  dialogTitle,
  dialogFields,
  createAction,
  updateAction,
  deleteAction,
  emptyMessage = "Veri bulunamadi",
  dictionary,
}: SettingsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteAction(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setDeletingId(null);
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
          <TableHead>{dictionary.common.status}</TableHead>
          <TableHead className="w-[100px]">Islemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id as string}>
            {columns.map((column) => (
              <TableCell key={column.key} className={column.key === columns[0].key ? "font-medium" : ""}>
                {column.render
                  ? column.render(item[column.key], item)
                  : (item[column.key] as string) || "-"}
              </TableCell>
            ))}
            <TableCell>
              <Badge variant={item.isActive ? "default" : "secondary"}>
                {item.isActive ? dictionary.common.active : dictionary.common.inactive}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <SettingsDialog
                  title={dialogTitle}
                  fields={dialogFields}
                  createAction={createAction}
                  updateAction={updateAction}
                  editItem={item as { id: string; [key: string]: unknown }}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      {isPending && deletingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Silmek istediginizden emin misiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu islem geri alinamaz. Bu kayit kalici olarak silinecektir.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Iptal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id as string)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
