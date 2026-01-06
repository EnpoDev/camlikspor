"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Generic schema for simple settings (name, description, isActive)
const simpleSettingSchema = z.object({
  name: z.string().min(1, "Ad gerekli"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Schema for size definitions
const sizeSettingSchema = z.object({
  name: z.string().min(1, "Ad gerekli"),
  sizes: z.string().min(1, "Bedenler gerekli"),
  isActive: z.boolean().default(true),
});

// Schema for discount types
const discountSettingSchema = z.object({
  name: z.string().min(1, "Ad gerekli"),
  percentage: z.number().min(0).max(100),
  isActive: z.boolean().default(true),
});

// Schema for dues types
const duesSettingSchema = z.object({
  name: z.string().min(1, "Ad gerekli"),
  amount: z.number().min(0),
  isActive: z.boolean().default(true),
});

export type SettingsFormState = {
  errors?: { [key: string]: string[] };
  message?: string;
  success?: boolean;
};

// Branch Actions
export async function createBranchAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = simpleSettingSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.branch.create({
      data: {
        dealerId: session.user.dealerId,
        ...validatedFields.data,
      },
    });
    revalidatePath("/[locale]/settings/branches");
    return { message: "Brans basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create branch error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateBranchAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = simpleSettingSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.branch.update({
      where: { id, dealerId: session.user.dealerId },
      data: validatedFields.data,
    });
    revalidatePath("/[locale]/settings/branches");
    return { message: "Brans basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update branch error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteBranchAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.branch.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/branches");
    return { message: "Brans basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete branch error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Location Actions
export async function createLocationAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.location.create({
      data: {
        dealerId: session.user.dealerId,
        name,
        address: (formData.get("address") as string) || null,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/locations");
    return { message: "Sube basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create location error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateLocationAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.location.update({
      where: { id, dealerId: session.user.dealerId },
      data: {
        name,
        address: (formData.get("address") as string) || null,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/locations");
    return { message: "Sube basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update location error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteLocationAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.location.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/locations");
    return { message: "Sube basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete location error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Facility Actions
export async function createFacilityAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  // Get the first location for this dealer as default
  const defaultLocation = await prisma.location.findFirst({
    where: { dealerId: session.user.dealerId },
  });

  if (!defaultLocation) {
    return { message: "Once bir sube eklemelisiniz", success: false };
  }

  try {
    await prisma.facility.create({
      data: {
        dealerId: session.user.dealerId,
        locationId: defaultLocation.id,
        name,
        address: (formData.get("address") as string) || null,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/facilities");
    return { message: "Tesis basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create facility error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateFacilityAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.facility.update({
      where: { id, dealerId: session.user.dealerId },
      data: {
        name,
        address: (formData.get("address") as string) || null,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/facilities");
    return { message: "Tesis basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update facility error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteFacilityAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.facility.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/facilities");
    return { message: "Tesis basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete facility error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Period Actions
export async function createPeriodAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;

  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }
  if (!startDateStr) {
    return { errors: { startDate: ["Baslangic tarihi gerekli"] }, message: "Formu kontrol edin", success: false };
  }
  if (!endDateStr) {
    return { errors: { endDate: ["Bitis tarihi gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.period.create({
      data: {
        dealerId: session.user.dealerId,
        name,
        startDate: new Date(startDateStr),
        endDate: new Date(endDateStr),
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/periods");
    return { message: "Donem basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create period error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updatePeriodAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;

  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }
  if (!startDateStr) {
    return { errors: { startDate: ["Baslangic tarihi gerekli"] }, message: "Formu kontrol edin", success: false };
  }
  if (!endDateStr) {
    return { errors: { endDate: ["Bitis tarihi gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.period.update({
      where: { id, dealerId: session.user.dealerId },
      data: {
        name,
        startDate: new Date(startDateStr),
        endDate: new Date(endDateStr),
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/periods");
    return { message: "Donem basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update period error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deletePeriodAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.period.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/periods");
    return { message: "Donem basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete period error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Task Definition Actions
export async function createTaskDefinitionAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = simpleSettingSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.taskDefinition.create({
      data: {
        dealerId: session.user.dealerId,
        ...validatedFields.data,
      },
    });
    revalidatePath("/[locale]/settings/tasks");
    return { message: "Gorev tanimi basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create task definition error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateTaskDefinitionAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = simpleSettingSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.taskDefinition.update({
      where: { id, dealerId: session.user.dealerId },
      data: validatedFields.data,
    });
    revalidatePath("/[locale]/settings/tasks");
    return { message: "Gorev tanimi basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update task definition error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteTaskDefinitionAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.taskDefinition.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/tasks");
    return { message: "Gorev tanimi basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete task definition error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Development Type Actions
export async function createDevelopmentTypeAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = simpleSettingSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.developmentType.create({
      data: {
        dealerId: session.user.dealerId,
        ...validatedFields.data,
      },
    });
    revalidatePath("/[locale]/settings/development");
    return { message: "Gelisim tipi basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create development type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateDevelopmentTypeAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = simpleSettingSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.developmentType.update({
      where: { id, dealerId: session.user.dealerId },
      data: validatedFields.data,
    });
    revalidatePath("/[locale]/settings/development");
    return { message: "Gelisim tipi basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update development type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteDevelopmentTypeAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.developmentType.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/development");
    return { message: "Gelisim tipi basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete development type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Personnel Type Actions
export async function createPersonnelTypeAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = simpleSettingSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.personnelType.create({
      data: {
        dealerId: session.user.dealerId,
        ...validatedFields.data,
      },
    });
    revalidatePath("/[locale]/settings/personnel");
    return { message: "Personel tipi basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create personnel type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updatePersonnelTypeAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = simpleSettingSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.personnelType.update({
      where: { id, dealerId: session.user.dealerId },
      data: validatedFields.data,
    });
    revalidatePath("/[locale]/settings/personnel");
    return { message: "Personel tipi basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update personnel type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deletePersonnelTypeAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.personnelType.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/personnel");
    return { message: "Personel tipi basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete personnel type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Expense Item Actions
export async function createExpenseItemAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.expenseItem.create({
      data: {
        dealerId: session.user.dealerId,
        name,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/expense-items");
    return { message: "Gider kalemi basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create expense item error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateExpenseItemAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.expenseItem.update({
      where: { id, dealerId: session.user.dealerId },
      data: {
        name,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/expense-items");
    return { message: "Gider kalemi basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update expense item error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteExpenseItemAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.expenseItem.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/expense-items");
    return { message: "Gider kalemi basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete expense item error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Income Item Actions
export async function createIncomeItemAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.incomeItem.create({
      data: {
        dealerId: session.user.dealerId,
        name,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/income-items");
    return { message: "Gelir kalemi basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create income item error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateIncomeItemAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.incomeItem.update({
      where: { id, dealerId: session.user.dealerId },
      data: {
        name,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/income-items");
    return { message: "Gelir kalemi basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update income item error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteIncomeItemAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.incomeItem.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/income-items");
    return { message: "Gelir kalemi basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete income item error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Size Definition Actions
export async function createSizeDefinitionAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = sizeSettingSchema.safeParse({
    name: formData.get("name"),
    sizes: formData.get("sizes"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.sizeDefinition.create({
      data: {
        dealerId: session.user.dealerId,
        ...validatedFields.data,
      },
    });
    revalidatePath("/[locale]/settings/sizes");
    return { message: "Beden tanimi basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create size definition error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateSizeDefinitionAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = sizeSettingSchema.safeParse({
    name: formData.get("name"),
    sizes: formData.get("sizes"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.sizeDefinition.update({
      where: { id, dealerId: session.user.dealerId },
      data: validatedFields.data,
    });
    revalidatePath("/[locale]/settings/sizes");
    return { message: "Beden tanimi basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update size definition error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteSizeDefinitionAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.sizeDefinition.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/sizes");
    return { message: "Beden tanimi basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete size definition error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Discount Type Actions
export async function createDiscountTypeAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = discountSettingSchema.safeParse({
    name: formData.get("name"),
    percentage: parseFloat(formData.get("percentage") as string) || 0,
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.discountType.create({
      data: {
        dealerId: session.user.dealerId,
        ...validatedFields.data,
      },
    });
    revalidatePath("/[locale]/settings/discounts");
    return { message: "Indirim tipi basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create discount type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateDiscountTypeAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = discountSettingSchema.safeParse({
    name: formData.get("name"),
    percentage: parseFloat(formData.get("percentage") as string) || 0,
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.discountType.update({
      where: { id, dealerId: session.user.dealerId },
      data: validatedFields.data,
    });
    revalidatePath("/[locale]/settings/discounts");
    return { message: "Indirim tipi basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update discount type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteDiscountTypeAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.discountType.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/discounts");
    return { message: "Indirim tipi basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete discount type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Dues Type Actions
export async function createDuesTypeAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = duesSettingSchema.safeParse({
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount") as string) || 0,
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.duesType.create({
      data: {
        dealerId: session.user.dealerId,
        ...validatedFields.data,
      },
    });
    revalidatePath("/[locale]/settings/dues");
    return { message: "Aidat tipi basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create dues type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateDuesTypeAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const validatedFields = duesSettingSchema.safeParse({
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount") as string) || 0,
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formu kontrol edin",
      success: false,
    };
  }

  try {
    await prisma.duesType.update({
      where: { id, dealerId: session.user.dealerId },
      data: validatedFields.data,
    });
    revalidatePath("/[locale]/settings/dues");
    return { message: "Aidat tipi basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update dues type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteDuesTypeAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.duesType.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/dues");
    return { message: "Aidat tipi basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete dues type error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

// Material Actions
export async function createMaterialAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.material.create({
      data: {
        dealerId: session.user.dealerId,
        name,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/materials");
    return { message: "Malzeme basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create material error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateMaterialAction(
  id: string,
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const name = formData.get("name") as string;
  if (!name) {
    return { errors: { name: ["Ad gerekli"] }, message: "Formu kontrol edin", success: false };
  }

  try {
    await prisma.material.update({
      where: { id, dealerId: session.user.dealerId },
      data: {
        name,
        isActive: formData.get("isActive") === "true",
      },
    });
    revalidatePath("/[locale]/settings/materials");
    return { message: "Malzeme basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update material error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteMaterialAction(id: string): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.dealerId) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.material.delete({
      where: { id, dealerId: session.user.dealerId },
    });
    revalidatePath("/[locale]/settings/materials");
    return { message: "Malzeme basariyla silindi", success: true };
  } catch (error) {
    console.error("Delete material error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}
