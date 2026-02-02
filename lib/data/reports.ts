import { prisma } from "@/lib/prisma";

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  pendingPayments: number;
  overduePayments: number;
}

export interface StudentSummary {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  newThisMonth: number;
  withdrawnThisMonth: number;
}

export interface AttendanceSummary {
  totalSessions: number;
  averageAttendance: number;
  presentCount: number;
  absentCount: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  newStudents: number;
  withdrawals: number;
}

/**
 * Get financial summary for dealer
 */
export async function getFinancialSummary(
  dealerId: string,
  startDate?: Date,
  endDate?: Date
): Promise<FinancialSummary> {
  const dateFilter = {
    ...(startDate ? { createdAt: { gte: startDate } } : {}),
    ...(endDate ? { createdAt: { lte: endDate } } : {}),
  };

  const [income, expense, pendingPayments, overduePayments] = await Promise.all([
    // Total income from payments
    prisma.payment.aggregate({
      where: {
        dealerId,
        status: "COMPLETED",
        ...dateFilter,
      },
      _sum: { amount: true },
    }),
    // Total expense from cash transactions
    prisma.cashTransaction.aggregate({
      where: {
        dealerId,
        type: "EXPENSE",
        ...(startDate ? { date: { gte: startDate } } : {}),
        ...(endDate ? { date: { lte: endDate } } : {}),
      },
      _sum: { amount: true },
    }),
    // Pending payments amount
    prisma.payment.aggregate({
      where: {
        dealerId,
        status: "PENDING",
      },
      _sum: { amount: true },
    }),
    // Overdue payments amount
    prisma.payment.aggregate({
      where: {
        dealerId,
        status: "PENDING",
        dueDate: { lt: new Date() },
      },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = income._sum.amount || 0;
  const totalExpense = expense._sum.amount || 0;

  return {
    totalIncome,
    totalExpense,
    netIncome: totalIncome - totalExpense,
    pendingPayments: pendingPayments._sum.amount || 0,
    overduePayments: overduePayments._sum.amount || 0,
  };
}

/**
 * Get student summary for dealer
 */
export async function getStudentSummary(dealerId: string): Promise<StudentSummary> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [total, active, newThisMonth, withdrawnThisMonth] = await Promise.all([
    prisma.student.count({ where: { dealerId } }),
    prisma.student.count({ where: { dealerId, isActive: true } }),
    prisma.student.count({
      where: {
        dealerId,
        registrationDate: { gte: startOfMonth },
      },
    }),
    prisma.student.count({
      where: {
        dealerId,
        isActive: false,
        withdrawalDate: { gte: startOfMonth },
      },
    }),
  ]);

  return {
    totalStudents: total,
    activeStudents: active,
    inactiveStudents: total - active,
    newThisMonth,
    withdrawnThisMonth,
  };
}

/**
 * Get attendance summary for dealer
 */
export async function getAttendanceSummary(
  dealerId: string,
  startDate?: Date,
  endDate?: Date
): Promise<AttendanceSummary> {
  const dateFilter = {
    ...(startDate ? { date: { gte: startDate } } : {}),
    ...(endDate ? { date: { lte: endDate } } : {}),
  };

  const sessions = await prisma.attendanceSession.findMany({
    where: {
      group: { dealerId },
      ...dateFilter,
    },
    include: {
      _count: {
        select: { attendances: true },
      },
      attendances: {
        select: { status: true },
      },
    },
  });

  let presentCount = 0;
  let absentCount = 0;

  sessions.forEach((session) => {
    session.attendances.forEach((att) => {
      if (att.status === "PRESENT" || att.status === "LATE") {
        presentCount++;
      } else {
        absentCount++;
      }
    });
  });

  const totalAttendances = presentCount + absentCount;
  const averageAttendance =
    totalAttendances > 0 ? (presentCount / totalAttendances) * 100 : 0;

  return {
    totalSessions: sessions.length,
    averageAttendance: Math.round(averageAttendance * 10) / 10,
    presentCount,
    absentCount,
  };
}

/**
 * Get monthly data for charts
 */
export async function getMonthlyData(
  dealerId: string,
  months: number = 6
): Promise<MonthlyData[]> {
  const result: MonthlyData[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

    const monthName = startDate.toLocaleDateString("tr-TR", { month: "short" });

    const [income, expense, newStudents, withdrawals] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          dealerId,
          status: "COMPLETED",
          paidAt: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.cashTransaction.aggregate({
        where: {
          dealerId,
          type: "EXPENSE",
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.student.count({
        where: {
          dealerId,
          registrationDate: { gte: startDate, lte: endDate },
        },
      }),
      prisma.student.count({
        where: {
          dealerId,
          withdrawalDate: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    result.push({
      month: monthName,
      income: income._sum.amount || 0,
      expense: expense._sum.amount || 0,
      newStudents,
      withdrawals,
    });
  }

  return result;
}

/**
 * Get payment collection rate
 */
export async function getPaymentCollectionRate(dealerId: string): Promise<{
  rate: number;
  collected: number;
  total: number;
}> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);

  const [completed, total] = await Promise.all([
    prisma.payment.aggregate({
      where: {
        dealerId,
        status: "COMPLETED",
        dueDate: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: {
        dealerId,
        dueDate: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const collectedAmount = completed._sum.amount || 0;
  const totalAmount = total._sum.amount || 0;
  const rate = totalAmount > 0 ? (collectedAmount / totalAmount) * 100 : 0;

  return {
    rate: Math.round(rate * 10) / 10,
    collected: collectedAmount,
    total: totalAmount,
  };
}

/**
 * Get top groups by attendance
 */
export async function getTopGroupsByAttendance(
  dealerId: string,
  limit: number = 5
) {
  const groups = await prisma.group.findMany({
    where: { dealerId, isActive: true },
    include: {
      _count: {
        select: { students: { where: { isActive: true } } },
      },
      attendanceSessions: {
        take: 10,
        orderBy: { date: "desc" },
        include: {
          attendances: {
            select: { status: true },
          },
        },
      },
    },
    take: limit * 2, // Get more to filter
  });

  return groups
    .map((group) => {
      let present = 0;
      let total = 0;

      group.attendanceSessions.forEach((session) => {
        session.attendances.forEach((att) => {
          total++;
          if (att.status === "PRESENT" || att.status === "LATE") {
            present++;
          }
        });
      });

      return {
        id: group.id,
        name: group.name,
        studentCount: group._count.students,
        attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.attendanceRate - a.attendanceRate)
    .slice(0, limit);
}

/**
 * Get students with overdue payments
 */
export async function getStudentsWithOverduePayments(
  dealerId: string,
  limit: number = 10
) {
  const students = await prisma.student.findMany({
    where: {
      dealerId,
      isActive: true,
      payments: {
        some: {
          status: "PENDING",
          dueDate: { lt: new Date() },
        },
      },
    },
    include: {
      payments: {
        where: {
          status: "PENDING",
          dueDate: { lt: new Date() },
        },
        orderBy: { dueDate: "asc" },
      },
    },
    take: limit,
  });

  return students.map((student) => ({
    id: student.id,
    name: `${student.firstName} ${student.lastName}`,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    overdueAmount: student.payments.reduce((sum, p) => sum + p.amount, 0),
    oldestDueDate: student.payments[0]?.dueDate,
  }));
}
