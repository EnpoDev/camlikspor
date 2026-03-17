import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentPayments } from "@/lib/actions/students-portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethodBadge } from "@/components/parent/PaymentMethodBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { tr } from "date-fns/locale";
import { CreditCard, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";

export default async function StudentPaymentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/student-login");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const student = await prisma.student.findFirst({
    where: { email: session.user.email! },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      monthlyFee: true,
      studentNumber: true,
    },
  });

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Öğrenci kaydı bulunamadı.</p>
      </div>
    );
  }

  const paymentSummary = await getStudentPayments(student.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Ödeme Takibi</h1>
            <p className="text-slate-400 text-sm">
              {student.firstName} {student.lastName} &mdash; No: {student.studentNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              Toplam Borç
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">
              {paymentSummary.totalDebt.toFixed(2)} ₺
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {paymentSummary.pendingPayments.length} ödeme bekliyor
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Toplam Ödenen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {paymentSummary.totalPaid.toFixed(2)} ₺
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {paymentSummary.completedPayments.length} ödeme tamamlandı
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Aylık Aidat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {student.monthlyFee?.toFixed(2) ?? "0.00"} ₺
            </div>
            <p className="text-sm text-slate-400 mt-1">Her ay</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Bekleyen Ödemeler</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentSummary.pendingPayments.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Bekleyen ödeme bulunmuyor</p>
              <p className="text-sm mt-1">Tüm ödemeleriniz güncel.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-400">Dönem</TableHead>
                  <TableHead className="text-slate-400">Tutar</TableHead>
                  <TableHead className="text-slate-400">Son Ödeme Tarihi</TableHead>
                  <TableHead className="text-slate-400">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentSummary.pendingPayments.map((payment) => {
                  const isOverdue =
                    payment.dueDate && isPast(new Date(payment.dueDate));
                  return (
                    <TableRow key={payment.id} className="border-slate-800">
                      <TableCell className="text-slate-300">
                        {payment.periodMonth != null && payment.periodYear != null
                          ? `${payment.periodMonth}/${payment.periodYear}`
                          : "-"}
                      </TableCell>
                      <TableCell className="font-bold text-white">
                        {payment.amount.toFixed(2)} ₺
                      </TableCell>
                      <TableCell className="text-slate-300">
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
                          <Badge
                            variant="secondary"
                            className="bg-yellow-900/40 text-yellow-300 border-yellow-700"
                          >
                            Bekliyor
                          </Badge>
                        )}
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
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Ödeme Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentSummary.completedPayments.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Henüz ödeme kaydı bulunmuyor</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-400">Tarih</TableHead>
                  <TableHead className="text-slate-400">Dönem</TableHead>
                  <TableHead className="text-slate-400">Tutar</TableHead>
                  <TableHead className="text-slate-400">Yöntem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentSummary.completedPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-slate-800">
                    <TableCell className="text-slate-300">
                      {payment.paidAt
                        ? format(new Date(payment.paidAt), "dd MMMM yyyy", {
                            locale: tr,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {payment.periodMonth != null && payment.periodYear != null
                        ? `${payment.periodMonth}/${payment.periodYear}`
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium text-white">
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

      {/* Info note */}
      <Card className="bg-slate-900 border-slate-700 border-l-4 border-l-primary">
        <CardContent className="pt-5 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-white">Bilgi:</span> Ödemelerinizi banka
            havalesi veya okulda nakit olarak yapabilirsiniz. Online ödeme özelliği
            yakında eklenecektir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
