import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getParentStudents } from "@/lib/actions/parents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CreditCard, CheckCircle, XCircle } from "lucide-react";

export default async function ParentHomePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "PARENT") {
    redirect("/tr/parent-login");
  }

  const students = await getParentStudents(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Hos Geldiniz, {session.user.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Cocuklarinizin futbol okulu gelisimini buradan takip edebilirsiniz
        </p>
      </div>

      {/* Students Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {student.firstName} {student.lastName}
                  </CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {student.studentNumber}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Brans:</span>
                <span className="font-medium">{student.branch?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Sube:</span>
                <span className="font-medium">{student.location?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Tesis:</span>
                <span className="font-medium">{student.facility?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Durum:</span>
                <span className="flex items-center gap-1">
                  {student.isActive ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Aktif</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">Pasif</span>
                    </>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {students.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              Kayitli ogrenci bulunamadi
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Ders Programi
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Antrenman saatlerini gorun
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Devamsizlik
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Katilim durumunu gorun
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Aidat Takibi
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Odeme durumunu kontrol edin
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
