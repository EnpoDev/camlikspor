"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const studentDevelopmentSchema = z.object({
  studentId: z.string().min(1, "Öğrenci seçilmeli"),
  date: z.string().min(1, "Tarih gerekli"),
  category: z.string().min(1, "Kategori seçilmeli"),
  metric: z.string().min(1, "Metrik seçilmeli"),
  score: z.number().min(1, "Puan en az 1 olmalı").max(10, "Puan en fazla 10 olabilir"),
  notes: z.string().optional(),
  trainerId: z.string().optional(),
});

export type StudentDevelopmentFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createStudentDevelopmentAction(
  _prevState: StudentDevelopmentFormState,
  formData: FormData
): Promise<StudentDevelopmentFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    studentId: formData.get("studentId") as string,
    date: formData.get("date") as string,
    category: formData.get("category") as string,
    metric: formData.get("metric") as string,
    score: parseInt(formData.get("score") as string) || 0,
    notes: (formData.get("notes") as string) || undefined,
    trainerId: (formData.get("trainerId") as string) || undefined,
  };

  const validatedFields = studentDevelopmentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.studentDevelopment.create({
      data: {
        studentId: validatedFields.data.studentId,
        date: new Date(validatedFields.data.date),
        category: validatedFields.data.category,
        metric: validatedFields.data.metric,
        score: validatedFields.data.score,
        notes: validatedFields.data.notes || null,
        trainerId: validatedFields.data.trainerId || null,
      },
    });

    revalidatePath("/[locale]/settings/student-development");
    return { message: "Gelişim kaydı başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create student development error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateStudentDevelopmentAction(
  id: string,
  _prevState: StudentDevelopmentFormState,
  formData: FormData
): Promise<StudentDevelopmentFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    studentId: formData.get("studentId") as string,
    date: formData.get("date") as string,
    category: formData.get("category") as string,
    metric: formData.get("metric") as string,
    score: parseInt(formData.get("score") as string) || 0,
    notes: (formData.get("notes") as string) || undefined,
    trainerId: (formData.get("trainerId") as string) || undefined,
  };

  const validatedFields = studentDevelopmentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.studentDevelopment.update({
      where: { id },
      data: {
        studentId: validatedFields.data.studentId,
        date: new Date(validatedFields.data.date),
        category: validatedFields.data.category,
        metric: validatedFields.data.metric,
        score: validatedFields.data.score,
        notes: validatedFields.data.notes || null,
        trainerId: validatedFields.data.trainerId || null,
      },
    });

    revalidatePath("/[locale]/settings/student-development");
    return { message: "Gelişim kaydı başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update student development error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteStudentDevelopmentAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.studentDevelopment.delete({
      where: { id },
    });

    revalidatePath("/[locale]/settings/student-development");
    return { message: "Gelişim kaydı silindi", success: true };
  } catch (error) {
    console.error("Delete student development error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
