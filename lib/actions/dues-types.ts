"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const duesTypeSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
});

export type DuesTypeFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createDuesTypeAction(
  _prevState: DuesTypeFormState,
  formData: FormData
): Promise<DuesTypeFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = duesTypeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.duesType.create({
      data: {
        dealerId: session.user.dealerId,
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/dues-types");
    return { message: "Aidat tipi başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create dues type error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateDuesTypeAction(
  id: string,
  _prevState: DuesTypeFormState,
  formData: FormData
): Promise<DuesTypeFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = duesTypeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.duesType.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/dues-types");
    return { message: "Aidat tipi başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update dues type error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteDuesTypeAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.duesType.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/[locale]/settings/dues-types");
    return { message: "Aidat tipi silindi", success: true };
  } catch (error) {
    console.error("Delete dues type error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
