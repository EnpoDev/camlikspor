"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface PayoutResult {
  success: boolean;
  message: string;
  payoutId?: string;
}

/**
 * Get pending commission payouts for a dealer
 */
export async function getPendingPayouts(dealerId?: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const effectiveDealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? dealerId
      : session.user.dealerId;

  if (!effectiveDealerId) return [];

  try {
    const pendingPayouts = await prisma.commissionTransaction.findMany({
      where: {
        status: "PENDING",
        commission: {
          parentDealerId: effectiveDealerId,
        },
      },
      include: {
        commission: {
          include: {
            childDealer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return pendingPayouts;
  } catch (error) {
    console.error("Get pending payouts error:", error);
    return [];
  }
}

/**
 * Get payout summary for dashboard
 */
export async function getPayoutSummary(dealerId?: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { pending: 0, paid: 0, totalPending: 0, totalPaid: 0 };
  }

  const effectiveDealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? dealerId
      : session.user.dealerId;

  if (!effectiveDealerId) {
    return { pending: 0, paid: 0, totalPending: 0, totalPaid: 0 };
  }

  try {
    const [pending, paid] = await Promise.all([
      prisma.commissionTransaction.aggregate({
        where: {
          status: "PENDING",
          commission: { parentDealerId: effectiveDealerId },
        },
        _count: true,
        _sum: { commissionAmount: true },
      }),
      prisma.commissionTransaction.aggregate({
        where: {
          status: "PAID",
          commission: { parentDealerId: effectiveDealerId },
        },
        _count: true,
        _sum: { commissionAmount: true },
      }),
    ]);

    return {
      pending: pending._count,
      paid: paid._count,
      totalPending: pending._sum.commissionAmount || 0,
      totalPaid: paid._sum.commissionAmount || 0,
    };
  } catch (error) {
    console.error("Get payout summary error:", error);
    return { pending: 0, paid: 0, totalPending: 0, totalPaid: 0 };
  }
}

/**
 * Mark commission transaction as paid
 */
export async function markAsPaid(
  transactionId: string
): Promise<PayoutResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  try {
    const transaction = await prisma.commissionTransaction.findUnique({
      where: { id: transactionId },
      include: {
        commission: true,
      },
    });

    if (!transaction) {
      return { success: false, message: "İşlem bulunamadı" };
    }

    // Check permission
    if (
      session.user.role !== UserRole.SUPER_ADMIN &&
      session.user.dealerId !== transaction.commission.parentDealerId
    ) {
      return { success: false, message: "Yetkisiz işlem" };
    }

    await prisma.commissionTransaction.update({
      where: { id: transactionId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    revalidatePath("/dealers/commissions");

    return { success: true, message: "Ödeme yapıldı olarak işaretlendi" };
  } catch (error) {
    console.error("Mark as paid error:", error);
    return { success: false, message: "İşlem sırasında hata oluştu" };
  }
}

/**
 * Process bulk payouts for a sub-dealer
 */
export async function processBulkPayout(
  childDealerId: string
): Promise<PayoutResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  const dealerId = session.user.dealerId;

  if (!dealerId && session.user.role !== UserRole.SUPER_ADMIN) {
    return { success: false, message: "Yetkisiz işlem" };
  }

  try {
    // Get all pending transactions for this child dealer
    const pendingTransactions = await prisma.commissionTransaction.findMany({
      where: {
        status: "PENDING",
        commission: {
          parentDealerId: dealerId!,
          childDealerId,
        },
      },
    });

    if (pendingTransactions.length === 0) {
      return { success: false, message: "Bekleyen ödeme bulunamadı" };
    }

    // Mark all as paid
    await prisma.commissionTransaction.updateMany({
      where: {
        id: { in: pendingTransactions.map((t) => t.id) },
      },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    const totalAmount = pendingTransactions.reduce(
      (sum, t) => sum + t.commissionAmount,
      0
    );

    revalidatePath("/dealers/commissions");

    return {
      success: true,
      message: `${pendingTransactions.length} ödeme işlendi. Toplam: ${totalAmount.toFixed(2)} TL`,
    };
  } catch (error) {
    console.error("Process bulk payout error:", error);
    return { success: false, message: "Toplu ödeme işlenirken hata oluştu" };
  }
}

/**
 * Get commission history
 */
export async function getCommissionHistory(options?: {
  page?: number;
  limit?: number;
  status?: string;
  childDealerId?: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { transactions: [], total: 0 };
  }

  const dealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? undefined
      : session.user.dealerId;

  const page = options?.page || 1;
  const limit = options?.limit || 20;

  try {
    const where = {
      ...(dealerId
        ? { commission: { parentDealerId: dealerId } }
        : {}),
      ...(options?.status ? { status: options.status } : {}),
      ...(options?.childDealerId
        ? { commission: { childDealerId: options.childDealerId } }
        : {}),
    };

    const [transactions, total] = await Promise.all([
      prisma.commissionTransaction.findMany({
        where,
        include: {
          commission: {
            include: {
              childDealer: {
                select: { id: true, name: true },
              },
            },
          },
          order: {
            select: {
              orderNumber: true,
              total: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.commissionTransaction.count({ where }),
    ]);

    return {
      transactions,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Get commission history error:", error);
    return { transactions: [], total: 0 };
  }
}

/**
 * Calculate and create commission for an order
 */
export async function calculateOrderCommission(orderId: string) {
  try {
    const order = await prisma.shopOrder.findUnique({
      where: { id: orderId },
      include: {
        dealer: {
          include: {
            commissionsAsChild: {
              where: { isActive: true },
              include: { parentDealer: true },
            },
          },
        },
      },
    });

    if (!order) return;

    // Check if dealer has a parent with commission settings
    const commissionSettings = order.dealer.commissionsAsChild[0];

    if (!commissionSettings) return;

    // Calculate commission
    const commissionRate = commissionSettings.orderCommissionRate;
    const fixedCommission = commissionSettings.fixedOrderCommission;

    const commissionAmount =
      (order.total * commissionRate) / 100 + fixedCommission;

    if (commissionAmount <= 0) return;

    // Create commission transaction
    await prisma.commissionTransaction.create({
      data: {
        commissionId: commissionSettings.id,
        orderId: order.id,
        orderTotal: order.total,
        commissionAmount,
        commissionRate,
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("Calculate order commission error:", error);
  }
}
