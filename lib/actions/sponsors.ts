"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const SPONSOR_TIERS = ["main", "official", "partner"] as const;
export type SponsorTier = (typeof SPONSOR_TIERS)[number];

// Tier sort priority: lower number = higher importance
const TIER_SORT_ORDER: Record<SponsorTier, number> = {
  main: 0,
  official: 1,
  partner: 2,
};

const sponsorSchema = z.object({
  name: z.string().min(1, "Sponsor adı zorunludur"),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
  tier: z.enum(SPONSOR_TIERS).default("partner"),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export type SponsorFormState = {
  errors?: { [key: string]: string[] };
  message?: string;
  messageKey?: string;
  success?: boolean;
};

// ============================================
// QUERIES
// ============================================

export async function getSponsorsByDealer(dealerId: string) {
  const sponsors = await prisma.sponsor.findMany({
    where: {
      dealerId,
      isVisible: true,
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
      name: true,
      logoUrl: true,
      websiteUrl: true,
      tier: true,
      isVisible: true,
      sortOrder: true,
    },
  });

  // Sort by tier priority, then sortOrder within the same tier
  return sponsors.sort((a, b) => {
    const tierDiff =
      (TIER_SORT_ORDER[a.tier as SponsorTier] ?? 99) -
      (TIER_SORT_ORDER[b.tier as SponsorTier] ?? 99);
    if (tierDiff !== 0) return tierDiff;
    return a.sortOrder - b.sortOrder;
  });
}

export async function getAllSponsorsByDealer(dealerId: string) {
  const sponsors = await prisma.sponsor.findMany({
    where: { dealerId },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });

  return sponsors.sort((a, b) => {
    const tierDiff =
      (TIER_SORT_ORDER[a.tier as SponsorTier] ?? 99) -
      (TIER_SORT_ORDER[b.tier as SponsorTier] ?? 99);
    if (tierDiff !== 0) return tierDiff;
    return a.sortOrder - b.sortOrder;
  });
}

// ============================================
// MUTATIONS
// ============================================

export async function createSponsor(
  _prevState: SponsorFormState,
  formData: FormData
): Promise<SponsorFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
    logoUrl: formData.get("logoUrl") as string,
    websiteUrl: formData.get("websiteUrl") as string,
    tier: (formData.get("tier") as string) || "partner",
    isVisible: formData.get("isVisible") !== "false",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const validated = sponsorSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      messageKey: "formValidationError",
      success: false,
    };
  }

  try {
    await prisma.sponsor.create({
      data: {
        dealerId: session.user.dealerId,
        name: validated.data.name,
        logoUrl: validated.data.logoUrl || null,
        websiteUrl: validated.data.websiteUrl || null,
        tier: validated.data.tier,
        isVisible: validated.data.isVisible,
        sortOrder: validated.data.sortOrder,
      },
    });

    revalidatePath("/[locale]/sponsors");
    return { messageKey: "sponsorCreated", success: true };
  } catch (error) {
    console.error("Create sponsor error:", error);
    return { messageKey: "sponsorCreateError", success: false };
  }
}

export async function updateSponsor(
  id: string,
  _prevState: SponsorFormState,
  formData: FormData
): Promise<SponsorFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  // Verify ownership
  const existing = await prisma.sponsor.findUnique({
    where: { id },
    select: { dealerId: true },
  });

  if (!existing || existing.dealerId !== session.user.dealerId) {
    return { messageKey: "notFound", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
    logoUrl: formData.get("logoUrl") as string,
    websiteUrl: formData.get("websiteUrl") as string,
    tier: (formData.get("tier") as string) || "partner",
    isVisible: formData.get("isVisible") !== "false",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const validated = sponsorSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      messageKey: "formValidationError",
      success: false,
    };
  }

  try {
    await prisma.sponsor.update({
      where: { id },
      data: {
        name: validated.data.name,
        logoUrl: validated.data.logoUrl || null,
        websiteUrl: validated.data.websiteUrl || null,
        tier: validated.data.tier,
        isVisible: validated.data.isVisible,
        sortOrder: validated.data.sortOrder,
      },
    });

    revalidatePath("/[locale]/sponsors");
    revalidatePath(`/[locale]/sponsors/${id}`);
    return { messageKey: "sponsorUpdated", success: true };
  } catch (error) {
    console.error("Update sponsor error:", error);
    return { messageKey: "sponsorUpdateError", success: false };
  }
}

export async function deleteSponsor(
  id: string
): Promise<{ success: boolean; messageKey: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  const existing = await prisma.sponsor.findUnique({
    where: { id },
    select: { dealerId: true },
  });

  if (!existing || existing.dealerId !== session.user.dealerId) {
    return { messageKey: "notFound", success: false };
  }

  try {
    await prisma.sponsor.delete({ where: { id } });

    revalidatePath("/[locale]/sponsors");
    return { messageKey: "sponsorDeleted", success: true };
  } catch (error) {
    console.error("Delete sponsor error:", error);
    return { messageKey: "sponsorDeleteError", success: false };
  }
}
