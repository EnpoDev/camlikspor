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

interface GroupData {
  id: string;
  name: string;
  description?: string | null;
  branchId: string;
  facilityId: string;
  periodId: string;
  maxCapacity?: number | null;
}

interface GroupFormProps {
  group?: GroupData;
  branches: Branch[];
  facilities: Facility[];
  periods: Period[];
  locale: string;
  dictionary: Record<string, unknown>;
}

export function GroupForm({
  group,
  branches,
  facilities,
  periods,
  locale,
  dictionary,
}: GroupFormProps) {
  const router = useRouter();
  const isEditing = !!group;

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
