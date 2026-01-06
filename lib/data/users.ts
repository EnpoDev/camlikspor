import { prisma } from "@/lib/prisma";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      dealer: { select: { id: true, name: true } },
      permissions: true,
      trainer: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });
}
