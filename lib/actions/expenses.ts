"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/logger";

const expenseSchema = z.object({
  expenseItemId: z.string().min(1, "Gider kalemi seçilmeli"),
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
  invoiceNumber: z.string().optional(),
});

export type ExpenseFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createExpenseAction(
  _prevState: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  const session = await auth();

  if (!session?.user?.dealerId || !session?.user?.id) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    expenseItemId: formData.get("expenseItemId") as string,
    amount: formData.get("amount") as string,
    date: formData.get("date") as string,
    description: formData.get("description") as string,
    paymentMethod: formData.get("paymentMethod") as string,
    invoiceNumber: formData.get("invoiceNumber") as string,
  };

  const validatedFields = expenseSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.expense.create({
      data: {
        dealerId: session.user.dealerId,
        expenseItemId: validatedFields.data.expenseItemId,
        amount: validatedFields.data.amount,
        date: new Date(validatedFields.data.date),
        description: validatedFields.data.description || null,
        paymentMethod: validatedFields.data.paymentMethod,
        invoiceNumber: validatedFields.data.invoiceNumber || null,
        createdById: session.user.id,
      },
    });

    logAudit({ actor: session.user.id, action: "CREATE", entity: "Expense", dealerId: session.user.dealerId, status: "SUCCESS" });
    revalidatePath("/[locale]/accounting/expenses");
    return { message: "Gider başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create expense error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateExpenseAction(
  id: string,
  _prevState: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    expenseItemId: formData.get("expenseItemId") as string,
    amount: formData.get("amount") as string,
    date: formData.get("date") as string,
    description: formData.get("description") as string,
    paymentMethod: formData.get("paymentMethod") as string,
    invoiceNumber: formData.get("invoiceNumber") as string,
  };

  const validatedFields = expenseSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.expense.update({
      where: { id },
      data: {
        expenseItemId: validatedFields.data.expenseItemId,
        amount: validatedFields.data.amount,
        date: new Date(validatedFields.data.date),
        description: validatedFields.data.description || null,
        paymentMethod: validatedFields.data.paymentMethod,
        invoiceNumber: validatedFields.data.invoiceNumber || null,
      },
    });

    logAudit({ actor: session.user.id, action: "UPDATE", entity: "Expense", entityId: id, dealerId: session.user.dealerId, status: "SUCCESS" });
    revalidatePath("/[locale]/accounting/expenses");
    return { message: "Gider başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update expense error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteExpenseAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.expense.delete({
      where: { id },
    });

    logAudit({ actor: session.user.id, action: "DELETE", entity: "Expense", entityId: id, dealerId: session.user.dealerId, status: "SUCCESS" });
    revalidatePath("/[locale]/accounting/expenses");
    return { message: "Gider silindi", success: true };
  } catch (error) {
    console.error("Delete expense error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
