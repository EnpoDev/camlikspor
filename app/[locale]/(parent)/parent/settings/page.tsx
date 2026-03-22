"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, X, Save } from "lucide-react";

const editProfileSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
  phone: z
    .string()
    .regex(
      /^(\+90|0)?[5][0-9]{9}$/,
      "Geçerli bir telefon numarası giriniz (05XX XXX XX XX)"
    )
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Geçerli bir e-posta adresi giriniz")
    .optional()
    .or(z.literal("")),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface ParentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  tcKimlikNo?: string | null;
  lastLoginAt?: string | null;
  isActive: boolean;
}

export default function ParentSettingsPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ParentProfile | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/parent/profile");
      if (res.status === 401) {
        router.push("/parent-login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProfile(data.parent);
      } else {
        toast.error("Profil bilgileri yüklenemedi");
      }
    } catch {
      toast.error("Bir hata oluştu. Lütfen sayfayı yenileyin.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleStartEdit() {
    if (!profile) return;
    reset({
      name: profile.name,
      phone: profile.phone || "",
      email: profile.email || "",
    });
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    reset();
  }

  async function onSubmit(data: EditProfileFormData) {
    setIsSaving(true);
    try {
      const res = await fetch("/api/parent/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone || undefined,
          email: data.email || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Profil güncellenemedi");
        return;
      }

      setProfile((prev) =>
        prev ? { ...prev, ...result.parent } : result.parent
      );
      setIsEditing(false);
      toast.success("Profil başarıyla güncellendi!");
      router.refresh();
    } catch {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ayarlar</h1>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ayarlar</h1>
          <p className="text-red-500">Profil bilgileri yüklenemedi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground">
          Hesap bilgilerinizi ve tercihlerinizi yönetin
        </p>
      </div>

      {/* Profile Information */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Profil Bilgileri</CardTitle>
            <CardDescription>
              {isEditing
                ? "Bilgilerinizi güncelleyin"
                : "Kişisel bilgilerinizi görüntüleyin ve düzenleyin"}
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="flex items-center gap-2 shrink-0"
            >
              <Pencil className="h-4 w-4" />
              Düzenle
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    placeholder="Ad Soyad"
                    {...register("name")}
                    disabled={isSaving}
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="E-posta adresi"
                    {...register("email")}
                    disabled={isSaving}
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    {...register("phone")}
                    disabled={isSaving}
                    className="mt-1"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>TC Kimlik No</Label>
                  <Input
                    value={profile.tcKimlikNo || "-"}
                    disabled
                    className="mt-1 cursor-not-allowed opacity-60"
                  />
                  <p className="text-xs text-muted-foreground">
                    TC Kimlik No değiştirilemez
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  İptal
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Ad Soyad</Label>
                <Input value={profile.name} disabled className="mt-1" />
              </div>
              <div>
                <Label>E-posta</Label>
                <Input value={profile.email} disabled className="mt-1" />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input value={profile.phone || "-"} disabled className="mt-1" />
              </div>
              <div>
                <Label>TC Kimlik No</Label>
                <Input
                  value={profile.tcKimlikNo || "-"}
                  disabled
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Şifre Değiştir</CardTitle>
          <CardDescription>
            Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/parent/change-password">
            <Button>Şifre Değiştir</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Hesap Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Son Giriş:</span>
            <span className="font-medium">
              {profile.lastLoginAt
                ? new Date(profile.lastLoginAt).toLocaleDateString("tr-TR")
                : "Henüz giriş yapılmadı"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hesap Durumu:</span>
            <span className="font-medium">
              {profile.isActive ? "Aktif" : "Pasif"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Future Features */}
      <Card className="bg-slate-50 dark:bg-slate-900 shadow-md">
        <CardHeader>
          <CardTitle>Bildirim Tercihleri</CardTitle>
          <CardDescription>Yakında eklenecek</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          E-posta ve SMS bildirimleri için tercihlerinizi yakında buradan
          ayarlayabileceksiniz.
        </CardContent>
      </Card>
    </div>
  );
}
