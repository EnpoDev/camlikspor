"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createSponsor, updateSponsor, type SponsorFormState } from "@/lib/actions/sponsors";
import { SponsorLogoUpload } from "./sponsor-logo-upload";
import type { Sponsor } from "@prisma/client";

interface SponsorFormProps {
  locale: string;
  sponsor?: Sponsor;
}

const initialState: SponsorFormState = {};

export function SponsorForm({ locale, sponsor }: SponsorFormProps) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState(sponsor?.logoUrl ?? "");

  const action = sponsor
    ? updateSponsor.bind(null, sponsor.id)
    : createSponsor;

  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(sponsor ? "Sponsor güncellendi" : "Sponsor oluşturuldu");
      router.push(`/${locale}/sponsors`);
    } else if (state.messageKey && !state.success && state.messageKey !== "formValidationError") {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }, [state, sponsor, locale, router]);

  return (
    <form action={formAction} className="space-y-6">
      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>Sponsor Logosu</Label>
        <SponsorLogoUpload value={logoUrl} onChange={setLogoUrl} />
        <input type="hidden" name="logoUrl" value={logoUrl} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Sponsor Adı *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={sponsor?.name ?? ""}
            placeholder="Örn: Süper Sponsor A.Ş."
            required
          />
          {state.errors?.name && (
            <p className="text-sm text-destructive">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Web Sitesi URL</Label>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            defaultValue={sponsor?.websiteUrl ?? ""}
            placeholder="https://www.ornek.com"
          />
          {state.errors?.websiteUrl && (
            <p className="text-sm text-destructive">{state.errors.websiteUrl[0]}</p>
          )}
        </div>

        {/* Tier */}
        <div className="space-y-2">
          <Label htmlFor="tier">Sponsor Seviyesi</Label>
          <Select name="tier" defaultValue={sponsor?.tier ?? "partner"}>
            <SelectTrigger id="tier">
              <SelectValue placeholder="Seviye seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Ana Sponsor</SelectItem>
              <SelectItem value="official">Resmi Sponsor</SelectItem>
              <SelectItem value="partner">İş Ortağı</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.tier && (
            <p className="text-sm text-destructive">{state.errors.tier[0]}</p>
          )}
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sıralama</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min="0"
            defaultValue={sponsor?.sortOrder ?? 0}
          />
          <p className="text-xs text-muted-foreground">
            Aynı seviyedeki sponsorlar arasında görünüm sırası
          </p>
        </div>
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-3 rounded-lg border p-4">
        <Switch
          id="isVisible"
          name="isVisible"
          defaultChecked={sponsor?.isVisible ?? true}
          onCheckedChange={(checked) => {
            const input = document.querySelector<HTMLInputElement>('input[name="isVisible"]');
            if (input) input.value = checked ? "true" : "false";
          }}
        />
        <div>
          <Label htmlFor="isVisible" className="cursor-pointer font-medium">
            Görünür
          </Label>
          <p className="text-sm text-muted-foreground">
            Açıksa bu sponsor herkese açık sayfada gösterilir
          </p>
        </div>
        <input type="hidden" name="isVisible" defaultValue={sponsor?.isVisible !== false ? "true" : "false"} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Kaydediliyor..." : sponsor ? "Güncelle" : "Oluştur"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/sponsors`)}
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
