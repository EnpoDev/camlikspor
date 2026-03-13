"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const blogPostSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  slug: z.string().min(1, "Slug gereklidir"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "İçerik gereklidir"),
  coverImage: z.string().optional(),
  isPublished: z.boolean(),
});

export interface BlogFormState {
  errors?: {
    title?: string[];
    slug?: string[];
    excerpt?: string[];
    content?: string[];
    coverImage?: string[];
    _form?: string[];
  };
  message?: string;
  success: boolean;
}

export async function createBlogPostAction(
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return {
      errors: { _form: ["Yetkiniz yok"] },
      success: false,
    };
  }

  const result = blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || undefined,
    isPublished: formData.get("isPublished") === "true",
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    // Check if slug already exists for this dealer
    const existing = await prisma.blogPost.findFirst({
      where: {
        dealerId: session.user.dealerId,
        slug: result.data.slug,
      },
    });

    if (existing) {
      return {
        errors: { slug: ["Bu slug zaten kullanılıyor"] },
        success: false,
      };
    }

    await prisma.blogPost.create({
      data: {
        dealerId: session.user.dealerId,
        title: result.data.title,
        slug: result.data.slug,
        excerpt: result.data.excerpt,
        content: result.data.content,
        coverImage: result.data.coverImage,
        isPublished: result.data.isPublished,
        publishedAt: result.data.isPublished ? new Date() : null,
      },
    });

    revalidatePath("/blog");
    return {
      message: "Blog yazısı oluşturuldu",
      success: true,
    };
  } catch (error) {
    console.error("Blog post creation error:", error);
    return {
      errors: { _form: ["Bir hata oluştu"] },
      success: false,
    };
  }
}

export async function updateBlogPostAction(
  id: string,
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const session = await auth();

  if (!session?.user?.dealerId) {
    return {
      errors: { _form: ["Yetkiniz yok"] },
      success: false,
    };
  }

  const result = blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || undefined,
    isPublished: formData.get("isPublished") === "true",
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    // Check if post exists and belongs to dealer
    const post = await prisma.blogPost.findFirst({
      where: {
        id,
        dealerId: session.user.dealerId,
      },
    });

    if (!post) {
      return {
        errors: { _form: ["Blog yazısı bulunamadı"] },
        success: false,
      };
    }

    // Check if slug is being changed and if new slug already exists
    if (result.data.slug !== post.slug) {
      const existing = await prisma.blogPost.findFirst({
        where: {
          dealerId: session.user.dealerId,
          slug: result.data.slug,
          id: { not: id },
        },
      });

      if (existing) {
        return {
          errors: { slug: ["Bu slug zaten kullanılıyor"] },
          success: false,
        };
      }
    }

    // If publishing for the first time, set publishedAt
    const wasPublished = post.isPublished;
    const willBePublished = result.data.isPublished;

    await prisma.blogPost.update({
      where: { id },
      data: {
        title: result.data.title,
        slug: result.data.slug,
        excerpt: result.data.excerpt,
        content: result.data.content,
        coverImage: result.data.coverImage,
        isPublished: result.data.isPublished,
        publishedAt:
          !wasPublished && willBePublished
            ? new Date()
            : wasPublished && !willBePublished
              ? null
              : post.publishedAt,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${result.data.slug}`);
    return {
      message: "Blog yazısı güncellendi",
      success: true,
    };
  } catch (error) {
    console.error("Blog post update error:", error);
    return {
      errors: { _form: ["Bir hata oluştu"] },
      success: false,
    };
  }
}

export async function deleteBlogPostAction(id: string): Promise<{
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

  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        id,
        dealerId: session.user.dealerId,
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Blog yazısı bulunamadı",
      };
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath("/blog");
    return {
      success: true,
      message: "Blog yazısı silindi",
    };
  } catch (error) {
    console.error("Blog post deletion error:", error);
    return {
      success: false,
      message: "Bir hata oluştu",
    };
  }
}
