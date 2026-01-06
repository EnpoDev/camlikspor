"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateStudentNumber } from "@/lib/data/students";

const convertSchema = z.object({
  branchId: z.string().min(1, "Brans secimi gerekli"),
  locationId: z.string().min(1, "Sube secimi gerekli"),
  facilityId: z.string().min(1, "Tesis secimi gerekli"),
  monthlyFee: z.number().min(0).default(0),
  registrationFee: z.number().min(0).default(0),
  discountTypeId: z.string().optional(),
  notes: z.string().optional(),
});

export type ConvertFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function convertPreRegistrationAction(
  preRegistrationId: string,
  _prevState: ConvertFormState,
  formData: FormData
): Promise<ConvertFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const rawData = {
    branchId: formData.get("branchId") as string,
    locationId: formData.get("locationId") as string,
    facilityId: formData.get("facilityId") as string,
    monthlyFee: parseFloat(formData.get("monthlyFee") as string) || 0,
    registrationFee: parseFloat(formData.get("registrationFee") as string) || 0,
    discountTypeId: formData.get("discountTypeId") as string,
    notes: formData.get("notes") as string,
  };

  const validatedFields = convertSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    const preRegistration = await prisma.preRegistration.findUnique({
      where: { id: preRegistrationId },
    });

    if (!preRegistration) {
      return { message: "Onkayit bulunamadi", success: false };
    }

    if (preRegistration.dealerId !== session.user.dealerId) {
      return { message: "Yetkilendirme hatasi", success: false };
    }

    if (preRegistration.status === "CONVERTED") {
      return { message: "Bu onkayit zaten donusturulmus", success: false };
    }

    const studentNumber = await generateStudentNumber(session.user.dealerId);

    const student = await prisma.student.create({
      data: {
        dealerId: session.user.dealerId,
        studentNumber,
        firstName: preRegistration.firstName,
        lastName: preRegistration.lastName,
        birthDate: preRegistration.birthDate || new Date(),
        gender: preRegistration.gender || "MALE",
        parentName: preRegistration.parentName,
        parentPhone: preRegistration.parentPhone,
        parentEmail: preRegistration.parentEmail,
        branchId: validatedFields.data.branchId,
        locationId: validatedFields.data.locationId,
        facilityId: validatedFields.data.facilityId,
        monthlyFee: validatedFields.data.monthlyFee,
        registrationFee: validatedFields.data.registrationFee,
        discountTypeId: validatedFields.data.discountTypeId && validatedFields.data.discountTypeId !== "none"
          ? validatedFields.data.discountTypeId
          : null,
        notes: validatedFields.data.notes || null,
      },
    });

    await prisma.preRegistration.update({
      where: { id: preRegistrationId },
      data: {
        status: "CONVERTED",
        convertedToStudentId: student.id,
        convertedAt: new Date(),
      },
    });

    revalidatePath("/[locale]/pre-registration");
    revalidatePath("/[locale]/students");
    return { message: "Onkayit basariyla ogrenciye donusturuldu", success: true };
  } catch (error) {
    console.error("Convert pre-registration error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}
