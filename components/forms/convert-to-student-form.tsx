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
import { convertPreRegistrationAction, type ConvertFormState } from "@/lib/actions/convert-to-student";

interface Branch {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

interface Facility {
  id: string;
  name: string;
}

interface DiscountType {
  id: string;
  name: string;
  percentage: number;
}

interface PreRegistrationData {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: Date | null;
  gender?: string | null;
  parentName: string;
  parentPhone: string;
  parentEmail?: string | null;
  branchInterest?: string | null;
}

interface ConvertToStudentFormProps {
  preRegistration: PreRegistrationData;
  branches: Branch[];
  locations: Location[];
  facilities: Facility[];
  discountTypes: DiscountType[];
  locale: string;
  dictionary: Record<string, unknown>;
}

export function ConvertToStudentForm({
  preRegistration,
  branches,
  locations,
  facilities,
  discountTypes,
  locale,
  dictionary,
}: ConvertToStudentFormProps) {
  const router = useRouter();

  const boundAction = convertPreRegistrationAction.bind(null, preRegistration.id);

  const [state, formAction, isPending] = useActionState<ConvertFormState, FormData>(
    boundAction,
    { errors: {}, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push(`/${locale}/students`);
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router, locale]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Egitim Bilgileri</CardTitle>
          <CardDescription>Brans, sube ve tesis secimi yapin</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="branchId">Brans *</Label>
            <Select name="branchId" required>
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
            <Label htmlFor="locationId">Sube *</Label>
            <Select name="locationId" required>
              <SelectTrigger>
                <SelectValue placeholder="Sube secin" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.locationId && (
              <p className="text-sm text-destructive">{state.errors.locationId[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilityId">Tesis *</Label>
            <Select name="facilityId" required>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ucret Bilgileri</CardTitle>
          <CardDescription>Aidat ve indirim bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="monthlyFee">Aylik Aidat (TL)</Label>
            <Input
              id="monthlyFee"
              name="monthlyFee"
              type="number"
              min="0"
              step="0.01"
              defaultValue={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationFee">Kayit Ucreti (TL)</Label>
            <Input
              id="registrationFee"
              name="registrationFee"
              type="number"
              min="0"
              step="0.01"
              defaultValue={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountTypeId">Indirim Tipi</Label>
            <Select name="discountTypeId" defaultValue="none">
              <SelectTrigger>
                <SelectValue placeholder="Indirim secin (opsiyonel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Indirim yok</SelectItem>
                {discountTypes.map((discount) => (
                  <SelectItem key={discount.id} value={discount.id}>
                    {discount.name} (%{discount.percentage})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ek Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ogrenciye Donustur
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/pre-registration/${preRegistration.id}`)}
        >
          Iptal
        </Button>
      </div>
    </form>
  );
}
