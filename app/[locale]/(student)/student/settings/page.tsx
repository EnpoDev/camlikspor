import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import {
  User,
  Phone,
  BookOpen,
  Shield,
  MapPin,
  Calendar,
  Hash,
  Activity,
  Lock,
} from "lucide-react";

const genderLabel: Record<string, string> = {
  MALE: "Erkek",
  FEMALE: "Kadın",
  OTHER: "Diğer",
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-slate-800 last:border-0">
      <span className="text-slate-400 text-sm min-w-[160px]">{label}</span>
      <span className="text-white text-sm font-medium">{value || "-"}</span>
    </div>
  );
}

export default async function StudentSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/student-login");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const student = await prisma.student.findFirst({
    where: { email: session.user.email! },
    include: {
      branch: true,
      location: true,
      facility: true,
    },
  });

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Öğrenci kaydı bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Hesap Ayarları</h1>
            <p className="text-slate-400 text-sm">
              {student.firstName} {student.lastName} &mdash; No: {student.studentNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" />
              Kişisel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Ad" value={student.firstName} />
            <InfoRow label="Soyad" value={student.lastName} />
            <InfoRow
              label="Doğum Tarihi"
              value={
                student.birthDate
                  ? format(new Date(student.birthDate), "dd MMMM yyyy", {
                      locale: tr,
                    })
                  : "-"
              }
            />
            <InfoRow
              label="Cinsiyet"
              value={genderLabel[student.gender] ?? student.gender}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Phone className="h-4 w-4 text-primary" />
              İletişim Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="E-posta" value={student.email} />
            <InfoRow label="Telefon" value={student.phone} />
            <InfoRow
              label="Adres"
              value={
                student.address ? (
                  <span className="flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                    {student.address}
                  </span>
                ) : (
                  "-"
                )
              }
            />
          </CardContent>
        </Card>

        {/* Registration Information */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              Kayıt Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow
              label="Öğrenci No"
              value={
                <span className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5 text-slate-400" />
                  {student.studentNumber}
                </span>
              }
            />
            <InfoRow label="Branş" value={student.branch?.name} />
            <InfoRow label="Lokasyon" value={student.location?.name} />
            <InfoRow label="Tesis" value={student.facility?.name} />
            <InfoRow
              label="Kayıt Tarihi"
              value={
                student.registrationDate
                  ? format(new Date(student.registrationDate), "dd MMMM yyyy", {
                      locale: tr,
                    })
                  : "-"
              }
            />
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-primary" />
              Hesap Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow
              label="Son Giriş"
              value={
                student.lastLoginAt
                  ? format(new Date(student.lastLoginAt), "dd MMMM yyyy HH:mm", {
                      locale: tr,
                    })
                  : "-"
              }
            />
            <InfoRow
              label="Durum"
              value={
                student.isActive ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-900/40 text-green-400 border-green-700"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Aktif
                  </Badge>
                ) : (
                  <Badge variant="destructive">Pasif</Badge>
                )
              }
            />
            <InfoRow
              label="Hesap Oluşturma"
              value={
                student.createdAt
                  ? format(new Date(student.createdAt), "dd MMMM yyyy", {
                      locale: tr,
                    })
                  : "-"
              }
            />
            <div className="pt-3">
              <Link
                href="./change-password"
                className="inline-flex items-center gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition-colors"
              >
                <Lock className="h-4 w-4" />
                Şifre Değiştir
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Read-only notice */}
      <Card className="bg-slate-900 border-slate-700 border-l-4 border-l-slate-600">
        <CardContent className="pt-5">
          <p className="text-sm text-slate-400">
            Kişisel ve iletişim bilgilerinizi güncellemek için lütfen antrenörünüz
            veya okul yönetimiyle iletişime geçin.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
