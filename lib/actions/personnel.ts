"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  turkishPhoneSchema,
  tcKimlikOptionalSchema,
} from "@/lib/utils/validation";
import { encryptPII } from "@/lib/utils/pii";

const personnelSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  personnelTypeId: z.string().min(1, "Personel türü seçilmeli"),
  phone: turkishPhoneSchema,
  email: z.string().email("Geçerli bir email girin").optional().or(z.literal("")),
  salary: z.number().min(0, "Maaş 0 veya daha büyük olmalı").optional(),
  tcKimlikNo: tcKimlikOptionalSchema,
  address: z.string().optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  workSchedule: z.string().optional(),
});

export type PersonnelFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createPersonnelAction(
  _prevState: PersonnelFormState,
  formData: FormData
): Promise<PersonnelFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    personnelTypeId: formData.get("personnelTypeId") as string,
    phone: formData.get("phone") as string,
    email: (formData.get("email") as string) || "",
    salary: parseFloat(formData.get("salary") as string) || undefined,
    tcKimlikNo: (formData.get("tcKimlikNo") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    birthDate: (formData.get("birthDate") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    workSchedule: (formData.get("workSchedule") as string) || undefined,
  };

  const validatedFields = personnelSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.personnel.create({
      data: {
        dealerId: session.user.dealerId,
        firstName: validatedFields.data.firstName,
        lastName: validatedFields.data.lastName,
        personnelTypeId: validatedFields.data.personnelTypeId,
        phone: encryptPII(validatedFields.data.phone) ?? validatedFields.data.phone,
        email: validatedFields.data.email || null,
        salary: validatedFields.data.salary || null,
        tcKimlikNo: encryptPII(validatedFields.data.tcKimlikNo),
        address: validatedFields.data.address || null,
        birthDate: validatedFields.data.birthDate
          ? new Date(validatedFields.data.birthDate)
          : null,
        notes: validatedFields.data.notes || null,
        workSchedule: validatedFields.data.workSchedule || null,
      },
    });

    revalidatePath("/[locale]/settings/personnel");
    return { message: "Personel başarıyla eklendi", success: true };
  } catch (error) {
    console.error("Create personnel error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function updatePersonnelAction(
  id: string,
  _prevState: PersonnelFormState,
  formData: FormData
): Promise<PersonnelFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  const rawData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    personnelTypeId: formData.get("personnelTypeId") as string,
    phone: formData.get("phone") as string,
    email: (formData.get("email") as string) || "",
    salary: parseFloat(formData.get("salary") as string) || undefined,
    tcKimlikNo: (formData.get("tcKimlikNo") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    birthDate: (formData.get("birthDate") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    workSchedule: (formData.get("workSchedule") as string) || undefined,
  };

  const validatedFields = personnelSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lütfen formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.personnel.update({
      where: { id },
      data: {
        firstName: validatedFields.data.firstName,
        lastName: validatedFields.data.lastName,
        personnelTypeId: validatedFields.data.personnelTypeId,
        phone: encryptPII(validatedFields.data.phone) ?? validatedFields.data.phone,
        email: validatedFields.data.email || null,
        salary: validatedFields.data.salary || null,
        tcKimlikNo: encryptPII(validatedFields.data.tcKimlikNo),
        address: validatedFields.data.address || null,
        birthDate: validatedFields.data.birthDate
          ? new Date(validatedFields.data.birthDate)
          : null,
        notes: validatedFields.data.notes || null,
        workSchedule: validatedFields.data.workSchedule || null,
      },
    });

    revalidatePath("/[locale]/settings/personnel");
    return { message: "Personel başarıyla güncellendi", success: true };
  } catch (error) {
    console.error("Update personnel error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}

export async function deletePersonnelAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatası", success: false };
  }

  try {
    await prisma.personnel.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });

    revalidatePath("/[locale]/settings/personnel");
    return { message: "Personel silindi", success: true };
  } catch (error) {
    console.error("Delete personnel error:", error);
    return { message: "Bir hata oluştu", success: false };
  }
}
