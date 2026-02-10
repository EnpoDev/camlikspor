"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateStudentNumber } from "@/lib/data/students";
import {
  turkishPhoneSchema,
  turkishPhoneOptionalSchema,
  tcKimlikOptionalSchema,
} from "@/lib/utils/validation";

const studentSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmali"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmali"),
  birthDate: z.string().min(1, "Dogum tarihi gerekli"),
  gender: z.string().min(1, "Cinsiyet gerekli"),
  tcKimlikNo: tcKimlikOptionalSchema,
  phone: turkishPhoneOptionalSchema,
  email: z.string().email("Gecerli bir email girin").optional(),
  address: z.string().optional(),
  parentName: z.string().min(2, "Veli adi gerekli"),
  parentPhone: turkishPhoneSchema,
  parentEmail: z.string().email("Gecerli bir email girin").optional(),
  parentTcKimlik: tcKimlikOptionalSchema,
  emergencyContact: z.string().optional(),
  emergencyPhone: turkishPhoneOptionalSchema,
  branchId: z.string().min(1, "Brans secimi gerekli"),
  locationId: z.string().min(1, "Sube secimi gerekli"),
  facilityId: z.string().min(1, "Tesis secimi gerekli"),
  monthlyFee: z.number().min(0).default(0),
  registrationFee: z.number().min(0).default(0),
  discountTypeId: z.string().optional(),
  notes: z.string().optional(),
});

export type StudentFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  messageKey?: string;
  success?: boolean;
};

export async function createStudentAction(
  _prevState: StudentFormState,
  formData: FormData
): Promise<StudentFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  const str = (name: string) => (formData.get(name) as string)?.trim() || "";
  const optStr = (name: string) => (formData.get(name) as string)?.trim() || undefined;

  const rawData = {
    firstName: str("firstName"),
    lastName: str("lastName"),
    birthDate: str("birthDate"),
    gender: str("gender"),
    tcKimlikNo: optStr("tcKimlikNo"),
    phone: optStr("phone"),
    email: optStr("email"),
    address: optStr("address"),
    parentName: str("parentName"),
    parentPhone: str("parentPhone"),
    parentEmail: optStr("parentEmail"),
    parentTcKimlik: optStr("parentTcKimlik"),
    emergencyContact: optStr("emergencyContact"),
    emergencyPhone: optStr("emergencyPhone"),
    branchId: str("branchId"),
    locationId: str("locationId"),
    facilityId: str("facilityId"),
    monthlyFee: parseFloat(formData.get("monthlyFee") as string) || 0,
    registrationFee: parseFloat(formData.get("registrationFee") as string) || 0,
    discountTypeId: optStr("discountTypeId"),
    notes: optStr("notes"),
  };

  const validatedFields = studentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstErrorField = Object.keys(fieldErrors)[0];
    const firstErrorMsg = firstErrorField ? fieldErrors[firstErrorField]?.[0] : undefined;
    console.error("Student validation errors:", JSON.stringify(fieldErrors));
    return {
      errors: fieldErrors,
      message: firstErrorMsg,
      messageKey: "formValidationError",
      success: false,
    };
  }

  try {
    const studentNumber = await generateStudentNumber(session.user.dealerId);

    await prisma.student.create({
      data: {
        dealerId: session.user.dealerId,
        studentNumber,
        firstName: validatedFields.data.firstName,
        lastName: validatedFields.data.lastName,
        birthDate: new Date(validatedFields.data.birthDate),
        gender: validatedFields.data.gender,
        tcKimlikNo: validatedFields.data.tcKimlikNo || null,
        phone: validatedFields.data.phone || null,
        email: validatedFields.data.email || null,
        address: validatedFields.data.address || null,
        parentName: validatedFields.data.parentName,
        parentPhone: validatedFields.data.parentPhone,
        parentEmail: validatedFields.data.parentEmail || null,
        parentTcKimlik: validatedFields.data.parentTcKimlik || null,
        emergencyContact: validatedFields.data.emergencyContact || null,
        emergencyPhone: validatedFields.data.emergencyPhone || null,
        branchId: validatedFields.data.branchId,
        locationId: validatedFields.data.locationId,
        facilityId: validatedFields.data.facilityId,
        monthlyFee: validatedFields.data.monthlyFee,
        registrationFee: validatedFields.data.registrationFee,
        discountTypeId: validatedFields.data.discountTypeId && validatedFields.data.discountTypeId !== "none" ? validatedFields.data.discountTypeId : null,
        notes: validatedFields.data.notes || null,
      },
    });

    revalidatePath("/[locale]/students");
    return { messageKey: "studentCreated", success: true };
  } catch (error) {
    console.error("Create student error:", error);
    return { messageKey: "studentCreateError", success: false };
  }
}

export async function updateStudentAction(
  id: string,
  _prevState: StudentFormState,
  formData: FormData
): Promise<StudentFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  const str = (name: string) => (formData.get(name) as string)?.trim() || "";
  const optStr = (name: string) => (formData.get(name) as string)?.trim() || undefined;

  const rawData = {
    firstName: str("firstName"),
    lastName: str("lastName"),
    birthDate: str("birthDate"),
    gender: str("gender"),
    tcKimlikNo: optStr("tcKimlikNo"),
    phone: optStr("phone"),
    email: optStr("email"),
    address: optStr("address"),
    parentName: str("parentName"),
    parentPhone: str("parentPhone"),
    parentEmail: optStr("parentEmail"),
    parentTcKimlik: optStr("parentTcKimlik"),
    emergencyContact: optStr("emergencyContact"),
    emergencyPhone: optStr("emergencyPhone"),
    branchId: str("branchId"),
    locationId: str("locationId"),
    facilityId: str("facilityId"),
    monthlyFee: parseFloat(formData.get("monthlyFee") as string) || 0,
    registrationFee: parseFloat(formData.get("registrationFee") as string) || 0,
    discountTypeId: optStr("discountTypeId"),
    notes: optStr("notes"),
  };

  const validatedFields = studentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstErrorField = Object.keys(fieldErrors)[0];
    const firstErrorMsg = firstErrorField ? fieldErrors[firstErrorField]?.[0] : undefined;
    console.error("Student update validation errors:", JSON.stringify(fieldErrors));
    return {
      errors: fieldErrors,
      message: firstErrorMsg,
      messageKey: "formValidationError",
      success: false,
    };
  }

  try {
    await prisma.student.update({
      where: { id },
      data: {
        firstName: validatedFields.data.firstName,
        lastName: validatedFields.data.lastName,
        birthDate: new Date(validatedFields.data.birthDate),
        gender: validatedFields.data.gender,
        tcKimlikNo: validatedFields.data.tcKimlikNo || null,
        phone: validatedFields.data.phone || null,
        email: validatedFields.data.email || null,
        address: validatedFields.data.address || null,
        parentName: validatedFields.data.parentName,
        parentPhone: validatedFields.data.parentPhone,
        parentEmail: validatedFields.data.parentEmail || null,
        parentTcKimlik: validatedFields.data.parentTcKimlik || null,
        emergencyContact: validatedFields.data.emergencyContact || null,
        emergencyPhone: validatedFields.data.emergencyPhone || null,
        branchId: validatedFields.data.branchId,
        locationId: validatedFields.data.locationId,
        facilityId: validatedFields.data.facilityId,
        monthlyFee: validatedFields.data.monthlyFee,
        registrationFee: validatedFields.data.registrationFee,
        discountTypeId: validatedFields.data.discountTypeId && validatedFields.data.discountTypeId !== "none" ? validatedFields.data.discountTypeId : null,
        notes: validatedFields.data.notes || null,
      },
    });

    revalidatePath("/[locale]/students");
    revalidatePath(`/[locale]/students/${id}`);
    return { messageKey: "studentUpdated", success: true };
  } catch (error) {
    console.error("Update student error:", error);
    return { messageKey: "studentUpdateError", success: false };
  }
}

export async function deleteStudentAction(id: string): Promise<{ success: boolean; messageKey: string }> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return { messageKey: "authError", success: false };
  }

  try {
    await prisma.student.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });

    revalidatePath("/[locale]/students");
    return { messageKey: "studentDeleted", success: true };
  } catch (error) {
    console.error("Delete student error:", error);
    return { messageKey: "studentDeleteError", success: false };
  }
}
