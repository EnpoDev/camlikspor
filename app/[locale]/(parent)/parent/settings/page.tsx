import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ParentSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/parent-login");

  const parent = await prisma.parent.findUnique({
    where: { id: session.user.id },
  });

  if (!parent) redirect("/parent-login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground">
          Hesap bilgilerinizi ve tercihlerinizi yönetin
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
          <CardDescription>
            Kişisel bilgilerinizi görüntüleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Ad Soyad</Label>
              <Input value={parent.name} disabled className="mt-1" />
            </div>
            <div>
              <Label>E-posta</Label>
              <Input value={parent.email} disabled className="mt-1" />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input value={parent.phone} disabled className="mt-1" />
            </div>
            <div>
              <Label>TC Kimlik No</Label>
              <Input
                value={parent.tcKimlikNo || "-"}
                disabled
                className="mt-1"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Bilgilerinizi güncellemek için okul yönetimiyle iletişime geçin.
          </p>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Şifre Değiştir</CardTitle>
          <CardDescription>
            Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/parent/parent/change-password">
            <Button>Şifre Değiştir</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Hesap Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Son Giriş:</span>
            <span className="font-medium">
              {parent.lastLoginAt
                ? new Date(parent.lastLoginAt).toLocaleDateString("tr-TR")
                : "Henüz giriş yapılmadı"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hesap Durumu:</span>
            <span className="font-medium">
              {parent.isActive ? "Aktif" : "Pasif"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Future Features */}
      <Card className="bg-slate-50 dark:bg-slate-900">
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
