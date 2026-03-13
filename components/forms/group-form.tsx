"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import {
  createGroupAction,
  updateGroupAction,
  type GroupFormState,
} from "@/lib/actions/groups";

interface Branch {
  id: string;
  name: string;
}

interface Facility {
  id: string;
  name: string;
}

interface Period {
  id: string;
  name: string;
}

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
}

interface GroupData {
  id: string;
  name: string;
  description?: string | null;
  branchId: string;
  facilityId: string;
  periodId: string;
  maxCapacity?: number | null;
  trainers?: { trainer: { id: string }; isPrimary: boolean }[];
}

interface GroupFormProps {
  group?: GroupData;
  branches: Branch[];
  facilities: Facility[];
  periods: Period[];
  trainers: Trainer[];
  locale: string;
  dictionary: Record<string, unknown>;
}

export function GroupForm({
  group,
  branches,
  facilities,
  periods,
  trainers,
  locale,
  dictionary,
}: GroupFormProps) {
  const router = useRouter();
  const isEditing = !!group;

  const selectedTrainerIds = group?.trainers?.map((t) => t.trainer.id) || [];
  const primaryTrainerId = group?.trainers?.find((t) => t.isPrimary)?.trainer.id || "";

  const boundUpdateAction = group
    ? updateGroupAction.bind(null, group.id)
    : createGroupAction;

  const [state, formAction, isPending] = useActionState<GroupFormState, FormData>(
    boundUpdateAction,
    { errors: {}, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push(`/${locale}/groups`);
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router, locale]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grup Bilgileri</CardTitle>
          <CardDescription>Grup bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Grup Adi *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={group?.name}
              required
            />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Maksimum Kapasite</Label>
            <Input
              id="maxCapacity"
              name="maxCapacity"
              type="number"
              min="1"
              defaultValue={group?.maxCapacity || 20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branchId">Brans *</Label>
            <Select name="branchId" defaultValue={group?.branchId || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Brans secin" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.branchId && (
              <p className="text-sm text-destructive">{state.errors.branchId[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilityId">Tesis *</Label>
            <Select name="facilityId" defaultValue={group?.facilityId || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Tesis secin" />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.facilityId && (
              <p className="text-sm text-destructive">{state.errors.facilityId[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodId">Donem *</Label>
            <Select name="periodId" defaultValue={group?.periodId || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Donem secin" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.periodId && (
              <p className="text-sm text-destructive">{state.errors.periodId[0]}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Aciklama</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={group?.description || ""}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {trainers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Antrenorler</CardTitle>
            <CardDescription>Gruba antrenor atayin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Antrenorler</Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {trainers.map((trainer) => (
                  <div key={trainer.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`trainer-${trainer.id}`}
                      name="trainerIds"
                      value={trainer.id}
                      defaultChecked={selectedTrainerIds.includes(trainer.id)}
                    />
                    <label
                      htmlFor={`trainer-${trainer.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {trainer.firstName} {trainer.lastName}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryTrainerId">Ana Antrenor</Label>
              <Select name="primaryTrainerId" defaultValue={primaryTrainerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Ana antrenor secin" />
                </SelectTrigger>
                <SelectContent>
                  {trainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.firstName} {trainer.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Guncelle" : "Kaydet"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/groups`)}
        >
          Iptal
        </Button>
      </div>
    </form>
  );
}
