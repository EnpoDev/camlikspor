"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasPermission } from "@/lib/utils/permissions";
import { Permission } from "@/lib/types";

const heroSlideSchema = z.object({
  badge: z.string().min(1, "Rozet gereklidir"),
  title: z.string().min(1, "Başlık gereklidir"),
  subtitle: z.string().min(1, "Alt başlık gereklidir"),
  image: z.string().min(1, "Görsel gereklidir"),
  ctaPrimary: z.string().min(1, "Birincil buton metni gereklidir"),
  ctaSecondary: z.string().min(1, "İkincil buton metni gereklidir"),
  sortOrder: z.number().min(0, "Sıralama 0 veya daha büyük olmalıdır"),
  isActive: z.boolean(),
});

export interface HeroSlideFormState {
  errors?: {
    badge?: string[];
    title?: string[];
    subtitle?: string[];
    image?: string[];
    ctaPrimary?: string[];
    ctaSecondary?: string[];
    sortOrder?: string[];
    _form?: string[];
  };
  message?: string;
  success: boolean;
}

export async function createHeroSlideAction(
  prevState: HeroSlideFormState,
  formData: FormData
): Promise<HeroSlideFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return {
      errors: { _form: ["Yetkiniz yok"] },
      success: false,
    };
  }

  // Check permission
  const userPermissions = session.user.permissions || [];
  if (!hasPermission(userPermissions, Permission.HERO_SLIDES_CREATE)) {
    return {
      errors: { _form: ["Bu işlem için yetkiniz yok"] },
      success: false,
    };
  }

  const result = heroSlideSchema.safeParse({
    badge: formData.get("badge"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    image: formData.get("image"),
    ctaPrimary: formData.get("ctaPrimary"),
    ctaSecondary: formData.get("ctaSecondary"),
    sortOrder: parseInt(formData.get("sortOrder") as string, 10),
    isActive: formData.get("isActive") === "true",
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    await prisma.heroSlide.create({
      data: {
        dealerId: session.user.dealerId,
        badge: result.data.badge,
        title: result.data.title,
        subtitle: result.data.subtitle,
        image: result.data.image,
        ctaPrimary: result.data.ctaPrimary,
        ctaSecondary: result.data.ctaSecondary,
        sortOrder: result.data.sortOrder,
        isActive: result.data.isActive,
      },
    });

    revalidatePath("/hero-slides");
    return {
      message: "Hero slider oluşturuldu",
      success: true,
    };
  } catch (error) {
    console.error("Hero slide creation error:", error);
    return {
      errors: { _form: ["Bir hata oluştu"] },
      success: false,
    };
  }
}

export async function updateHeroSlideAction(
  id: string,
  prevState: HeroSlideFormState,
  formData: FormData
): Promise<HeroSlideFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return {
      errors: { _form: ["Yetkiniz yok"] },
      success: false,
    };
  }

  // Check permission
  const userPermissions = session.user.permissions || [];
  if (!hasPermission(userPermissions, Permission.HERO_SLIDES_EDIT)) {
    return {
      errors: { _form: ["Bu işlem için yetkiniz yok"] },
      success: false,
    };
  }

  const result = heroSlideSchema.safeParse({
    badge: formData.get("badge"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    image: formData.get("image"),
    ctaPrimary: formData.get("ctaPrimary"),
    ctaSecondary: formData.get("ctaSecondary"),
    sortOrder: parseInt(formData.get("sortOrder") as string, 10),
    isActive: formData.get("isActive") === "true",
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    // Check if slide exists and belongs to dealer
    const slide = await prisma.heroSlide.findFirst({
      where: {
        id,
        dealerId: session.user.dealerId,
      },
    });

    if (!slide) {
      return {
        errors: { _form: ["Hero slider bulunamadı"] },
        success: false,
      };
    }

    await prisma.heroSlide.update({
      where: { id },
      data: {
        badge: result.data.badge,
        title: result.data.title,
        subtitle: result.data.subtitle,
        image: result.data.image,
        ctaPrimary: result.data.ctaPrimary,
        ctaSecondary: result.data.ctaSecondary,
        sortOrder: result.data.sortOrder,
        isActive: result.data.isActive,
      },
    });

    revalidatePath("/hero-slides");
    return {
      message: "Hero slider güncellendi",
      success: true,
    };
  } catch (error) {
    console.error("Hero slide update error:", error);
    return {
      errors: { _form: ["Bir hata oluştu"] },
      success: false,
    };
  }
}

export async function deleteHeroSlideAction(id: string): Promise<{
  success: boolean;
  message?: string;
}> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return {
      success: false,
      message: "Yetkiniz yok",
    };
  }

  // Check permission
  const userPermissions = session.user.permissions || [];
  if (!hasPermission(userPermissions, Permission.HERO_SLIDES_DELETE)) {
    return {
      success: false,
      message: "Bu işlem için yetkiniz yok",
    };
  }

  try {
    const slide = await prisma.heroSlide.findFirst({
      where: {
        id,
        dealerId: session.user.dealerId,
      },
    });

    if (!slide) {
      return {
        success: false,
        message: "Hero slider bulunamadı",
      };
    }

    await prisma.heroSlide.delete({
      where: { id },
    });

    revalidatePath("/hero-slides");
    return {
      success: true,
      message: "Hero slider silindi",
    };
  } catch (error) {
    console.error("Hero slide deletion error:", error);
    return {
      success: false,
      message: "Bir hata oluştu",
    };
  }
}
