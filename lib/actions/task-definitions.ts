"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const taskDefinitionSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
});

export type TaskDefinitionFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createTaskDefinitionAction(
  _prevState: TaskDefinitionFormState,
  formData: FormData
): Promise<TaskDefinitionFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = taskDefinitionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.taskDefinition.create({
      data: {
        dealerId: session.user.dealerId,
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/task-definitions");
    return { message: "Görev tanımı başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create task definition error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateTaskDefinitionAction(
  id: string,
  _prevState: TaskDefinitionFormState,
  formData: FormData
): Promise<TaskDefinitionFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = taskDefinitionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.taskDefinition.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/task-definitions");
    return { message: "Görev tanımı başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update task definition error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteTaskDefinitionAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.taskDefinition.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/[locale]/settings/task-definitions");
    return { message: "Görev tanımı silindi", success: true };
  } catch (error) {
    console.error("Delete task definition error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
