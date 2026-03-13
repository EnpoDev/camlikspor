import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const heroSlideUpdateSchema = z.object({
  image: z.string().min(1).optional(), // Allow both full URLs and relative paths
  badge: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  titleColor: z.string().optional(),
  subtitle: z.string().min(1).optional(),
  ctaPrimary: z.string().min(1).optional(),
  ctaPrimaryUrl: z.string().min(1).optional(),
  ctaSecondary: z.string().min(1).optional(),
  ctaSecondaryUrl: z.string().min(1).optional(),
  showCtaPrimary: z.boolean().optional(),
  showCtaSecondary: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || !session.user.dealerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = heroSlideUpdateSchema.parse(body);

    // Check if the slide exists and belongs to the user's dealer
    const existingSlide = await prisma.heroSlide.findFirst({
      where: {
        id,
        dealerId: session.user.dealerId,
      },
    });

    if (!existingSlide) {
      return NextResponse.json(
        { error: "Hero slide not found" },
        { status: 404 }
      );
    }

    const heroSlide = await prisma.heroSlide.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(heroSlide);
  } catch (error) {
    console.error("Error updating hero slide:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || !session.user.dealerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if the slide exists and belongs to the user's dealer
    const existingSlide = await prisma.heroSlide.findFirst({
      where: {
        id,
        dealerId: session.user.dealerId,
      },
    });

    if (!existingSlide) {
      return NextResponse.json(
        { error: "Hero slide not found" },
        { status: 404 }
      );
    }

    await prisma.heroSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
