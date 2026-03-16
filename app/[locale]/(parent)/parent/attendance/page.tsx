import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getParentStudents, getStudentAttendanceForParent } from "@/lib/actions/parents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentSelector } from "@/components/parent/StudentSelector";
import { AttendanceStatusBadge } from "@/components/parent/AttendanceStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default async function ParentAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/parent-login");

  const students = await getParentStudents(session.user.id);
  if (students.length === 0) {
    return <div>Kayıtlı öğrenci bulunamadı</div>;
  }

  const params = await searchParams;
  const selectedStudentId = params.studentId || students[0].id;
  const attendances = await getStudentAttendanceForParent(selectedStudentId, 50);

  const stats = {
    total: attendances.length,
    present: attendances.filter((a) => a.status === "PRESENT").length,
    absent: attendances.filter((a) => a.status === "ABSENT").length,
    late: attendances.filter((a) => a.status === "LATE").length,
    excused: attendances.filter((a) => a.status === "EXCUSED").length,
  };

  const attendanceRate = stats.total > 0
    ? Math.round((stats.present / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Yoklama Takibi</h1>
        <p className="text-muted-foreground">Çocuğunuzun ders katılım durumu</p>
      </div>

      <StudentSelector students={students} selectedId={selectedStudentId} />

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Katıldı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Devamsız</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Geç Kaldı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Katılım Oranı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yoklama Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          {attendances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Henüz yoklama kaydı bulunmuyor
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Grup</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Notlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>
                      {format(new Date(attendance.session.date), "dd MMMM yyyy", {
                        locale: tr,
                      })}
                    </TableCell>
                    <TableCell>{attendance.session.group?.name || "-"}</TableCell>
                    <TableCell>
                      <AttendanceStatusBadge status={attendance.status as any} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {attendance.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
