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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  createDealerAction,
  updateDealerAction,
  type DealerFormState,
} from "@/lib/actions/dealers";

interface DealerData {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  taxNumber?: string | null;
}

interface DealerFormProps {
  dealer?: DealerData;
  locale: string;
  dictionary: Record<string, unknown>;
}

export function DealerForm({
  dealer,
  locale,
  dictionary,
}: DealerFormProps) {
  const router = useRouter();
  const isEditing = !!dealer;

  const boundUpdateAction = dealer
    ? updateDealerAction.bind(null, dealer.id)
    : createDealerAction;

  const [state, formAction, isPending] = useActionState<DealerFormState, FormData>(
    boundUpdateAction,
    { errors: {}, message: "" }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push(`/${locale}/dealers`);
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router, locale]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bayi Bilgileri</CardTitle>
          <CardDescription>Bayi bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Bayi Adi *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={dealer?.name}
              required
            />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={dealer?.slug}
              placeholder="ornek-bayi"
              required
            />
            {state.errors?.slug && (
              <p className="text-sm text-destructive">{state.errors.slug[0]}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Sadece kucuk harf, rakam ve tire kullanin
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <PhoneInput
              id="phone"
              name="phone"
              defaultValue={dealer?.phone || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={dealer?.email || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxNumber">Vergi Numarasi</Label>
            <Input
              id="taxNumber"
              name="taxNumber"
              defaultValue={dealer?.taxNumber || ""}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Adres</Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={dealer?.address || ""}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin User Card - Only show for new dealers */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Bayi Admin Kullanicisi</CardTitle>
            <CardDescription>
              Bayinin yonetim paneline giris yapacak admin kullanicisini olusturun
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="adminName">Admin Adi *</Label>
              <Input
                id="adminName"
                name="adminName"
                placeholder="Yetkili adi"
                required
              />
              {state.errors?.adminName && (
                <p className="text-sm text-destructive">{state.errors.adminName[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin E-posta *</Label>
              <Input
                id="adminEmail"
                name="adminEmail"
                type="email"
                placeholder="admin@example.com"
                required
              />
              {state.errors?.adminEmail && (
                <p className="text-sm text-destructive">{state.errors.adminEmail[0]}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="adminPassword">Sifre *</Label>
              <Input
                id="adminPassword"
                name="adminPassword"
                type="password"
                placeholder="En az 6 karakter"
                required
              />
              {state.errors?.adminPassword && (
                <p className="text-sm text-destructive">{state.errors.adminPassword[0]}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Sifre en az 6 karakter olmalidir
              </p>
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
          onClick={() => router.push(`/${locale}/dealers`)}
        >
          Iptal
        </Button>
      </div>
    </form>
  );
}
