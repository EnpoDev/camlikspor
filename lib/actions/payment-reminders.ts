"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { sendSmsAction } from "./sms";

export interface ReminderResult {
  success: boolean;
  message: string;
  sentCount?: number;
  failedCount?: number;
}

/**
 * Get students with overdue payments for reminder
 */
export async function getOverduePaymentsForReminder(dealerId: string) {
  const overduePayments = await prisma.payment.findMany({
    where: {
      dealerId,
      status: "PENDING",
      dueDate: { lt: new Date() },
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          parentName: true,
          parentPhone: true,
        },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  // Group by student
  const studentMap = new Map<
    string,
    {
      student: {
        id: string;
        firstName: string;
        lastName: string;
        parentName: string;
        parentPhone: string;
      };
      totalAmount: number;
      oldestDueDate: Date;
      paymentCount: number;
    }
  >();

  overduePayments.forEach((payment) => {
    const existing = studentMap.get(payment.studentId);
    if (existing) {
      existing.totalAmount += payment.amount;
      existing.paymentCount += 1;
      if (new Date(payment.dueDate) < existing.oldestDueDate) {
        existing.oldestDueDate = new Date(payment.dueDate);
      }
    } else {
      studentMap.set(payment.studentId, {
        student: payment.student,
        totalAmount: payment.amount,
        oldestDueDate: new Date(payment.dueDate),
        paymentCount: 1,
      });
    }
  });

  return Array.from(studentMap.values());
}

/**
 * Get students with upcoming payments for reminder
 */
export async function getUpcomingPaymentsForReminder(
  dealerId: string,
  daysAhead: number = 3
) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const upcomingPayments = await prisma.payment.findMany({
    where: {
      dealerId,
      status: "PENDING",
      dueDate: {
        gte: now,
        lte: futureDate,
      },
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          parentName: true,
          parentPhone: true,
        },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  // Group by student
  const studentMap = new Map<
    string,
    {
      student: {
        id: string;
        firstName: string;
        lastName: string;
        parentName: string;
        parentPhone: string;
      };
      totalAmount: number;
      dueDate: Date;
      paymentCount: number;
    }
  >();

  upcomingPayments.forEach((payment) => {
    const existing = studentMap.get(payment.studentId);
    if (existing) {
      existing.totalAmount += payment.amount;
      existing.paymentCount += 1;
    } else {
      studentMap.set(payment.studentId, {
        student: payment.student,
        totalAmount: payment.amount,
        dueDate: new Date(payment.dueDate),
        paymentCount: 1,
      });
    }
  });

  return Array.from(studentMap.values());
}

/**
 * Send overdue payment reminders via SMS
 */
export async function sendOverdueReminders(): Promise<ReminderResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  const dealerId = session.user.dealerId;

  if (!dealerId) {
    return { success: false, message: session.user.role === UserRole.SUPER_ADMIN
      ? "Hatırlatma göndermek için bir bayi seçmelisiniz"
      : "Yetkisiz işlem" };
  }

  try {
    // Get dealer info for message
    const dealer = await prisma.dealer.findUnique({
      where: { id: dealerId },
      select: { name: true, phone: true },
    });

    if (!dealer) {
      return { success: false, message: "Bayi bulunamadı" };
    }

    const overdueStudents = await getOverduePaymentsForReminder(dealerId);

    if (overdueStudents.length === 0) {
      return {
        success: true,
        message: "Gecikmiş ödeme bulunamadı",
        sentCount: 0,
      };
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const item of overdueStudents) {
      const { student, totalAmount } = item;

      if (!student.parentPhone) {
        failedCount++;
        continue;
      }

      const formattedAmount = new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(totalAmount);

      const message = `Sayin ${student.parentName}, ${student.firstName} ${student.lastName} icin ${formattedAmount} tutarinda gecikmiş odemeniz bulunmaktadir. Bilgi icin: ${dealer.phone || dealer.name}`;

      const result = await sendSmsAction([student.parentPhone], message);

      if (result.success) {
        sentCount++;
      } else {
        failedCount++;
      }
    }

    return {
      success: true,
      message: `${sentCount} hatırlatma gönderildi, ${failedCount} başarısız`,
      sentCount,
      failedCount,
    };
  } catch (error) {
    console.error("Send overdue reminders error:", error);
    return { success: false, message: "Hatırlatmalar gönderilirken hata oluştu" };
  }
}

/**
 * Send upcoming payment reminders via SMS
 */
export async function sendUpcomingReminders(
  daysAhead: number = 3
): Promise<ReminderResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  const dealerId = session.user.dealerId;

  if (!dealerId) {
    return { success: false, message: session.user.role === UserRole.SUPER_ADMIN
      ? "Hatırlatma göndermek için bir bayi seçmelisiniz"
      : "Yetkisiz işlem" };
  }

  try {
    const dealer = await prisma.dealer.findUnique({
      where: { id: dealerId },
      select: { name: true, phone: true },
    });

    if (!dealer) {
      return { success: false, message: "Bayi bulunamadı" };
    }

    const upcomingStudents = await getUpcomingPaymentsForReminder(
      dealerId,
      daysAhead
    );

    if (upcomingStudents.length === 0) {
      return {
        success: true,
        message: "Yaklaşan ödeme bulunamadı",
        sentCount: 0,
      };
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const item of upcomingStudents) {
      const { student, totalAmount, dueDate } = item;

      if (!student.parentPhone) {
        failedCount++;
        continue;
      }

      const formattedAmount = new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(totalAmount);

      const formattedDate = dueDate.toLocaleDateString("tr-TR");

      const message = `Sayin ${student.parentName}, ${student.firstName} ${student.lastName} icin ${formattedDate} tarihinde ${formattedAmount} tutarinda odemeniz bulunmaktadir. Bilgi icin: ${dealer.phone || dealer.name}`;

      const result = await sendSmsAction([student.parentPhone], message);

      if (result.success) {
        sentCount++;
      } else {
        failedCount++;
      }
    }

    return {
      success: true,
      message: `${sentCount} hatırlatma gönderildi, ${failedCount} başarısız`,
      sentCount,
      failedCount,
    };
  } catch (error) {
    console.error("Send upcoming reminders error:", error);
    return { success: false, message: "Hatırlatmalar gönderilirken hata oluştu" };
  }
}

/**
 * Get reminder statistics
 */
export async function getReminderStats() {
  const session = await auth();

  if (!session?.user?.id) {
    return { overdue: 0, upcoming: 0, overdueAmount: 0, upcomingAmount: 0 };
  }

  const dealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? undefined
      : session.user.dealerId;

  if (!dealerId) {
    return { overdue: 0, upcoming: 0, overdueAmount: 0, upcomingAmount: 0 };
  }

  const now = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  try {
    const [overdue, upcoming] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          dealerId,
          status: "PENDING",
          dueDate: { lt: now },
        },
        _count: true,
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          dealerId,
          status: "PENDING",
          dueDate: { gte: now, lte: threeDaysLater },
        },
        _count: true,
        _sum: { amount: true },
      }),
    ]);

    return {
      overdue: overdue._count,
      upcoming: upcoming._count,
      overdueAmount: overdue._sum.amount || 0,
      upcomingAmount: upcoming._sum.amount || 0,
    };
  } catch (error) {
    console.error("Get reminder stats error:", error);
    return { overdue: 0, upcoming: 0, overdueAmount: 0, upcomingAmount: 0 };
  }
}
