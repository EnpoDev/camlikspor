"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
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
  createUserAction,
  updateUserAction,
  type UserFormState,
} from "@/lib/actions/users";

interface Dealer {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  dealerId?: string | null;
}

interface UserFormProps {
  user?: UserData;
  dealers: Dealer[];
  locale: string;
  dictionary: Record<string, unknown>;
  isSuperAdmin: boolean;
}

export function UserForm({
  user,
  dealers,
  locale,
  dictionary,
  isSuperAdmin,
}: UserFormProps) {
  const router = useRouter();
  const isEditing = !!user;

  const boundUpdateAction = user
    ? updateUserAction.bind(null, user.id)
    : createUserAction;

  const [state, formAction, isPending] = useActionState<UserFormState, FormData>(
    boundUpdateAction,
    { errors: {}, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push(`/${locale}/users`);
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router, locale]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kullanici Bilgileri</CardTitle>
          <CardDescription>Kullanici hesap bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name}
              required
            />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email}
              required
            />
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? "Sifre (bos birakilabilir)" : "Sifre *"}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required={!isEditing}
              placeholder={isEditing ? "Degistirmek icin yeni sifre girin" : ""}
            />
            {state.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <PhoneInput
              id="phone"
              name="phone"
              defaultValue={user?.phone || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Select name="role" defaultValue={user?.role || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Rol secin" />
              </SelectTrigger>
              <SelectContent>
                {isSuperAdmin && (
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                )}
                <SelectItem value="DEALER_ADMIN">Bayi Admin</SelectItem>
                <SelectItem value="TRAINER">Antrenor</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.role && (
              <p className="text-sm text-destructive">{state.errors.role[0]}</p>
            )}
          </div>

          {isSuperAdmin && (
            <div className="space-y-2">
              <Label htmlFor="dealerId">Bayi</Label>
              <Select name="dealerId" defaultValue={user?.dealerId || "none"}>
                <SelectTrigger>
                  <SelectValue placeholder="Bayi secin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Bayi yok</SelectItem>
                  {dealers.map((dealer) => (
                    <SelectItem key={dealer.id} value={dealer.id}>
                      {dealer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
          onClick={() => router.push(`/${locale}/users`)}
        >
          Iptal
        </Button>
      </div>
    </form>
  );
}
