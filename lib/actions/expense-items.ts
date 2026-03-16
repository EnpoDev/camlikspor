"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const expenseItemSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
});

export type ExpenseItemFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createExpenseItemAction(
  _prevState: ExpenseItemFormState,
  formData: FormData
): Promise<ExpenseItemFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = expenseItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.expenseItem.create({
      data: {
        dealerId: session.user.dealerId,
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/expense-items");
    return { message: "Gider kalemi başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create expense item error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateExpenseItemAction(
  id: string,
  _prevState: ExpenseItemFormState,
  formData: FormData
): Promise<ExpenseItemFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = expenseItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.expenseItem.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/expense-items");
    return { message: "Gider kalemi başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update expense item error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteExpenseItemAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.expenseItem.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/[locale]/settings/expense-items");
    return { message: "Gider kalemi silindi", success: true };
  } catch (error) {
    console.error("Delete expense item error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
