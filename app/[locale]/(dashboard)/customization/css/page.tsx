import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDealerTheme } from "@/lib/data/themes";
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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Code, AlertTriangle } from "lucide-react";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function CssPage({ params }: Props) {
  const { locale } = await params;

  const session = await auth();
  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const dict = await getDictionary(locale);
  const { customCss } = await getDealerTheme(session.user.dealerId);

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
            {dict.customization?.customCss || "Özel CSS"}
          </h1>
          <p className="text-muted-foreground">
            {dict.customization?.cssDescription || "Gelişmiş özelleştirme için kendi CSS kodunuzu ekleyin"}
          </p>
        </div>
      </div>

      {/* Warning */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Dikkat</p>
              <p className="text-sm text-amber-700 mt-1">
                Özel CSS kullanırken dikkatli olun. Yanlış CSS kodları sitenizin görünümünü bozabilir.
                Değişiklik yapmadan önce yedek almayı unutmayın.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            CSS Editörü
          </CardTitle>
          <CardDescription>
            Mağazanıza uygulanacak özel CSS kodlarını buraya yazın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            className="font-mono text-sm min-h-[400px] bg-slate-950 text-slate-50"
            placeholder={`/* Özel CSS kodlarınızı buraya yazın */

.hero-section {
  background: linear-gradient(to right, #10b981, #059669);
}

.product-card:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.btn-primary {
  border-radius: 9999px;
}`}
            defaultValue={customCss || ""}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {customCss ? `${customCss.length} karakter` : "Henüz CSS eklenmemiş"}
            </p>
            <div className="flex gap-2">
              <Button variant="outline">Önizle</Button>
              <Button>Kaydet</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS Tips */}
      <Card>
        <CardHeader>
          <CardTitle>CSS İpuçları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Renk Değiştirme</p>
              <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-x-auto">
{`:root {
  --primary: #10b981;
  --secondary: #6366f1;
}`}
              </pre>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Animasyon Ekleme</p>
              <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-x-auto">
{`.product-card {
  transition: all 0.3s ease;
}
.product-card:hover {
  transform: translateY(-4px);
}`}
              </pre>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Font Değiştirme</p>
              <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-x-auto">
{`body {
  font-family: 'Inter', sans-serif;
}
h1, h2, h3 {
  font-family: 'Poppins', sans-serif;
}`}
              </pre>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Buton Stilleri</p>
              <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-x-auto">
{`.btn {
  border-radius: 9999px;
  padding: 12px 24px;
  font-weight: 600;
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
