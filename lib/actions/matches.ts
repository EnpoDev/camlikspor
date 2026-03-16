"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const matchSchema = z.object({
  homeTeam: z.string().min(1, "Ev sahibi takım adı zorunludur"),
  awayTeam: z.string().min(1, "Deplasman takımı adı zorunludur"),
  homeScore: z.number().int().min(0).nullable().optional(),
  awayScore: z.number().int().min(0).nullable().optional(),
  matchDate: z.string().min(1, "Maç tarihi zorunludur"),
  venue: z.string().optional(),
  competition: z.string().optional(),
  matchType: z.enum(["HOME", "AWAY", "NEUTRAL"]).default("HOME"),
  status: z.enum(["UPCOMING", "LIVE", "COMPLETED", "CANCELLED"]).default("UPCOMING"),
  homeTeamLogo: z.string().optional(),
  awayTeamLogo: z.string().optional(),
  ticketUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
  notes: z.string().optional(),
});

export type MatchFormState = {
  errors?: { [key: string]: string[] };
  message?: string;
  messageKey?: string;
  success?: boolean;
};

// ============================================
// QUERIES
// ============================================

export async function getMatchesByDealer(dealerId: string) {
  return prisma.match.findMany({
    where: {
      dealerId,
      isVisible: true,
    },
    orderBy: [
      { matchDate: "desc" },
      { sortOrder: "asc" },
    ],
    select: {
      id: true,
      homeTeam: true,
      awayTeam: true,
      homeScore: true,
      awayScore: true,
      matchDate: true,
      venue: true,
      competition: true,
      matchType: true,
      status: true,
      homeTeamLogo: true,
      awayTeamLogo: true,
      ticketUrl: true,
      isVisible: true,
      sortOrder: true,
    },
  });
}

export async function getAllMatchesByDealer(dealerId: string) {
  return prisma.match.findMany({
    where: { dealerId },
    orderBy: [
      { matchDate: "desc" },
      { sortOrder: "asc" },
    ],
  });
}

// ============================================
// MUTATIONS
// ============================================

export async function createMatch(
  _prevState: MatchFormState,
  formData: FormData
): Promise<MatchFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  const rawData = {
    homeTeam: formData.get("homeTeam") as string,
    awayTeam: formData.get("awayTeam") as string,
    homeScore: formData.get("homeScore")
      ? parseInt(formData.get("homeScore") as string)
      : null,
    awayScore: formData.get("awayScore")
      ? parseInt(formData.get("awayScore") as string)
      : null,
    matchDate: formData.get("matchDate") as string,
    venue: formData.get("venue") as string,
    competition: formData.get("competition") as string,
    matchType: (formData.get("matchType") as string) || "HOME",
    status: (formData.get("status") as string) || "UPCOMING",
    homeTeamLogo: formData.get("homeTeamLogo") as string,
    awayTeamLogo: formData.get("awayTeamLogo") as string,
    ticketUrl: formData.get("ticketUrl") as string,
    isVisible: formData.get("isVisible") !== "false",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    notes: formData.get("notes") as string,
  };

  const validated = matchSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      messageKey: "formValidationError",
      success: false,
    };
  }

  try {
    await prisma.match.create({
      data: {
        dealerId: session.user.dealerId,
        homeTeam: validated.data.homeTeam,
        awayTeam: validated.data.awayTeam,
        homeScore: validated.data.homeScore ?? null,
        awayScore: validated.data.awayScore ?? null,
        matchDate: new Date(validated.data.matchDate),
        venue: validated.data.venue || null,
        competition: validated.data.competition || null,
        matchType: validated.data.matchType,
        status: validated.data.status,
        homeTeamLogo: validated.data.homeTeamLogo || null,
        awayTeamLogo: validated.data.awayTeamLogo || null,
        ticketUrl: validated.data.ticketUrl || null,
        isVisible: validated.data.isVisible,
        sortOrder: validated.data.sortOrder,
        notes: validated.data.notes || null,
      },
    });

    revalidatePath("/[locale]/matches");
    return { messageKey: "matchCreated", success: true };
  } catch (error) {
    console.error("Create match error:", error);
    return { messageKey: "matchCreateError", success: false };
  }
}

export async function updateMatch(
  id: string,
  _prevState: MatchFormState,
  formData: FormData
): Promise<MatchFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  // Verify ownership
  const existing = await prisma.match.findUnique({
    where: { id },
    select: { dealerId: true },
  });

  if (!existing || existing.dealerId !== session.user.dealerId) {
    return { messageKey: "notFound", success: false };
  }

  const rawData = {
    homeTeam: formData.get("homeTeam") as string,
    awayTeam: formData.get("awayTeam") as string,
    homeScore: formData.get("homeScore")
      ? parseInt(formData.get("homeScore") as string)
      : null,
    awayScore: formData.get("awayScore")
      ? parseInt(formData.get("awayScore") as string)
      : null,
    matchDate: formData.get("matchDate") as string,
    venue: formData.get("venue") as string,
    competition: formData.get("competition") as string,
    matchType: (formData.get("matchType") as string) || "HOME",
    status: (formData.get("status") as string) || "UPCOMING",
    homeTeamLogo: formData.get("homeTeamLogo") as string,
    awayTeamLogo: formData.get("awayTeamLogo") as string,
    ticketUrl: formData.get("ticketUrl") as string,
    isVisible: formData.get("isVisible") !== "false",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    notes: formData.get("notes") as string,
  };

  const validated = matchSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      messageKey: "formValidationError",
      success: false,
    };
  }

  try {
    await prisma.match.update({
      where: { id },
      data: {
        homeTeam: validated.data.homeTeam,
        awayTeam: validated.data.awayTeam,
        homeScore: validated.data.homeScore ?? null,
        awayScore: validated.data.awayScore ?? null,
        matchDate: new Date(validated.data.matchDate),
        venue: validated.data.venue || null,
        competition: validated.data.competition || null,
        matchType: validated.data.matchType,
        status: validated.data.status,
        homeTeamLogo: validated.data.homeTeamLogo || null,
        awayTeamLogo: validated.data.awayTeamLogo || null,
        ticketUrl: validated.data.ticketUrl || null,
        isVisible: validated.data.isVisible,
        sortOrder: validated.data.sortOrder,
        notes: validated.data.notes || null,
      },
    });

    revalidatePath("/[locale]/matches");
    revalidatePath(`/[locale]/matches/${id}`);
    return { messageKey: "matchUpdated", success: true };
  } catch (error) {
    console.error("Update match error:", error);
    return { messageKey: "matchUpdateError", success: false };
  }
}

export async function deleteMatch(
  id: string
): Promise<{ success: boolean; messageKey: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  const existing = await prisma.match.findUnique({
    where: { id },
    select: { dealerId: true },
  });

  if (!existing || existing.dealerId !== session.user.dealerId) {
    return { messageKey: "notFound", success: false };
  }

  try {
    await prisma.match.delete({ where: { id } });

    revalidatePath("/[locale]/matches");
    return { messageKey: "matchDeleted", success: true };
  } catch (error) {
    console.error("Delete match error:", error);
    return { messageKey: "matchDeleteError", success: false };
  }
}

export async function toggleMatchVisibility(
  id: string
): Promise<{ success: boolean; messageKey: string; isVisible?: boolean }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  const existing = await prisma.match.findUnique({
    where: { id },
    select: { dealerId: true, isVisible: true },
  });

  if (!existing || existing.dealerId !== session.user.dealerId) {
    return { messageKey: "notFound", success: false };
  }

  try {
    const updated = await prisma.match.update({
      where: { id },
      data: { isVisible: !existing.isVisible },
    });

    revalidatePath("/[locale]/matches");
    return {
      messageKey: updated.isVisible ? "matchVisible" : "matchHidden",
      success: true,
      isVisible: updated.isVisible,
    };
  } catch (error) {
    console.error("Toggle match visibility error:", error);
    return { messageKey: "matchUpdateError", success: false };
  }
}
