import { prisma } from "@/lib/prisma";

export async function getTrainerById(id: string) {
  return prisma.trainer.findUnique({
    where: { id },
    include: {
      dealer: { select: { name: true } },
      branches: {
        include: {
          branch: { select: { id: true, name: true } },
        },
      },
      groups: {
        include: {
          group: { select: { id: true, name: true } },
        },
      },
      salaryPayments: {
        orderBy: { createdAt: "desc" },
        take: 12,
      },
      user: {
        select: { id: true, email: true },
      },
    },
  });
}
