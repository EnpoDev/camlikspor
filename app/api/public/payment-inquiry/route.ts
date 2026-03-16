import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateStudentPaymentSummary } from "@/lib/utils/payment-calculations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    console.log("Payment inquiry request:", { query });

    if (!query) {
      return NextResponse.json(
        { error: "TC Kimlik No veya Telefon No gerekli" },
        { status: 400 }
      );
    }

    // Search for student by TC or phone (any dealer)
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { tcKimlikNo: query.toString().trim() },
          { phone: query.toString().trim() },
          { parentPhone: query.toString().trim() },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        tcKimlikNo: true,
        dealerId: true,
      },
    });

    console.log("Student search result:", student ? "Found" : "Not found");

    if (!student) {
      return NextResponse.json(
        { error: "Öğrenci bulunamadı. Lütfen TC Kimlik No veya Telefon No'yu kontrol edin." },
        { status: 404 }
      );
    }

    // Get all payments for this student
    const payments = await prisma.payment.findMany({
      where: {
        studentId: student.id,
      },
      orderBy: {
        dueDate: "desc",
      },
    });

    console.log("Payments found:", payments.length);

    // Calculate payment summary including future payments
    const paymentSummary = await calculateStudentPaymentSummary(student.id);

    // Helper function to create period name
    const getPeriodName = (payment: any) => {
      if (payment.periodMonth && payment.periodYear) {
        const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
                       "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        return `${months[payment.periodMonth - 1]} ${payment.periodYear}`;
      }
      return payment.description || payment.type || "Genel";
    };

    // Separate pending and paid payments
    const pendingPayments = payments
      .filter((p) => p.status !== "COMPLETED")
      .map((p) => ({
        id: p.id,
        studentName: `${student.firstName} ${student.lastName}`,
        amount: Number(p.amount),
        dueDate: p.dueDate.toISOString(),
        paidAt: p.paidAt?.toISOString() || null,
        status: p.status,
        periodName: getPeriodName(p),
      }));

    const paidPayments = payments
      .filter((p) => p.status === "COMPLETED")
      .map((p) => ({
        id: p.id,
        studentName: `${student.firstName} ${student.lastName}`,
        amount: Number(p.amount),
        dueDate: p.dueDate.toISOString(),
        paidAt: p.paidAt?.toISOString() || null,
        status: p.status,
        periodName: getPeriodName(p),
      }));

    const result = {
      studentName: `${student.firstName} ${student.lastName}`,
      studentId: student.id,
      totalDebt: paymentSummary.totalDebt,
      currentMonthDebt: paymentSummary.currentMonthDebt,
      futurePaymentsTotal: paymentSummary.futurePaymentsTotal,
      totalPaid: paymentSummary.paidTotal,
      pendingPayments,
      paidPayments,
      futurePayments: paymentSummary.futurePayments.map((fp) => ({
        month: fp.month,
        year: fp.year,
        amount: fp.amount,
        dueDate: fp.dueDate.toISOString(),
        periodName: fp.periodName,
      })),
    };

    console.log("Sending result:", {
      studentName: result.studentName,
      totalDebt: result.totalDebt,
      currentMonthDebt: result.currentMonthDebt,
      futurePaymentsTotal: result.futurePaymentsTotal,
      totalPaid: result.totalPaid,
      pendingCount: pendingPayments.length,
      paidCount: paidPayments.length,
      futurePaymentsCount: result.futurePayments.length
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment inquiry error:", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Sorgulama sırasında bir hata oluştu: ${errorMessage}` },
      { status: 500 }
    );
  }
}
