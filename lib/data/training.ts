import { prisma } from "@/lib/prisma";

export interface TrainingPlanFilters {
  dealerId: string;
  search?: string;
  focusArea?: string;
  difficulty?: string;
  status?: string;
}

export async function getTrainingPlans(
  filters: TrainingPlanFilters,
  page = 1,
  pageSize = 10
) {
  const where: Record<string, unknown> = {
    dealerId: filters.dealerId,
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  if (filters.focusArea) {
    where.focusArea = filters.focusArea;
  }

  if (filters.difficulty) {
    where.difficulty = filters.difficulty;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  const [data, total] = await Promise.all([
    prisma.trainingPlan.findMany({
      where,
      include: {
        _count: { select: { exercises: true, sessions: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.trainingPlan.count({ where }),
  ]);

  return { data, total };
}

export async function getTrainingPlanById(id: string, dealerId: string) {
  return prisma.trainingPlan.findFirst({
    where: { id, dealerId },
    include: {
      exercises: { orderBy: { orderIndex: "asc" } },
      sessions: {
        include: {
          group: { select: { id: true, name: true } },
        },
        orderBy: { date: "desc" },
      },
    },
  });
}

export interface TacticalBoardFilters {
  dealerId: string;
  search?: string;
  formation?: string;
}

export async function getTacticalBoards(
  filters: TacticalBoardFilters,
  page = 1,
  pageSize = 10
) {
  const where: Record<string, unknown> = {
    dealerId: filters.dealerId,
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  if (filters.formation) {
    where.formation = filters.formation;
  }

  const [data, total] = await Promise.all([
    prisma.tacticalBoard.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.tacticalBoard.count({ where }),
  ]);

  return { data, total };
}

export async function getTacticalBoardById(id: string, dealerId: string) {
  return prisma.tacticalBoard.findFirst({
    where: { id, dealerId },
  });
}

export async function getTrainingSessions(
  dealerId: string,
  dateFrom: Date,
  dateTo: Date
) {
  return prisma.trainingSession.findMany({
    where: {
      plan: { dealerId },
      date: { gte: dateFrom, lte: dateTo },
    },
    include: {
      plan: { select: { id: true, title: true, focusArea: true, duration: true } },
      group: { select: { id: true, name: true } },
    },
    orderBy: { date: "asc" },
  });
}

export async function getTrainingStats(dealerId: string) {
  const [totalPlans, activePlans, totalSessions, totalBoards] = await Promise.all([
    prisma.trainingPlan.count({ where: { dealerId } }),
    prisma.trainingPlan.count({ where: { dealerId, status: "PUBLISHED" } }),
    prisma.trainingSession.count({ where: { plan: { dealerId } } }),
    prisma.tacticalBoard.count({ where: { dealerId } }),
  ]);

  return { totalPlans, activePlans, totalSessions, totalBoards };
}
