"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const incomeSchema = z.object({
  incomeItemId: z.string().min(1, "Gelir kalemi seçilmeli"),
  amount: z.coerce
    .number()
    .positive("Tutar 0'dan büyük olmalı")
    .min(0.01, "Tutar en az 0.01 olmalı"),
  date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selectedDate <= today;
  }, "Gelecek tarih seçilemez"),
  description: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD"]),
  receiptNumber: z.string().optional(),
});

export type IncomeFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createIncomeAction(
  _prevState: IncomeFormState,
  formData: FormData
): Promise<IncomeFormState> {
  const session = await auth();

  if (!session?.user?.dealerId || !session?.user?.id) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    incomeItemId: formData.get("incomeItemId") as string,
    amount: formData.get("amount") as string,
    date: formData.get("date") as string,
    description: formData.get("description") as string,
    paymentMethod: formData.get("paymentMethod") as string,
    receiptNumber: formData.get("receiptNumber") as string,
  };

  const validatedFields = incomeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.income.create({
      data: {
        dealerId: session.user.dealerId,
        incomeItemId: validatedFields.data.incomeItemId,
        amount: validatedFields.data.amount,
        date: new Date(validatedFields.data.date),
        description: validatedFields.data.description || null,
        paymentMethod: validatedFields.data.paymentMethod,
        receiptNumber: validatedFields.data.receiptNumber || null,
        createdById: session.user.id,
      },
    });

    revalidatePath("/[locale]/accounting/incomes");
    return { message: "Gelir başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create income error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateIncomeAction(
  id: string,
  _prevState: IncomeFormState,
  formData: FormData
): Promise<IncomeFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    incomeItemId: formData.get("incomeItemId") as string,
    amount: formData.get("amount") as string,
    date: formData.get("date") as string,
    description: formData.get("description") as string,
    paymentMethod: formData.get("paymentMethod") as string,
    receiptNumber: formData.get("receiptNumber") as string,
  };

  const validatedFields = incomeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.income.update({
      where: { id },
      data: {
        incomeItemId: validatedFields.data.incomeItemId,
        amount: validatedFields.data.amount,
        date: new Date(validatedFields.data.date),
        description: validatedFields.data.description || null,
        paymentMethod: validatedFields.data.paymentMethod,
        receiptNumber: validatedFields.data.receiptNumber || null,
      },
    });

    revalidatePath("/[locale]/accounting/incomes");
    return { message: "Gelir başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update income error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteIncomeAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.income.delete({
      where: { id },
    });

    revalidatePath("/[locale]/accounting/incomes");
    return { message: "Gelir silindi", success: true };
  } catch (error) {
    console.error("Delete income error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
