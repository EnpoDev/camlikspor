"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Zod schemas
const trainingPlanSchema = z.object({
  title: z.string().min(2, "Baslik en az 2 karakter olmali"),
  description: z.string().optional(),
  date: z.string().optional(),
  duration: z.number().min(1).default(90),
  focusArea: z.string().optional(),
  difficulty: z.string().default("INTERMEDIATE"),
  status: z.string().default("DRAFT"),
  targetAgeMin: z.number().optional(),
  targetAgeMax: z.number().optional(),
  aiGenerated: z.boolean().default(false),
  aiPrompt: z.string().optional(),
});

const trainingExerciseSchema = z.object({
  planId: z.string().min(1),
  name: z.string().min(2, "Egzersiz adi en az 2 karakter olmali"),
  description: z.string().optional(),
  duration: z.number().min(1).default(15),
  equipment: z.string().optional(),
  orderIndex: z.number().default(0),
  diagramData: z.string().optional(),
});

const tacticalBoardSchema = z.object({
  title: z.string().min(2, "Baslik en az 2 karakter olmali"),
  description: z.string().optional(),
  formation: z.string().optional(),
  boardData: z.string().optional(),
  aiGenerated: z.boolean().default(false),
  aiPrompt: z.string().optional(),
});

const trainingSessionSchema = z.object({
  planId: z.string().min(1),
  groupId: z.string().min(1),
  date: z.string().min(1),
  status: z.string().default("PLANNED"),
  notes: z.string().optional(),
});

export type TrainingFormState = {
  errors?: { [key: string]: string[] };
  message?: string;
  success?: boolean;
};

// Training Plan CRUD
export async function createTrainingPlanAction(
  _prevState: TrainingFormState,
  formData: FormData
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const rawData = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    date: (formData.get("date") as string) || undefined,
    duration: parseInt(formData.get("duration") as string) || 90,
    focusArea: (formData.get("focusArea") as string) || undefined,
    difficulty: (formData.get("difficulty") as string) || "INTERMEDIATE",
    status: (formData.get("status") as string) || "DRAFT",
    targetAgeMin: formData.get("targetAgeMin") ? parseInt(formData.get("targetAgeMin") as string) : undefined,
    targetAgeMax: formData.get("targetAgeMax") ? parseInt(formData.get("targetAgeMax") as string) : undefined,
    aiGenerated: formData.get("aiGenerated") === "true",
    aiPrompt: (formData.get("aiPrompt") as string) || undefined,
  };

  const validatedFields = trainingPlanSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.trainingPlan.create({
      data: {
        dealerId: session.user.dealerId,
        title: validatedFields.data.title,
        description: validatedFields.data.description || null,
        date: validatedFields.data.date ? new Date(validatedFields.data.date) : null,
        duration: validatedFields.data.duration,
        focusArea: validatedFields.data.focusArea || null,
        difficulty: validatedFields.data.difficulty,
        status: validatedFields.data.status,
        targetAgeMin: validatedFields.data.targetAgeMin ?? null,
        targetAgeMax: validatedFields.data.targetAgeMax ?? null,
        aiGenerated: validatedFields.data.aiGenerated,
        aiPrompt: validatedFields.data.aiPrompt || null,
        createdById: session.user.id,
      },
    });

    revalidatePath("/[locale]/training/plans");
    return { message: "Antrenman plani olusturuldu", success: true };
  } catch (error) {
    console.error("Create training plan error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateTrainingPlanAction(
  id: string,
  _prevState: TrainingFormState,
  formData: FormData
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const rawData = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    date: (formData.get("date") as string) || undefined,
    duration: parseInt(formData.get("duration") as string) || 90,
    focusArea: (formData.get("focusArea") as string) || undefined,
    difficulty: (formData.get("difficulty") as string) || "INTERMEDIATE",
    status: (formData.get("status") as string) || "DRAFT",
    targetAgeMin: formData.get("targetAgeMin") ? parseInt(formData.get("targetAgeMin") as string) : undefined,
    targetAgeMax: formData.get("targetAgeMax") ? parseInt(formData.get("targetAgeMax") as string) : undefined,
  };

  const validatedFields = trainingPlanSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.trainingPlan.update({
      where: { id },
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description || null,
        date: validatedFields.data.date ? new Date(validatedFields.data.date) : null,
        duration: validatedFields.data.duration,
        focusArea: validatedFields.data.focusArea || null,
        difficulty: validatedFields.data.difficulty,
        status: validatedFields.data.status,
        targetAgeMin: validatedFields.data.targetAgeMin ?? null,
        targetAgeMax: validatedFields.data.targetAgeMax ?? null,
      },
    });

    revalidatePath("/[locale]/training/plans");
    revalidatePath(`/[locale]/training/plans/${id}`);
    return { message: "Antrenman plani guncellendi", success: true };
  } catch (error) {
    console.error("Update training plan error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteTrainingPlanAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.trainingPlan.delete({ where: { id } });
    revalidatePath("/[locale]/training/plans");
    return { message: "Antrenman plani silindi", success: true };
  } catch (error) {
    console.error("Delete training plan error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Training Exercise CRUD
export async function createExerciseAction(
  data: z.infer<typeof trainingExerciseSchema>
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = trainingExerciseSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.trainingExercise.create({
      data: validatedFields.data,
    });

    revalidatePath(`/[locale]/training/plans/${data.planId}`);
    return { message: "Egzersiz eklendi", success: true };
  } catch (error) {
    console.error("Create exercise error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateExerciseAction(
  id: string,
  data: z.infer<typeof trainingExerciseSchema>
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = trainingExerciseSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.trainingExercise.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath(`/[locale]/training/plans/${data.planId}`);
    return { message: "Egzersiz guncellendi", success: true };
  } catch (error) {
    console.error("Update exercise error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteExerciseAction(
  id: string,
  planId: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.trainingExercise.delete({ where: { id } });
    revalidatePath(`/[locale]/training/plans/${planId}`);
    return { message: "Egzersiz silindi", success: true };
  } catch (error) {
    console.error("Delete exercise error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Tactical Board CRUD
export async function createTacticalBoardAction(
  _prevState: TrainingFormState,
  formData: FormData
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const rawData = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    formation: (formData.get("formation") as string) || undefined,
    boardData: (formData.get("boardData") as string) || undefined,
    aiGenerated: formData.get("aiGenerated") === "true",
    aiPrompt: (formData.get("aiPrompt") as string) || undefined,
  };

  const validatedFields = tacticalBoardSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.tacticalBoard.create({
      data: {
        dealerId: session.user.dealerId,
        title: validatedFields.data.title,
        description: validatedFields.data.description || null,
        formation: validatedFields.data.formation || null,
        boardData: validatedFields.data.boardData || null,
        aiGenerated: validatedFields.data.aiGenerated,
        aiPrompt: validatedFields.data.aiPrompt || null,
        createdById: session.user.id,
      },
    });

    revalidatePath("/[locale]/training/tactical-board");
    return { message: "Taktik kaydedildi", success: true };
  } catch (error) {
    console.error("Create tactical board error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateTacticalBoardAction(
  id: string,
  _prevState: TrainingFormState,
  formData: FormData
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const rawData = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    formation: (formData.get("formation") as string) || undefined,
    boardData: (formData.get("boardData") as string) || undefined,
  };

  const validatedFields = tacticalBoardSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.tacticalBoard.update({
      where: { id },
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description || null,
        formation: validatedFields.data.formation || null,
        boardData: validatedFields.data.boardData || null,
      },
    });

    revalidatePath("/[locale]/training/tactical-board");
    revalidatePath(`/[locale]/training/tactical-board/${id}`);
    return { message: "Taktik guncellendi", success: true };
  } catch (error) {
    console.error("Update tactical board error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteTacticalBoardAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.tacticalBoard.delete({ where: { id } });
    revalidatePath("/[locale]/training/tactical-board");
    return { message: "Taktik silindi", success: true };
  } catch (error) {
    console.error("Delete tactical board error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Training Session CRUD
export async function createTrainingSessionAction(
  data: z.infer<typeof trainingSessionSchema>
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = trainingSessionSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.trainingSession.create({
      data: {
        planId: validatedFields.data.planId,
        groupId: validatedFields.data.groupId,
        date: new Date(validatedFields.data.date),
        status: validatedFields.data.status,
        notes: validatedFields.data.notes || null,
      },
    });

    revalidatePath("/[locale]/training/calendar");
    return { message: "Antrenman oturumu olusturuldu", success: true };
  } catch (error) {
    console.error("Create training session error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateTrainingSessionStatusAction(
  id: string,
  status: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.trainingSession.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/[locale]/training/calendar");
    return { message: "Oturum durumu guncellendi", success: true };
  } catch (error) {
    console.error("Update training session error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteTrainingSessionAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.trainingSession.delete({ where: { id } });
    revalidatePath("/[locale]/training/calendar");
    return { message: "Antrenman oturumu silindi", success: true };
  } catch (error) {
    console.error("Delete training session error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Bulk create exercises (for AI-generated plans)
export async function bulkCreateExercisesAction(
  planId: string,
  exercises: Array<{
    name: string;
    description?: string;
    duration: number;
    equipment?: string;
    orderIndex: number;
  }>
): Promise<TrainingFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.trainingExercise.createMany({
      data: exercises.map((ex) => ({
        planId,
        name: ex.name,
        description: ex.description || null,
        duration: ex.duration,
        equipment: ex.equipment || null,
        orderIndex: ex.orderIndex,
      })),
    });

    revalidatePath(`/[locale]/training/plans/${planId}`);
    return { message: "Egzersizler eklendi", success: true };
  } catch (error) {
    console.error("Bulk create exercises error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}
