"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const bodyMeasurementSchema = z.object({
  studentId: z.string().min(1, "Öğrenci seçilmeli"),
  date: z.string().min(1, "Tarih gerekli"),
  height: z.number().min(0, "Boy 0 veya daha büyük olmalı").optional(),
  weight: z.number().min(0, "Kilo 0 veya daha büyük olmalı").optional(),
  chestSize: z.number().min(0, "Göğüs ölçüsü 0 veya daha büyük olmalı").optional(),
  waistSize: z.number().min(0, "Bel ölçüsü 0 veya daha büyük olmalı").optional(),
  armSize: z.number().min(0, "Kol ölçüsü 0 veya daha büyük olmalı").optional(),
  legSize: z.number().min(0, "Bacak ölçüsü 0 veya daha büyük olmalı").optional(),
  notes: z.string().optional(),
});

export type BodyMeasurementFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createBodyMeasurementAction(
  _prevState: BodyMeasurementFormState,
  formData: FormData
): Promise<BodyMeasurementFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    studentId: formData.get("studentId") as string,
    date: formData.get("date") as string,
    height: parseFloat(formData.get("height") as string) || undefined,
    weight: parseFloat(formData.get("weight") as string) || undefined,
    chestSize: parseFloat(formData.get("chestSize") as string) || undefined,
    waistSize: parseFloat(formData.get("waistSize") as string) || undefined,
    armSize: parseFloat(formData.get("armSize") as string) || undefined,
    legSize: parseFloat(formData.get("legSize") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const validatedFields = bodyMeasurementSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.bodyMeasurement.create({
      data: {
        studentId: validatedFields.data.studentId,
        date: new Date(validatedFields.data.date),
        height: validatedFields.data.height || null,
        weight: validatedFields.data.weight || null,
        chestSize: validatedFields.data.chestSize || null,
        waistSize: validatedFields.data.waistSize || null,
        armSize: validatedFields.data.armSize || null,
        legSize: validatedFields.data.legSize || null,
        notes: validatedFields.data.notes || null,
      },
    });

    revalidatePath("/[locale]/settings/body-measurements");
    return { message: "Beden ölçüsü başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create body measurement error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateBodyMeasurementAction(
  id: string,
  _prevState: BodyMeasurementFormState,
  formData: FormData
): Promise<BodyMeasurementFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    studentId: formData.get("studentId") as string,
    date: formData.get("date") as string,
    height: parseFloat(formData.get("height") as string) || undefined,
    weight: parseFloat(formData.get("weight") as string) || undefined,
    chestSize: parseFloat(formData.get("chestSize") as string) || undefined,
    waistSize: parseFloat(formData.get("waistSize") as string) || undefined,
    armSize: parseFloat(formData.get("armSize") as string) || undefined,
    legSize: parseFloat(formData.get("legSize") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const validatedFields = bodyMeasurementSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.bodyMeasurement.update({
      where: { id },
      data: {
        studentId: validatedFields.data.studentId,
        date: new Date(validatedFields.data.date),
        height: validatedFields.data.height || null,
        weight: validatedFields.data.weight || null,
        chestSize: validatedFields.data.chestSize || null,
        waistSize: validatedFields.data.waistSize || null,
        armSize: validatedFields.data.armSize || null,
        legSize: validatedFields.data.legSize || null,
        notes: validatedFields.data.notes || null,
      },
    });

    revalidatePath("/[locale]/settings/body-measurements");
    return { message: "Beden ölçüsü başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update body measurement error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteBodyMeasurementAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.bodyMeasurement.delete({
      where: { id },
    });

    revalidatePath("/[locale]/settings/body-measurements");
    return { message: "Beden ölçüsü silindi", success: true };
  } catch (error) {
    console.error("Delete body measurement error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
