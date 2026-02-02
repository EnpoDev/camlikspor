import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDealerTheme, getDefaultThemeSettings, getSystemThemePresets } from "@/lib/data/themes";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function ThemePage({ params }: Props) {
  const { locale } = await params;

  const session = await auth();
  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const dict = await getDictionary(locale);
  const { preset, customSettings } = await getDealerTheme(session.user.dealerId);
  const themePresets = await getSystemThemePresets();
  const currentTheme = customSettings || getDefaultThemeSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/customization`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dict.customization?.theme || "Tema Ayarları"}
          </h1>
          <p className="text-muted-foreground">
            {dict.customization?.themeDescription || "Renkleri, fontları ve tema presetlerini düzenleyin"}
          </p>
        </div>
      </div>

      {/* Theme Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Tema Presetleri</CardTitle>
          <CardDescription>
            Hazır temalardan birini seçin veya kendi temanızı oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themePresets.map((presetItem) => (
              <div
                key={presetItem.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  preset?.id === presetItem.id
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                {preset?.id === presetItem.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className="flex gap-1 mb-3">
                  {[
                    presetItem.primaryColor,
                    presetItem.secondaryColor,
                    presetItem.accentColor,
                  ].map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="font-medium text-sm">{presetItem.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Mevcut Renkler</CardTitle>
          <CardDescription>
            Aktif tema renkleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div
                className="w-full h-16 rounded-lg border"
                style={{ backgroundColor: currentTheme.primaryColor }}
              />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">{currentTheme.primaryColor}</p>
            </div>
            <div className="space-y-2">
              <div
                className="w-full h-16 rounded-lg border"
                style={{ backgroundColor: currentTheme.secondaryColor }}
              />
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">{currentTheme.secondaryColor}</p>
            </div>
            <div className="space-y-2">
              <div
                className="w-full h-16 rounded-lg border"
                style={{ backgroundColor: currentTheme.accentColor }}
              />
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">{currentTheme.accentColor}</p>
            </div>
            <div className="space-y-2">
              <div
                className="w-full h-16 rounded-lg border"
                style={{ backgroundColor: currentTheme.backgroundColor }}
              />
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs text-muted-foreground">{currentTheme.backgroundColor}</p>
            </div>
            <div className="space-y-2">
              <div
                className="w-full h-16 rounded-lg border"
                style={{ backgroundColor: currentTheme.textColor }}
              />
              <p className="text-sm font-medium">Text</p>
              <p className="text-xs text-muted-foreground">{currentTheme.textColor}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fonts */}
      <Card>
        <CardHeader>
          <CardTitle>Fontlar</CardTitle>
          <CardDescription>
            Başlık ve metin fontları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Başlık Fontu</p>
              <p className="text-2xl font-bold" style={{ fontFamily: currentTheme.headingFont }}>
                {currentTheme.headingFont}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Metin Fontu</p>
              <p className="text-lg" style={{ fontFamily: currentTheme.bodyFont }}>
                {currentTheme.bodyFont}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
