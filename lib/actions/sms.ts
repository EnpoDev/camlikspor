"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { sendSms, getSmsBalance } from "@/lib/services/netgsm";

export interface SendSmsResult {
  success: boolean;
  message: string;
  jobId?: string;
}

export interface SmsBalanceResult {
  success: boolean;
  balance?: number;
  message?: string;
}

/**
 * Send SMS to a list of phone numbers
 */
export async function sendSmsAction(
  recipients: string[],
  message: string,
  options?: {
    title?: string;
    groupId?: string;
    branchId?: string;
    facilityId?: string;
  }
): Promise<SendSmsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  const dealerId = session.user.dealerId;

  if (!dealerId) {
    return { success: false, message: session.user.role === UserRole.SUPER_ADMIN
      ? "SMS göndermek için bir bayi seçmelisiniz"
      : "Yetkisiz işlem" };
  }

  if (!recipients.length) {
    return { success: false, message: "En az bir alıcı gerekli" };
  }

  if (!message.trim()) {
    return { success: false, message: "Mesaj metni gerekli" };
  }

  try {
    // Check if NetGSM is enabled for this dealer
    if (dealerId) {
      const settings = await prisma.dealerSettings.findUnique({
        where: { dealerId },
      });

      if (!settings?.netgsmEnabled) {
        return {
          success: false,
          message: "SMS servisi bu hesap için aktif değil. Lütfen ayarlardan etkinleştirin.",
        };
      }
    }

    // Send SMS via NetGSM
    const result = await sendSms({
      recipients,
      message,
      title: options?.title,
    });

    if (!result.success) {
      // Log failed attempt
      await prisma.smsMessage.create({
        data: {
          dealerId: dealerId,
          recipients: JSON.stringify(recipients),
          recipientCount: recipients.length,
          message,
          title: options?.title,
          branchId: options?.branchId,
          facilityId: options?.facilityId,
          status: "FAILED",
          errorMessage: result.errorMessage,
          createdByUserId: session.user.id,
        },
      });

      return {
        success: false,
        message: result.errorMessage || "SMS gönderilemedi",
      };
    }

    // Log successful send
    await prisma.smsMessage.create({
      data: {
        dealerId: dealerId,
        recipients: JSON.stringify(recipients),
        recipientCount: recipients.length,
        message,
        title: options?.title,
        branchId: options?.branchId,
        facilityId: options?.facilityId,
        status: "SENT",
        netgsmJobId: result.jobId,
        sentAt: new Date(),
        createdByUserId: session.user.id,
      },
    });

    revalidatePath("/sms");

    return {
      success: true,
      message: `${recipients.length} kişiye SMS başarıyla gönderildi`,
      jobId: result.jobId,
    };
  } catch (error) {
    console.error("Send SMS error:", error);
    return {
      success: false,
      message: "SMS gönderilirken bir hata oluştu",
    };
  }
}

/**
 * Get SMS balance for the dealer
 */
export async function getSmsBalanceAction(): Promise<SmsBalanceResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  try {
    const result = await getSmsBalance();

    if (!result.success) {
      return {
        success: false,
        message: result.errorMessage || "Bakiye sorgulanamadı",
      };
    }

    return {
      success: true,
      balance: result.balance,
    };
  } catch (error) {
    console.error("Get SMS balance error:", error);
    return {
      success: false,
      message: "Bakiye sorgulanırken bir hata oluştu",
    };
  }
}

/**
 * Get SMS history for the dealer
 */
export async function getSmsHistory(page: number = 1, limit: number = 20) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, messages: [], total: 0 };
  }

  const dealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? undefined
      : session.user.dealerId;

  try {
    const where = dealerId ? { dealerId } : {};

    const [messages, total] = await Promise.all([
      prisma.smsMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.smsMessage.count({ where }),
    ]);

    return {
      success: true,
      messages,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Get SMS history error:", error);
    return { success: false, messages: [], total: 0 };
  }
}

/**
 * Get SMS statistics for the current month
 */
export async function getSmsStats() {
  const session = await auth();

  if (!session?.user?.id) {
    return { sent: 0, failed: 0, total: 0 };
  }

  const dealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? undefined
      : session.user.dealerId;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  try {
    const where = {
      ...(dealerId ? { dealerId } : {}),
      createdAt: { gte: startOfMonth },
    };

    const [sent, failed] = await Promise.all([
      prisma.smsMessage.aggregate({
        where: { ...where, status: "SENT" },
        _sum: { recipientCount: true },
      }),
      prisma.smsMessage.aggregate({
        where: { ...where, status: "FAILED" },
        _sum: { recipientCount: true },
      }),
    ]);

    return {
      sent: sent._sum.recipientCount || 0,
      failed: failed._sum.recipientCount || 0,
      total: (sent._sum.recipientCount || 0) + (failed._sum.recipientCount || 0),
    };
  } catch (error) {
    console.error("Get SMS stats error:", error);
    return { sent: 0, failed: 0, total: 0 };
  }
}
