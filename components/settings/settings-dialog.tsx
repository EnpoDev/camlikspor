"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Pencil } from "lucide-react";
import { type SettingsFormState } from "@/lib/actions/settings";

export type SettingsFieldType = "text" | "textarea" | "number" | "date";

export interface SettingsField {
  name: string;
  label: string;
  type: SettingsFieldType;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

interface SettingsDialogProps {
  title: string;
  description?: string;
  fields: SettingsField[];
  createAction: (
    prevState: SettingsFormState,
    formData: FormData
  ) => Promise<SettingsFormState>;
  updateAction?: (
    id: string,
    prevState: SettingsFormState,
    formData: FormData
  ) => Promise<SettingsFormState>;
  editItem?: {
    id: string;
    [key: string]: unknown;
  };
  triggerLabel?: string;
  triggerVariant?: "default" | "outline" | "ghost" | "secondary";
}

export function SettingsDialog({
  title,
  description,
  fields,
  createAction,
  updateAction,
  editItem,
  triggerLabel,
  triggerVariant = "default",
}: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = !!editItem;

  const boundAction = isEdit && updateAction
    ? updateAction.bind(null, editItem.id)
    : createAction;

  const [state, formAction, isPending] = useActionState<SettingsFormState, FormData>(
    boundAction,
    { errors: {}, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state.message && !state.success && state.message !== "Formu kontrol edin") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant={triggerVariant}>
            <Plus className="mr-2 h-4 w-4" />
            {triggerLabel || "Ekle"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>{isEdit ? `${title} Duzenle` : `${title} Ekle`}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && " *"}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    defaultValue={(editItem?.[field.name] as string) || ""}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    defaultValue={
                      editItem?.[field.name] !== undefined
                        ? String(editItem[field.name])
                        : field.type === "number"
                        ? "0"
                        : ""
                    }
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                )}
                {state.errors?.[field.name] && (
                  <p className="text-sm text-destructive">{state.errors[field.name][0]}</p>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                name="isActive"
                defaultChecked={editItem?.isActive !== false}
                value="true"
              />
              <Label htmlFor="isActive">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Iptal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Guncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
