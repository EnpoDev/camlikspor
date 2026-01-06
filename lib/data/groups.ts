import { prisma } from "@/lib/prisma";

export async function getGroupById(id: string) {
  return prisma.group.findUnique({
    where: { id },
    include: {
      dealer: { select: { name: true } },
      branch: { select: { id: true, name: true } },
      facility: { select: { id: true, name: true } },
      period: { select: { id: true, name: true } },
      schedules: true,
      students: {
        where: { isActive: true },
        include: {
          student: {
            select: { id: true, firstName: true, lastName: true, studentNumber: true },
          },
        },
      },
      trainers: {
        include: {
          trainer: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
    },
  });
}
