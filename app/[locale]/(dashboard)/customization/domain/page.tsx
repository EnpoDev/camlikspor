import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Globe, Link2, CheckCircle, XCircle, ExternalLink, Info } from "lucide-react";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function DomainPage({ params }: Props) {
  const { locale } = await params;

  const session = await auth();
  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const dict = await getDictionary(locale);

  // Get dealer info
  const dealer = await prisma.dealer.findUnique({
    where: { id: session.user.dealerId },
    select: {
      slug: true,
      subdomain: true,
      customDomain: true,
      isPublicPageActive: true,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://futbolokullari.com";

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
            {dict.customization?.domain || "Domain Ayarları"}
          </h1>
          <p className="text-muted-foreground">
            {dict.customization?.domainDescription || "Özel domain ve subdomain ayarlarınızı yönetin"}
          </p>
        </div>
      </div>

      {/* Public Page Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Site Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Herkese Açık Sayfa</p>
              <p className="text-sm text-muted-foreground">
                Sitenizin ziyaretçilere görünüp görünmeyeceğini belirler
              </p>
            </div>
            <Badge
              variant={dealer?.isPublicPageActive ? "default" : "secondary"}
              className={dealer?.isPublicPageActive ? "bg-green-600" : ""}
            >
              {dealer?.isPublicPageActive ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Aktif</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" /> Pasif</>
              )}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Default URL */}
      <Card>
        <CardHeader>
          <CardTitle>Varsayılan URL</CardTitle>
          <CardDescription>
            Siteniz bu adresler üzerinden erişilebilir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm text-muted-foreground">Slug URL</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={`${baseUrl}/${locale}/${dealer?.slug || ""}`}
                  readOnly
                  className="bg-muted"
                />
                <Link href={`/${locale}/${dealer?.slug}`} target="_blank">
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subdomain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Subdomain
          </CardTitle>
          <CardDescription>
            Kendi subdomain adresinizi ayarlayın (ör: magaza.futbolokullari.com)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="magaza"
              defaultValue={dealer?.subdomain || ""}
              className="max-w-[200px]"
            />
            <span className="text-muted-foreground">.futbolokullari.com</span>
          </div>
          {dealer?.subdomain && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Subdomain Aktif</p>
                    <p className="text-sm text-green-700 mt-1">
                      Siteniz <strong>{dealer.subdomain}.futbolokullari.com</strong> adresinden erişilebilir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Button>Subdomain Kaydet</Button>
        </CardContent>
      </Card>

      {/* Custom Domain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Özel Domain
          </CardTitle>
          <CardDescription>
            Kendi domain adresinizi bağlayın (ör: www.magazam.com)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Domain Adresi</Label>
            <Input
              placeholder="www.magazam.com"
              defaultValue={dealer?.customDomain || ""}
              className="mt-1"
            />
          </div>

          {dealer?.customDomain ? (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Domain Bağlı</p>
                    <p className="text-sm text-green-700 mt-1">
                      Siteniz <strong>{dealer.customDomain}</strong> adresinden erişilebilir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">DNS Ayarları</p>
                    <p className="text-sm text-blue-700 mt-1 mb-2">
                      Özel domain kullanmak için DNS ayarlarınıza şu kaydı ekleyin:
                    </p>
                    <div className="bg-white p-3 rounded-lg font-mono text-sm text-slate-700">
                      <p><strong>Tür:</strong> CNAME</p>
                      <p><strong>Host:</strong> www (veya @)</p>
                      <p><strong>Hedef:</strong> cname.futbolokullari.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button>Domain Kaydet</Button>
        </CardContent>
      </Card>
    </div>
  );
}
