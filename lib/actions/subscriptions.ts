"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface SubscriptionResult {
  success: boolean;
  message: string;
}

/**
 * Get all subscription plans
 */
export async function getSubscriptionPlans(publicOnly: boolean = true) {
  try {
    const where = publicOnly
      ? { isActive: true, isPublic: true }
      : { isActive: true };

    const plans = await prisma.subscriptionPlan.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return plans.map((plan) => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : [],
    }));
  } catch (error) {
    console.error("Get subscription plans error:", error);
    return [];
  }
}

/**
 * Get dealer's current subscription
 */
export async function getDealerSubscription(dealerId: string) {
  try {
    const subscription = await prisma.dealerSubscription.findUnique({
      where: { dealerId },
      include: {
        plan: true,
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!subscription) return null;

    return {
      ...subscription,
      plan: {
        ...subscription.plan,
        features: subscription.plan.features
          ? JSON.parse(subscription.plan.features)
          : [],
      },
    };
  } catch (error) {
    console.error("Get dealer subscription error:", error);
    return null;
  }
}

/**
 * Create a new subscription for dealer (with trial)
 */
export async function createSubscription(
  dealerId: string,
  planId: string
): Promise<SubscriptionResult> {
  try {
    // Check if dealer already has a subscription
    const existing = await prisma.dealerSubscription.findUnique({
      where: { dealerId },
    });

    if (existing) {
      return { success: false, message: "Bu bayinin zaten bir aboneliği var" };
    }

    // Get the plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return { success: false, message: "Geçersiz plan" };
    }

    // Calculate trial period
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + plan.trialDays);

    // Create subscription
    await prisma.dealerSubscription.create({
      data: {
        dealerId,
        planId,
        status: plan.trialDays > 0 ? "TRIAL" : "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
        trialEndsAt: plan.trialDays > 0 ? trialEnd : null,
        billingCycle: "monthly",
      },
    });

    revalidatePath("/admin/dealers");
    revalidatePath("/settings/subscription");

    return { success: true, message: "Abonelik oluşturuldu" };
  } catch (error) {
    console.error("Create subscription error:", error);
    return { success: false, message: "Abonelik oluşturulurken hata oluştu" };
  }
}

/**
 * Upgrade/downgrade subscription plan
 */
export async function changePlan(
  subscriptionId: string,
  newPlanId: string
): Promise<SubscriptionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  try {
    const subscription = await prisma.dealerSubscription.findUnique({
      where: { id: subscriptionId },
      include: { dealer: true },
    });

    if (!subscription) {
      return { success: false, message: "Abonelik bulunamadı" };
    }

    // Check permission
    if (
      session.user.role !== UserRole.SUPER_ADMIN &&
      session.user.dealerId !== subscription.dealerId
    ) {
      return { success: false, message: "Yetkisiz işlem" };
    }

    const newPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: newPlanId },
    });

    if (!newPlan || !newPlan.isActive) {
      return { success: false, message: "Geçersiz plan" };
    }

    // Update subscription
    await prisma.dealerSubscription.update({
      where: { id: subscriptionId },
      data: { planId: newPlanId },
    });

    revalidatePath("/settings/subscription");

    return { success: true, message: "Plan değiştirildi" };
  } catch (error) {
    console.error("Change plan error:", error);
    return { success: false, message: "Plan değiştirilirken hata oluştu" };
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  reason?: string
): Promise<SubscriptionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  try {
    const subscription = await prisma.dealerSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return { success: false, message: "Abonelik bulunamadı" };
    }

    if (
      session.user.role !== UserRole.SUPER_ADMIN &&
      session.user.dealerId !== subscription.dealerId
    ) {
      return { success: false, message: "Yetkisiz işlem" };
    }

    await prisma.dealerSubscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    revalidatePath("/settings/subscription");

    return {
      success: true,
      message: "Abonelik dönem sonunda iptal edilecek",
    };
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return { success: false, message: "Abonelik iptal edilirken hata oluştu" };
  }
}

/**
 * Update subscription usage counters
 */
export async function updateSubscriptionUsage(dealerId: string) {
  try {
    const [students, trainers, groups] = await Promise.all([
      prisma.student.count({ where: { dealerId, isActive: true } }),
      prisma.trainer.count({ where: { dealerId, isActive: true } }),
      prisma.group.count({ where: { dealerId, isActive: true } }),
    ]);

    await prisma.dealerSubscription.updateMany({
      where: { dealerId },
      data: {
        currentStudents: students,
        currentTrainers: trainers,
        currentGroups: groups,
      },
    });
  } catch (error) {
    console.error("Update subscription usage error:", error);
  }
}

/**
 * Check if dealer has reached limit
 */
export async function checkLimit(
  dealerId: string,
  limitType: "students" | "trainers" | "groups" | "sms" | "products"
): Promise<{ allowed: boolean; current: number; max: number }> {
  try {
    const subscription = await prisma.dealerSubscription.findUnique({
      where: { dealerId },
      include: { plan: true },
    });

    if (!subscription) {
      return { allowed: true, current: 0, max: 999999 }; // No subscription = unlimited (for now)
    }

    const limitMap = {
      students: {
        current: subscription.currentStudents,
        max: subscription.plan.maxStudents,
      },
      trainers: {
        current: subscription.currentTrainers,
        max: subscription.plan.maxTrainers,
      },
      groups: {
        current: subscription.currentGroups,
        max: subscription.plan.maxGroups,
      },
      sms: {
        current: subscription.currentSmsSent,
        max: subscription.plan.maxSmsPerMonth,
      },
      products: {
        current: await prisma.product.count({ where: { dealerId } }),
        max: subscription.plan.maxProducts,
      },
    };

    const limit = limitMap[limitType];
    return {
      allowed: limit.current < limit.max,
      current: limit.current,
      max: limit.max,
    };
  } catch (error) {
    console.error("Check limit error:", error);
    return { allowed: true, current: 0, max: 999999 };
  }
}

/**
 * Check if dealer has access to a feature
 */
export async function hasFeature(
  dealerId: string,
  feature: string
): Promise<boolean> {
  try {
    const subscription = await prisma.dealerSubscription.findUnique({
      where: { dealerId },
      include: { plan: true },
    });

    if (!subscription) return true; // No subscription = all features (for now)

    if (subscription.status === "CANCELLED" || subscription.status === "EXPIRED") {
      return false;
    }

    const features = subscription.plan.features
      ? JSON.parse(subscription.plan.features)
      : [];

    return features.includes(feature);
  } catch (error) {
    console.error("Check feature error:", error);
    return true;
  }
}

/**
 * Create subscription plan (admin only)
 */
export async function createSubscriptionPlan(data: {
  name: string;
  description?: string;
  slug: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  maxStudents: number;
  maxTrainers: number;
  maxGroups: number;
  maxSmsPerMonth: number;
  maxProducts: number;
  maxSubDealers: number;
  features: string[];
  trialDays: number;
}): Promise<SubscriptionResult> {
  const session = await auth();

  if (session?.user?.role !== UserRole.SUPER_ADMIN) {
    return { success: false, message: "Yetkisiz işlem" };
  }

  try {
    await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        description: data.description,
        slug: data.slug,
        monthlyPrice: data.monthlyPrice,
        yearlyPrice: data.yearlyPrice,
        maxStudents: data.maxStudents,
        maxTrainers: data.maxTrainers,
        maxGroups: data.maxGroups,
        maxSmsPerMonth: data.maxSmsPerMonth,
        maxProducts: data.maxProducts,
        maxSubDealers: data.maxSubDealers,
        features: JSON.stringify(data.features),
        trialDays: data.trialDays,
      },
    });

    revalidatePath("/admin/plans");

    return { success: true, message: "Plan oluşturuldu" };
  } catch (error) {
    console.error("Create subscription plan error:", error);
    return { success: false, message: "Plan oluşturulurken hata oluştu" };
  }
}
