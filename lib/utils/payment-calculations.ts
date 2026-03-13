import { prisma } from "@/lib/prisma";

export interface PaymentSummary {
  totalDebt: number;              // Toplam borç
  currentMonthDebt: number;        // Bu ay ödenecek
  futurePaymentsTotal: number;     // Gelecek aidatlar toplamı
  paidTotal: number;               // Toplam ödenen
  futurePayments: FuturePayment[]; // Gelecek ödemeler listesi
}

export interface FuturePayment {
  month: number;
  year: number;
  amount: number;
  dueDate: Date;
  periodName: string;
}

/**
 * Calculate comprehensive payment summary for a student
 * including current month debt, total debt, and future payments
 */
export async function calculateStudentPaymentSummary(
  studentId: string
): Promise<PaymentSummary> {
  // Get student with discount info
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      discountType: true,
    },
  });

  if (!student || !student.isActive) {
    return {
      totalDebt: 0,
      currentMonthDebt: 0,
      futurePaymentsTotal: 0,
      paidTotal: 0,
      futurePayments: [],
    };
  }

  // Get all existing payments
  const payments = await prisma.payment.findMany({
    where: { studentId },
    orderBy: { dueDate: "asc" },
  });

  // Calculate totals from existing payments
  const totalDebt = payments.reduce(
    (sum, p) => sum + (p.status === "PENDING" ? Number(p.amount) : 0),
    0
  );

  const paidTotal = payments.reduce(
    (sum, p) => sum + (p.status === "COMPLETED" ? Number(p.amount) : 0),
    0
  );

  // Get current date info
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  // Calculate current month debt (payments due this month that are pending)
  const currentMonthDebt = payments.reduce((sum, p) => {
    if (p.status !== "PENDING") return sum;
    const dueDate = new Date(p.dueDate);
    const dueMonth = dueDate.getMonth() + 1;
    const dueYear = dueDate.getFullYear();

    if (dueMonth === currentMonth && dueYear === currentYear) {
      return sum + Number(p.amount);
    }
    return sum;
  }, 0);

  // Get active student period
  const studentPeriod = await prisma.studentPeriod.findFirst({
    where: {
      studentId,
    },
    include: {
      period: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // If no active period, return current state
  if (!studentPeriod || !studentPeriod.period.isActive) {
    return {
      totalDebt,
      currentMonthDebt,
      futurePaymentsTotal: 0,
      paidTotal,
      futurePayments: [],
    };
  }

  const period = studentPeriod.period;
  const periodEndDate = new Date(period.endDate);

  // If period has ended, no future payments
  if (periodEndDate < now) {
    return {
      totalDebt,
      currentMonthDebt,
      futurePaymentsTotal: 0,
      paidTotal,
      futurePayments: [],
    };
  }

  // Calculate monthly fee with discount
  let monthlyFee = student.monthlyFee;
  if (student.discountType && student.discountType.percentage > 0) {
    const discountAmount = (monthlyFee * student.discountType.percentage) / 100;
    monthlyFee = monthlyFee - discountAmount;
  }

  // Generate future payments
  const futurePayments: FuturePayment[] = [];
  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  // Start from next month
  let checkDate = new Date(currentYear, currentMonth, 1); // First day of next month
  const endMonth = periodEndDate.getMonth() + 1;
  const endYear = periodEndDate.getFullYear();

  while (
    checkDate.getFullYear() < endYear ||
    (checkDate.getFullYear() === endYear && checkDate.getMonth() + 1 <= endMonth)
  ) {
    const month = checkDate.getMonth() + 1;
    const year = checkDate.getFullYear();

    // Check if payment already exists for this month
    const existingPayment = payments.find(
      (p) => p.periodMonth === month && p.periodYear === year
    );

    // Only add to future payments if no payment exists yet
    if (!existingPayment) {
      // Calculate due date (last day of the month)
      const dueDate = new Date(year, month, 0);

      futurePayments.push({
        month,
        year,
        amount: monthlyFee,
        dueDate,
        periodName: `${monthNames[month - 1]} ${year}`,
      });
    }

    // Move to next month
    checkDate.setMonth(checkDate.getMonth() + 1);
  }

  const futurePaymentsTotal = futurePayments.reduce(
    (sum, fp) => sum + fp.amount,
    0
  );

  return {
    totalDebt,
    currentMonthDebt,
    futurePaymentsTotal,
    paidTotal,
    futurePayments,
  };
}
