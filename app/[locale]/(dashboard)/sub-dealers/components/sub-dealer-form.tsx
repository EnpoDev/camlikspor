"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  createSubDealerAction,
  updateSubDealerAction,
  type SubDealerFormState,
} from "@/lib/actions/sub-dealers";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

interface SubDealerData {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  logo: string | null;
  customDomain: string | null;
  subdomain: string | null;
  inheritParentProducts: boolean;
  canCreateOwnProducts: boolean;
}

interface SubDealerFormProps {
  locale: string;
  dictionary: Dictionary;
  initialData?: SubDealerData;
}

export function SubDealerForm({ locale, dictionary, initialData }: SubDealerFormProps) {
  const router = useRouter();
  const dict = dictionary;
  const hasSubmitted = useRef(false);
  const isEditing = !!initialData;

  const [inheritParentProducts, setInheritParentProducts] = useState(
    initialData?.inheritParentProducts ?? true
  );
  const [canCreateOwnProducts, setCanCreateOwnProducts] = useState(
    initialData?.canCreateOwnProducts ?? true
  );
  const [logoUrl, setLogoUrl] = useState(initialData?.logo || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Desteklenmeyen dosya tipi. JPG, PNG, WebP veya GIF yukleyin.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan buyuk olamaz");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "logos");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Yukleme hatasi");
      }

      const { url } = await response.json();
      setLogoUrl(url);
      toast.success("Logo yuklendi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logo yuklenemedi");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const [state, formAction, isPending] = useActionState<
    SubDealerFormState,
    FormData
  >(
    async (prevState: SubDealerFormState, formData: FormData) => {
      hasSubmitted.current = true;
      formData.set("inheritParentProducts", String(inheritParentProducts));
      formData.set("canCreateOwnProducts", String(canCreateOwnProducts));
      formData.set("logo", logoUrl);
      if (isEditing) {
        return updateSubDealerAction(initialData.id, prevState, formData);
      }
      return createSubDealerAction(prevState, formData);
    },
    {}
  );

  useEffect(() => {
    if (!hasSubmitted.current) return;

    if (state?.success) {
      toast.success(
        isEditing
          ? "Basariyla guncellendi"
          : dict.success?.dealerCreated || "Basariyla olusturuldu"
      );
      router.push(`/${locale}/sub-dealers`);
    } else if (state?.message) {
      toast.error(state.message);
    } else if (state?.messageKey) {
      const errMsg =
        (dict.errors as Record<string, string>)?.[state.messageKey] ||
        dict.errors?.generalError ||
        "Bir hata olustu";
      toast.error(errMsg);
    }
  }, [state, router, locale, dict, isEditing]);

  return (
    <form action={formAction}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {dict.subDealers?.formTitle || "Alt Bayi Bilgileri"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {dict.subDealers?.name || "Bayi Adi"} *
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={initialData?.name}
                  placeholder={dict.subDealers?.name || "Bayi Adi"}
                />
                {state?.errors?.name && (
                  <p className="text-sm text-destructive">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">
                  {dict.subDealers?.slug || "Slug"} *
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  required
                  defaultValue={initialData?.slug}
                  placeholder="ornek-bayi"
                />
                {state?.errors?.slug && (
                  <p className="text-sm text-destructive">
                    {state.errors.slug[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {dict.subDealers?.email || "E-posta"}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={initialData?.email || ""}
                  placeholder="info@example.com"
                />
                {state?.errors?.email && (
                  <p className="text-sm text-destructive">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  {dict.subDealers?.phone || "Telefon"}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={initialData?.phone || ""}
                  placeholder="0555 555 55 55"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                {dict.subDealers?.address || "Adres"}
              </Label>
              <Input id="address" name="address" defaultValue={initialData?.address || ""} placeholder="Adres" />
            </div>

            <div className="space-y-2">
              <Label>{dict.subDealers?.logo || "Logo"}</Label>
              {logoUrl && (
                <div className="relative w-20 h-20 border rounded-lg overflow-hidden group">
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="absolute top-0.5 right-0.5 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://... veya dosya yukleyin"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {dict.subDealers?.domain || "Domain"} &{" "}
              {dict.settings?.title || "Ayarlar"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customDomain">
                  {dict.subDealers?.customDomain || "Ozel Domain"}
                </Label>
                <Input
                  id="customDomain"
                  name="customDomain"
                  defaultValue={initialData?.customDomain || ""}
                  placeholder="shop.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdomain">
                  {dict.subDealers?.subdomain || "Subdomain"}
                </Label>
                <Input
                  id="subdomain"
                  name="subdomain"
                  defaultValue={initialData?.subdomain || ""}
                  placeholder="bayiadi"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <Label>
                  {dict.subDealers?.inheritProducts || "Urun Kalitimi"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ust bayinin urunlerini otomatik goster
                </p>
              </div>
              <Switch
                checked={inheritParentProducts}
                onCheckedChange={setInheritParentProducts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {dict.subDealers?.canCreateProducts || "Urun Olusturabilir"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alt bayi kendi urunlerini olusturabilsin
                </p>
              </div>
              <Switch
                checked={canCreateOwnProducts}
                onCheckedChange={setCanCreateOwnProducts}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href={`/${locale}/sub-dealers`}>
            <Button type="button" variant="outline">
              {dict.common?.cancel || "Iptal"}
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? dict.common?.loading || "Yukleniyor..."
              : isEditing
                ? dict.common?.update || "Guncelle"
                : dict.common?.save || "Kaydet"}
          </Button>
        </div>
      </div>
    </form>
  );
}
