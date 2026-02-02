import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDealerTheme, getDefaultLayoutSettings } from "@/lib/data/themes";
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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LayoutGrid, Rows, Square, CheckCircle, XCircle } from "lucide-react";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function LayoutPage({ params }: Props) {
  const { locale } = await params;

  const session = await auth();
  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const dict = await getDictionary(locale);
  const { layoutSettings } = await getDealerTheme(session.user.dealerId);
  const currentLayout = layoutSettings || getDefaultLayoutSettings();

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
            {dict.customization?.layout || "Layout Ayarları"}
          </h1>
          <p className="text-muted-foreground">
            {dict.customization?.layoutDescription || "Sayfa düzenini ve bileşen görünürlüğünü ayarlayın"}
          </p>
        </div>
      </div>

      {/* Header Style */}
      <Card>
        <CardHeader>
          <CardTitle>Header Stili</CardTitle>
          <CardDescription>
            Sayfa başlığı görünümünü seçin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {["default", "centered", "minimal"].map((style) => (
              <div
                key={style}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentLayout.headerStyle === style
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="h-20 bg-muted rounded mb-2 flex items-center justify-center">
                  <Rows className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm capitalize">{style}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Ürün Grid Düzeni</CardTitle>
          <CardDescription>
            Ürünlerin kaç sütunda gösterileceğini belirleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[2, 3, 4, 5].map((cols) => (
              <div
                key={cols}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentLayout.productGridCols === cols
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `repeat(${Math.min(cols, 4)}, 1fr)` }}>
                  {Array.from({ length: Math.min(cols, 4) }).map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded" />
                  ))}
                </div>
                <p className="font-medium text-sm text-center">{cols} Sütun</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Bölüm Görünürlüğü</CardTitle>
          <CardDescription>
            Hangi bölümlerin gösterileceğini ayarlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: "showHeroSection", label: "Hero Bölümü", value: currentLayout.showHeroSection },
              { key: "showFeatures", label: "Özellikler", value: currentLayout.showFeatures },
              { key: "showShopPreview", label: "Ürünler", value: currentLayout.showShopPreview },
              { key: "showGallery", label: "Galeri", value: currentLayout.showGallery },
              { key: "showContact", label: "İletişim", value: currentLayout.showContact },
            ].map((section) => (
              <div
                key={section.key}
                className={`p-4 rounded-lg border flex items-center justify-between ${
                  section.value ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <span className="font-medium">{section.label}</span>
                {section.value ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Mevcut Ayarlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Header: {currentLayout.headerStyle}</Badge>
            <Badge variant="outline">Footer: {currentLayout.footerStyle}</Badge>
            <Badge variant="outline">Grid: {currentLayout.productGridCols} sütun</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
