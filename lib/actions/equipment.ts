"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/logger";

const equipmentSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  description: z.string().optional(),
  price: z.number().min(0, "Fiyat 0 veya daha büyük olmalı").default(0),
});

export type EquipmentFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createEquipmentAction(
  _prevState: EquipmentFormState,
  formData: FormData
): Promise<EquipmentFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    price: parseFloat(formData.get("price") as string) || 0,
  };

  const validatedFields = equipmentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.material.create({
      data: {
        dealerId: session.user.dealerId,
        name: validatedFields.data.name,
        description: validatedFields.data.description || null,
        price: validatedFields.data.price,
      },
    });

    logAudit({ actor: session.user.id, action: "CREATE", entity: "Equipment", dealerId: session.user.dealerId, status: "SUCCESS" });
    revalidatePath("/[locale]/settings/equipment");
    return { message: "Malzeme başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create equipment error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updateEquipmentAction(
  id: string,
  _prevState: EquipmentFormState,
  formData: FormData
): Promise<EquipmentFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    price: parseFloat(formData.get("price") as string) || 0,
  };

  const validatedFields = equipmentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    // Check ownership
    const material = await prisma.material.findUnique({
      where: { id },
      select: { dealerId: true },
    });
    if (!material) return { message: "Malzeme bulunamadi", success: false };
    if (material.dealerId !== session.user.dealerId) {
      return { message: "Yetkilendirme hatası", success: false };
    }

    await prisma.material.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description || null,
        price: validatedFields.data.price,
      },
    });

    logAudit({ actor: session.user.id, action: "UPDATE", entity: "Equipment", entityId: id, dealerId: session.user.dealerId, status: "SUCCESS" });
    revalidatePath("/[locale]/settings/equipment");
    return { message: "Malzeme başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update equipment error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deleteEquipmentAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    // Check ownership
    const material = await prisma.material.findUnique({
      where: { id },
      select: { dealerId: true },
    });
    if (!material) return { message: "Malzeme bulunamadi", success: false };
    if (material.dealerId !== session.user.dealerId) {
      return { message: "Yetkilendirme hatası", success: false };
    }

    await prisma.material.update({
      where: { id },
      data: { isActive: false },
    });

    logAudit({ actor: session.user.id, action: "DELETE", entity: "Equipment", entityId: id, dealerId: session.user.dealerId, status: "SUCCESS" });
    revalidatePath("/[locale]/settings/equipment");
    return { message: "Malzeme silindi", success: true };
  } catch (error) {
    console.error("Delete equipment error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
