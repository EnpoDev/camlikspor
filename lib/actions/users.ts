"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { turkishPhoneOptionalSchema } from "@/lib/utils/validation";

const userSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmali"),
  email: z.string().email("Gecerli bir e-posta adresi girin"),
  password: z.string().min(8, "Sifre en az 8 karakter olmali").optional(),
  phone: turkishPhoneOptionalSchema,
  role: z.string().min(1, "Rol secimi gerekli"),
  dealerId: z.string().optional(),
});

export type UserFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function createUserAction(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: formData.get("phone") as string,
    role: formData.get("role") as string,
    dealerId: formData.get("dealerId") as string,
  };

  const validatedFields = userSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  if (!rawData.password) {
    return {
      errors: { password: ["Yeni kullanici icin sifre gerekli"] },
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: validatedFields.data.email },
  });

  if (existingUser) {
    return {
      errors: { email: ["Bu e-posta adresi zaten kullaniliyor"] },
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    const passwordHash = await bcrypt.hash(rawData.password, 12);

    await prisma.user.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        passwordHash,
        phone: validatedFields.data.phone || null,
        role: validatedFields.data.role,
        dealerId: validatedFields.data.dealerId && validatedFields.data.dealerId !== "none"
          ? validatedFields.data.dealerId
          : null,
      },
    });

    revalidatePath("/[locale]/users");
    return { message: "Kullanici basariyla eklendi", success: true };
  } catch (error) {
    console.error("Create user error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function updateUserAction(
  id: string,
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: formData.get("phone") as string,
    role: formData.get("role") as string,
    dealerId: formData.get("dealerId") as string,
  };

  const validatedFields = userSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: validatedFields.data.email,
      NOT: { id },
    },
  });

  if (existingUser) {
    return {
      errors: { email: ["Bu e-posta adresi zaten kullaniliyor"] },
      message: "Lutfen formu kontrol edin",
      success: false,
    };
  }

  try {
    const updateData: {
      name: string;
      email: string;
      phone: string | null;
      role: string;
      dealerId: string | null;
      passwordHash?: string;
    } = {
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      phone: validatedFields.data.phone || null,
      role: validatedFields.data.role,
      dealerId: validatedFields.data.dealerId && validatedFields.data.dealerId !== "none"
        ? validatedFields.data.dealerId
        : null,
    };

    if (rawData.password) {
      updateData.passwordHash = await bcrypt.hash(rawData.password, 12);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/[locale]/users");
    revalidatePath(`/[locale]/users/${id}`);
    return { message: "Kullanici basariyla guncellendi", success: true };
  } catch (error) {
    console.error("Update user error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}

export async function deleteUserAction(id: string): Promise<{ success: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { message: "Yetkilendirme hatasi", success: false };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });

    revalidatePath("/[locale]/users");
    return { message: "Kullanici silindi", success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { message: "Bir hata olustu", success: false };
  }
}
