import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface StudentFilters {
  branchId?: string;
  locationId?: string;
  facilityId?: string;
  groupId?: string;
  search?: string;
  dealerId?: string;
  isActive?: boolean;
}

export interface StudentListItem {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  parentPhone: string;
  isActive: boolean;
  branch: { id: string; name: string };
  facility: { id: string; name: string };
  registrationDate: Date;
}

export async function getStudents(
  filters: StudentFilters,
  page = 1,
  pageSize = 10
): Promise<{ data: StudentListItem[]; total: number }> {
  const where: Prisma.StudentWhereInput = {
    ...(filters.dealerId ? { dealerId: filters.dealerId } : {}),
    ...(filters.branchId ? { branchId: filters.branchId } : {}),
    ...(filters.locationId ? { locationId: filters.locationId } : {}),
    ...(filters.facilityId ? { facilityId: filters.facilityId } : {}),
    ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
    ...(filters.groupId
      ? { groups: { some: { groupId: filters.groupId, isActive: true } } }
      : {}),
    ...(filters.search
      ? {
          OR: [
            { firstName: { contains: filters.search } },
            { lastName: { contains: filters.search } },
            { studentNumber: { contains: filters.search } },
            { parentPhone: { contains: filters.search } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.student.findMany({
      where,
      select: {
        id: true,
        studentNumber: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        parentPhone: true,
        isActive: true,
        registrationDate: true,
        branch: { select: { id: true, name: true } },
        facility: { select: { id: true, name: true } },
      },
      orderBy: { registrationDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.student.count({ where }),
  ]);

  return { data, total };
}

export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      dealer: { select: { name: true } },
      branch: { select: { id: true, name: true } },
      location: { select: { id: true, name: true } },
      facility: { select: { id: true, name: true } },
      discountType: { select: { id: true, name: true, percentage: true } },
      groups: {
        where: { isActive: true },
        include: {
          group: {
            select: { id: true, name: true },
          },
        },
      },
      payments: {
        orderBy: { dueDate: "desc" },
        take: 10,
      },
      attendances: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          session: {
            select: { date: true, group: { select: { name: true } } },
          },
        },
      },
    },
  });
}

export async function generateStudentNumber(dealerId: string): Promise<string> {
  const year = new Date().getFullYear().toString().slice(-2);
  const lastStudent = await prisma.student.findFirst({
    where: {
      dealerId,
      studentNumber: { startsWith: year },
    },
    orderBy: { studentNumber: "desc" },
  });

  if (lastStudent) {
    const lastNumber = parseInt(lastStudent.studentNumber.slice(2)) || 0;
    return `${year}${(lastNumber + 1).toString().padStart(4, "0")}`;
  }

  return `${year}0001`;
}
