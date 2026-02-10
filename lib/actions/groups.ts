"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const groupSchema = z.object({
  name: z.string().min(2, "Grup adi en az 2 karakter olmali"),
  description: z.string().optional(),
  branchId: z.string().min(1, "Brans secimi gerekli"),
  facilityId: z.string().min(1, "Tesis secimi gerekli"),
  periodId: z.string().min(1, "Donem secimi gerekli"),
  maxCapacity: z.number().min(1).default(20),
});

export type GroupFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createGroupAction(
  _prevState: GroupFormState,
  formData: FormData
): Promise<GroupFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    branchId: formData.get("branchId") as string,
    facilityId: formData.get("facilityId") as string,
    periodId: formData.get("periodId") as string,
    maxCapacity: parseInt(formData.get("maxCapacity") as string) || 20,
  };

  const validatedFields = groupSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    const group = await prisma.group.create({
      data: {
        dealerId: session.user.dealerId,
        name: validatedFields.data.name,
        description: validatedFields.data.description || null,
        branchId: validatedFields.data.branchId,
        facilityId: validatedFields.data.facilityId,
        periodId: validatedFields.data.periodId,
        maxCapacity: validatedFields.data.maxCapacity,
      },
    });

    const trainerIds = formData.getAll("trainerIds") as string[];
    const primaryTrainerId = formData.get("primaryTrainerId") as string;
    const allTrainerIds = [...new Set([...trainerIds, ...(primaryTrainerId ? [primaryTrainerId] : [])])];

    if (allTrainerIds.length > 0) {
      await prisma.trainerGroup.createMany({
        data: allTrainerIds.map((trainerId) => ({
          trainerId,
          groupId: group.id,
          isPrimary: trainerId === primaryTrainerId,
        })),
      });
    }

    revalidatePath("/[locale]/groups");
    return { message: "Grup basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create group error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateGroupAction(
  id: string,
  _prevState: GroupFormState,
  formData: FormData
): Promise<GroupFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    branchId: formData.get("branchId") as string,
    facilityId: formData.get("facilityId") as string,
    periodId: formData.get("periodId") as string,
    maxCapacity: parseInt(formData.get("maxCapacity") as string) || 20,
  };

  const validatedFields = groupSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.group.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description || null,
        branchId: validatedFields.data.branchId,
        facilityId: validatedFields.data.facilityId,
        periodId: validatedFields.data.periodId,
        maxCapacity: validatedFields.data.maxCapacity,
      },
    });

    const trainerIds = formData.getAll("trainerIds") as string[];
    const primaryTrainerId = formData.get("primaryTrainerId") as string;
    const allTrainerIds = [...new Set([...trainerIds, ...(primaryTrainerId ? [primaryTrainerId] : [])])];

    await prisma.trainerGroup.deleteMany({ where: { groupId: id } });

    if (allTrainerIds.length > 0) {
      await prisma.trainerGroup.createMany({
        data: allTrainerIds.map((trainerId) => ({
          trainerId,
          groupId: id,
          isPrimary: trainerId === primaryTrainerId,
        })),
      });
    }

    revalidatePath("/[locale]/groups");
    revalidatePath(`/[locale]/groups/${id}`);
    return { message: "Grup basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update group error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteGroupAction(id: string): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    // Check if group has active students
    const studentCount = await prisma.studentGroup.count({
      where: { groupId: id, isActive: true },
    });

    if (studentCount > 0) {
      return {
        message: `Bu grupta ${studentCount} aktif ogrenci var. Once ogrencileri baska gruplara aktarin.`,
        success: false,
      };
    }

    await prisma.group.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/[locale]/groups");
    return { message: "Grup silindi", success: true };
  } catch (error) {
    console.error("Delete group error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateGroupStudentsAction(
  _prevState: GroupFormState,
  formData: FormData
): Promise<GroupFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const groupId = formData.get("groupId") as string;
  const studentIds = formData.getAll("studentIds") as string[];

  if (!groupId) {
    return { message: "Grup bilgisi eksik", success: false };
  }

  try {
    // Verify the group belongs to this dealer
    const group = await prisma.group.findFirst({
      where: { id: groupId, dealerId: session.user.dealerId },
    });

    if (!group) {
      return { message: "Grup bulunamadi", success: false };
    }

    // Delete existing assignments and create new ones
    await prisma.studentGroup.deleteMany({ where: { groupId } });

    if (studentIds.length > 0) {
      await prisma.studentGroup.createMany({
        data: studentIds.map((studentId) => ({
          studentId,
          groupId,
        })),
      });
    }

    revalidatePath("/[locale]/groups");
    revalidatePath(`/[locale]/groups/${groupId}`);
    return { message: "Ogrenciler basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update group students error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function copyGroupAction(
  groupId: string
): Promise<{ success: boolean; message: string; newGroupId?: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    const originalGroup = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        schedules: true,
        trainers: true,
      },
    });

    if (!originalGroup) {
      return { message: "Grup bulunamadi", success: false };
    }

    type Schedule = (typeof originalGroup.schedules)[number];
    type TrainerGroup = (typeof originalGroup.trainers)[number];

    // Create new group with copied data
    const newGroup = await prisma.group.create({
      data: {
        dealerId: originalGroup.dealerId,
        name: `${originalGroup.name} (Kopya)`,
        branchId: originalGroup.branchId,
        facilityId: originalGroup.facilityId,
        periodId: originalGroup.periodId,
        description: originalGroup.description,
        maxCapacity: originalGroup.maxCapacity,
        schedules: {
          create: originalGroup.schedules.map((s: Schedule) => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        },
        trainers: {
          create: originalGroup.trainers.map((t: TrainerGroup) => ({
            trainerId: t.trainerId,
            isPrimary: t.isPrimary,
          })),
        },
      },
    });

    revalidatePath("/[locale]/groups");
    return {
      message: "Grup basariyla kopyalandi",
      success: true,
      newGroupId: newGroup.id,
    };
  } catch (error) {
    console.error("Copy group error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}
