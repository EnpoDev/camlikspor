import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getParentStudents, getStudentPaymentSummaryForParent } from "@/lib/actions/parents";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentSelector } from "@/components/parent/StudentSelector";
import { PaymentMethodBadge } from "@/components/parent/PaymentMethodBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PayOnlineButton } from "@/components/payment/PayOnlineButton";
import { format, isPast } from "date-fns";
import { tr } from "date-fns/locale";

export default async function ParentPaymentsPage({
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
  const paymentSummary = await getStudentPaymentSummaryForParent(selectedStudentId);

  const student = await prisma.student.findUnique({
    where: { id: selectedStudentId },
    select: { firstName: true, lastName: true, monthlyFee: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Aidat Takibi</h1>
        <p className="text-muted-foreground">Ödeme durumunuzu görüntüleyin</p>
      </div>

      <StudentSelector students={students} selectedId={selectedStudentId} />

      {/* Payment Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Borç</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {paymentSummary.totalDebt.toFixed(2)} ₺
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {paymentSummary.pendingPayments.length} ödeme bekliyor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ödenen Toplam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {paymentSummary.totalPaid.toFixed(2)} ₺
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {paymentSummary.completedPayments.length} ödeme yapıldı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aylık Ücret</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {student?.monthlyFee?.toFixed(2) || "0.00"} ₺
            </div>
            <p className="text-sm text-muted-foreground mt-1">Her ay</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Bekleyen Ödemeler</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentSummary.pendingPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Bekleyen ödeme bulunmuyor
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dönem</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Son Ödeme Tarihi</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentSummary.pendingPayments.map((payment) => {
                  const isOverdue = payment.dueDate && isPast(new Date(payment.dueDate));
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.periodMonth}/{payment.periodYear}
                      </TableCell>
                      <TableCell className="font-bold">
                        {payment.amount.toFixed(2)} ₺
                      </TableCell>
                      <TableCell>
                        {payment.dueDate
                          ? format(new Date(payment.dueDate), "dd MMMM yyyy", {
                              locale: tr,
                            })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {isOverdue ? (
                          <Badge variant="destructive">Gecikmiş</Badge>
                        ) : (
                          <Badge variant="secondary">Bekliyor</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <PayOnlineButton
                          paymentId={payment.id}
                          amount={payment.amount}
                          email={session.user.email || undefined}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Ödeme Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentSummary.completedPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Henüz ödeme kaydı bulunmuyor
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Dönem</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Yöntem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentSummary.completedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.paidAt
                        ? format(new Date(payment.paidAt), "dd MMMM yyyy", {
                            locale: tr,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {payment.periodMonth}/{payment.periodYear}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.amount.toFixed(2)} ₺
                    </TableCell>
                    <TableCell>
                      <PaymentMethodBadge method={payment.method as any} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Note about online payments */}
      <Card className="bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Not:</strong> Bekleyen odemelerinizi tablodaki &quot;Ode&quot; butonuyla kredi karti ile online olarak odeyebilirsiniz.
            Ayrica banka havalesi veya okulda nakit olarak da odeme yapabilirsiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
