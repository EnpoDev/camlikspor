import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface PreRegistrationFilters {
  status?: string;
  search?: string;
  dealerId?: string;
}

export interface PreRegistrationListItem {
  id: string;
  firstName: string;
  lastName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  branchInterest: string | null;
  status: string;
  source: string | null;
  createdAt: Date;
}

export async function getPreRegistrations(
  filters: PreRegistrationFilters,
  page = 1,
  pageSize = 10
): Promise<{ data: PreRegistrationListItem[]; total: number }> {
  const where: Prisma.PreRegistrationWhereInput = {
    ...(filters.dealerId ? { dealerId: filters.dealerId } : {}),
    ...(filters.status && filters.status !== "ALL" ? { status: filters.status } : {}),
    ...(filters.search
      ? {
          OR: [
            { firstName: { contains: filters.search } },
            { lastName: { contains: filters.search } },
            { parentName: { contains: filters.search } },
            { parentPhone: { contains: filters.search } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.preRegistration.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        parentName: true,
        parentPhone: true,
        parentEmail: true,
        branchInterest: true,
        status: true,
        source: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.preRegistration.count({ where }),
  ]);

  return { data, total };
}

export async function getPreRegistrationById(id: string) {
  return prisma.preRegistration.findUnique({
    where: { id },
    include: {
      dealer: {
        select: { name: true },
      },
    },
  });
}

export async function createPreRegistration(
  dealerId: string,
  data: {
    firstName: string;
    lastName: string;
    birthDate?: Date;
    gender?: string;
    parentName: string;
    parentPhone: string;
    parentEmail?: string;
    branchInterest?: string;
    notes?: string;
    source?: string;
  }
) {
  return prisma.preRegistration.create({
    data: {
      dealerId,
      ...data,
    },
  });
}

export async function updatePreRegistration(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    gender?: string;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
    branchInterest?: string;
    notes?: string;
    source?: string;
    status?: string;
  }
) {
  return prisma.preRegistration.update({
    where: { id },
    data,
  });
}

export async function deletePreRegistration(id: string) {
  return prisma.preRegistration.delete({
    where: { id },
  });
}

export async function updatePreRegistrationStatus(
  id: string,
  status: string
) {
  return prisma.preRegistration.update({
    where: { id },
    data: { status },
  });
}
