"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const incomeItemSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
});

export type IncomeItemFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createIncomeItemAction(
  _prevState: IncomeItemFormState,
  formData: FormData
): Promise<IncomeItemFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = incomeItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.incomeItem.create({
      data: {
        dealerId: session.user.dealerId,
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/income-items");
    return { message: "Gelir kalemi başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create income item error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateIncomeItemAction(
  id: string,
  _prevState: IncomeItemFormState,
  formData: FormData
): Promise<IncomeItemFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = incomeItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.incomeItem.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/income-items");
    return { message: "Gelir kalemi başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update income item error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteIncomeItemAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.incomeItem.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/[locale]/settings/income-items");
    return { message: "Gelir kalemi silindi", success: true };
  } catch (error) {
    console.error("Delete income item error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
