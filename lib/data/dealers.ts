import { prisma } from "@/lib/prisma";

export async function getDealerById(id: string) {
  return prisma.dealer.findUnique({
    where: { id },
    include: {
      settings: true,
      _count: {
        select: {
          users: true,
          students: { where: { isActive: true } },
          trainers: { where: { isActive: true } },
          groups: { where: { isActive: true } },
          branches: { where: { isActive: true } },
          locations: { where: { isActive: true } },
          facilities: { where: { isActive: true } },
        },
      },
    },
  });
}
