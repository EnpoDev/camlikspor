"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { type PersonnelFormState } from "@/lib/actions/personnel";

interface PersonnelFormProps {
  action: (
    prevState: PersonnelFormState,
    formData: FormData
  ) => Promise<PersonnelFormState>;
  defaultValues?: {
    firstName?: string;
    lastName?: string;
    personnelTypeId?: string;
    phone?: string;
    email?: string;
    salary?: number;
    tcKimlikNo?: string;
    address?: string;
    birthDate?: Date | null;
    notes?: string;
    workSchedule?: string;
  };
  personnelTypes: Array<{ id: string; name: string }>;
  submitLabel: string;
}

export function PersonnelForm({
  action,
  defaultValues,
  personnelTypes,
  submitLabel,
}: PersonnelFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, {
    errors: {},
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/tr/personnel");
      router.refresh();
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Ad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={defaultValues?.firstName}
                required
              />
              {state.errors?.firstName && (
                <p className="text-sm text-destructive">
                  {state.errors.firstName[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Soyad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={defaultValues?.lastName}
                required
              />
              {state.errors?.lastName && (
                <p className="text-sm text-destructive">
                  {state.errors.lastName[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personnelTypeId">
              Personel Türü <span className="text-destructive">*</span>
            </Label>
            <Select
              name="personnelTypeId"
              defaultValue={defaultValues?.personnelTypeId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Personel türü seçin" />
              </SelectTrigger>
              <SelectContent>
                {personnelTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.personnelTypeId && (
              <p className="text-sm text-destructive">
                {state.errors.personnelTypeId[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Telefon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                defaultValue={defaultValues?.phone}
                required
              />
              {state.errors?.phone && (
                <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={defaultValues?.email}
              />
              {state.errors?.email && (
                <p className="text-sm text-destructive">{state.errors.email[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tcKimlikNo">TC Kimlik No</Label>
              <Input
                id="tcKimlikNo"
                name="tcKimlikNo"
                maxLength={11}
                defaultValue={defaultValues?.tcKimlikNo}
              />
              {state.errors?.tcKimlikNo && (
                <p className="text-sm text-destructive">
                  {state.errors.tcKimlikNo[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Doğum Tarihi</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                defaultValue={
                  defaultValues?.birthDate
                    ? new Date(defaultValues.birthDate)
                        .toISOString()
                        .split("T")[0]
                    : undefined
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adres</Label>
            <Textarea
              id="address"
              name="address"
              rows={3}
              defaultValue={defaultValues?.address}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>İş Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salary">Maaş (TRY)</Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              min="0"
              step="0.01"
              defaultValue={defaultValues?.salary}
            />
            {state.errors?.salary && (
              <p className="text-sm text-destructive">{state.errors.salary[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="workSchedule">Çalışma Programı</Label>
            <Textarea
              id="workSchedule"
              name="workSchedule"
              rows={3}
              placeholder="Örn: Pazartesi-Cuma 09:00-18:00"
              defaultValue={defaultValues?.workSchedule}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={defaultValues?.notes}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          İptal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
