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
  createPreRegistrationAction,
  updatePreRegistrationAction,
  type PreRegistrationFormState,
} from "@/lib/actions/pre-registration";
import { format } from "date-fns";

interface Branch {
  id: string;
  name: string;
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
  notes?: string | null;
  source?: string | null;
}

interface PreRegistrationFormProps {
  preRegistration?: PreRegistrationData;
  branches: Branch[];
  locale: string;
  dictionary: Record<string, unknown>;
}

export function PreRegistrationForm({
  preRegistration,
  branches,
  locale,
}: PreRegistrationFormProps) {
  const router = useRouter();
  const isEdit = !!preRegistration;

  const boundAction = isEdit
    ? updatePreRegistrationAction.bind(null, preRegistration.id)
    : createPreRegistrationAction;

  const [state, formAction, isPending] = useActionState<PreRegistrationFormState, FormData>(
    boundAction,
    { errors: {}, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push(`/${locale}/pre-registration`);
    } else if (state.errors?._form) {
      toast.error(state.errors._form[0]);
    }
  }, [state, router, locale]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ogrenci Bilgileri</CardTitle>
          <CardDescription>Ogrenci ad, soyad ve dogum tarihi</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ad *</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={preRegistration?.firstName || ""}
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
              defaultValue={preRegistration?.lastName || ""}
              required
            />
            {state.errors?.lastName && (
              <p className="text-sm text-destructive">{state.errors.lastName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Dogum Tarihi</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              defaultValue={
                preRegistration?.birthDate
                  ? format(preRegistration.birthDate, "yyyy-MM-dd")
                  : ""
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Cinsiyet</Label>
            <Select
              name="gender"
              defaultValue={preRegistration?.gender || "none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cinsiyet secin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Secilmedi</SelectItem>
                <SelectItem value="MALE">Erkek</SelectItem>
                <SelectItem value="FEMALE">Kadin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Veli Bilgileri</CardTitle>
          <CardDescription>Veli iletisim bilgileri</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="parentName">Veli Adi *</Label>
            <Input
              id="parentName"
              name="parentName"
              defaultValue={preRegistration?.parentName || ""}
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
              defaultValue={preRegistration?.parentPhone || ""}
              required
            />
            {state.errors?.parentPhone && (
              <p className="text-sm text-destructive">{state.errors.parentPhone[0]}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="parentEmail">Veli E-posta</Label>
            <Input
              id="parentEmail"
              name="parentEmail"
              type="email"
              defaultValue={preRegistration?.parentEmail || ""}
            />
            {state.errors?.parentEmail && (
              <p className="text-sm text-destructive">{state.errors.parentEmail[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ek Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="branchInterest">Ilgilendigi Brans</Label>
            <Select
              name="branchInterest"
              defaultValue={preRegistration?.branchInterest || "none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Brans secin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Secilmedi</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.name}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Kaynak</Label>
            <Select
              name="source"
              defaultValue={preRegistration?.source || "none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kaynak secin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Secilmedi</SelectItem>
                <SelectItem value="WEBSITE">Web Sitesi</SelectItem>
                <SelectItem value="PHONE">Telefon</SelectItem>
                <SelectItem value="WALKIN">Yuz Yuze</SelectItem>
                <SelectItem value="REFERRAL">Tavsiye</SelectItem>
                <SelectItem value="SOCIAL_MEDIA">Sosyal Medya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={preRegistration?.notes || ""}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Guncelle" : "Kaydet"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/pre-registration`)}
        >
          Iptal
        </Button>
      </div>
    </form>
  );
}
