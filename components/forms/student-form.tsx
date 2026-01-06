"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
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
  createStudentAction,
  updateStudentAction,
  type StudentFormState,
} from "@/lib/actions/students";

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

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  tcKimlikNo?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  parentName: string;
  parentPhone: string;
  parentEmail?: string | null;
  parentTcKimlik?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  branchId: string;
  locationId: string;
  facilityId: string;
  monthlyFee: number;
  registrationFee: number;
  discountTypeId?: string | null;
  notes?: string | null;
}

interface StudentFormProps {
  student?: StudentData;
  branches: Branch[];
  locations: Location[];
  facilities: Facility[];
  discountTypes: DiscountType[];
  locale: string;
  dictionary: Record<string, unknown>;
}

export function StudentForm({
  student,
  branches,
  locations,
  facilities,
  discountTypes,
  locale,
  dictionary,
}: StudentFormProps) {
  const router = useRouter();
  const isEditing = !!student;

  const boundUpdateAction = student
    ? updateStudentAction.bind(null, student.id)
    : createStudentAction;

  const [state, formAction, isPending] = useActionState<StudentFormState, FormData>(
    boundUpdateAction,
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
          <CardTitle>Kisisel Bilgiler</CardTitle>
          <CardDescription>Ogrencinin kisisel bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ad *</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={student?.firstName}
              required
            />
            {state.errors?.firstName && (
              <p className="text-sm text-destructive">{state.errors.firstName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Soyad *</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={student?.lastName}
              required
            />
            {state.errors?.lastName && (
              <p className="text-sm text-destructive">{state.errors.lastName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Dogum Tarihi *</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              defaultValue={
                student?.birthDate
                  ? new Date(student.birthDate).toISOString().split("T")[0]
                  : ""
              }
              required
            />
            {state.errors?.birthDate && (
              <p className="text-sm text-destructive">{state.errors.birthDate[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Cinsiyet *</Label>
            <Select name="gender" defaultValue={student?.gender || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Cinsiyet secin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Erkek</SelectItem>
                <SelectItem value="FEMALE">Kadin</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.gender && (
              <p className="text-sm text-destructive">{state.errors.gender[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tcKimlikNo">TC Kimlik No</Label>
            <Input
              id="tcKimlikNo"
              name="tcKimlikNo"
              defaultValue={student?.tcKimlikNo || ""}
              maxLength={11}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <PhoneInput
              id="phone"
              name="phone"
              defaultValue={student?.phone || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={student?.email || ""}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Adres</Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={student?.address || ""}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Veli Bilgileri</CardTitle>
          <CardDescription>Veli iletisim bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="parentName">Veli Adi *</Label>
            <Input
              id="parentName"
              name="parentName"
              defaultValue={student?.parentName}
              required
            />
            {state.errors?.parentName && (
              <p className="text-sm text-destructive">{state.errors.parentName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentPhone">Veli Telefon *</Label>
            <PhoneInput
              id="parentPhone"
              name="parentPhone"
              defaultValue={student?.parentPhone}
              required
            />
            {state.errors?.parentPhone && (
              <p className="text-sm text-destructive">{state.errors.parentPhone[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentEmail">Veli E-posta</Label>
            <Input
              id="parentEmail"
              name="parentEmail"
              type="email"
              defaultValue={student?.parentEmail || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentTcKimlik">Veli TC Kimlik No</Label>
            <Input
              id="parentTcKimlik"
              name="parentTcKimlik"
              defaultValue={student?.parentTcKimlik || ""}
              maxLength={11}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Acil Durum Kisisi</Label>
            <Input
              id="emergencyContact"
              name="emergencyContact"
              defaultValue={student?.emergencyContact || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Acil Durum Telefon</Label>
            <PhoneInput
              id="emergencyPhone"
              name="emergencyPhone"
              defaultValue={student?.emergencyPhone || ""}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Egitim Bilgileri</CardTitle>
          <CardDescription>Brans, sube ve tesis bilgilerini secin</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="branchId">Brans *</Label>
            <Select name="branchId" defaultValue={student?.branchId || ""}>
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
            <Select name="locationId" defaultValue={student?.locationId || ""}>
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
            <Select name="facilityId" defaultValue={student?.facilityId || ""}>
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
              defaultValue={student?.monthlyFee || 0}
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
              defaultValue={student?.registrationFee || 0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountTypeId">Indirim Tipi</Label>
            <Select name="discountTypeId" defaultValue={student?.discountTypeId || "none"}>
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
            <Textarea
              id="notes"
              name="notes"
              defaultValue={student?.notes || ""}
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
          onClick={() => router.push(`/${locale}/students`)}
        >
          Iptal
        </Button>
      </div>
    </form>
  );
}
