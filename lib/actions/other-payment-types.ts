"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const otherPaymentTypeSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
});

export type OtherPaymentTypeFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createOtherPaymentTypeAction(
  _prevState: OtherPaymentTypeFormState,
  formData: FormData
): Promise<OtherPaymentTypeFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = otherPaymentTypeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.otherPaymentType.create({
      data: {
        dealerId: session.user.dealerId,
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/other-payment-types");
    return { message: "Ödeme tipi başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create other payment type error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateOtherPaymentTypeAction(
  id: string,
  _prevState: OtherPaymentTypeFormState,
  formData: FormData
): Promise<OtherPaymentTypeFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedFields = otherPaymentTypeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.otherPaymentType.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/[locale]/settings/other-payment-types");
    return { message: "Ödeme tipi başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update other payment type error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteOtherPaymentTypeAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.otherPaymentType.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/[locale]/settings/other-payment-types");
    return { message: "Ödeme tipi silindi", success: true };
  } catch (error) {
    console.error("Delete other payment type error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
