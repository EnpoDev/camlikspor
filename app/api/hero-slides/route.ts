import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const heroSlideSchema = z.object({
  dealerId: z.string(),
  image: z.string().min(1), // Allow both full URLs and relative paths
  badge: z.string().min(1),
  title: z.string().min(1),
  titleColor: z.string().default("#10b981"),
  subtitle: z.string().min(1),
  ctaPrimary: z.string().min(1),
  ctaPrimaryUrl: z.string().min(1),
  ctaSecondary: z.string().min(1),
  ctaSecondaryUrl: z.string().min(1),
  showCtaPrimary: z.boolean().default(true),
  showCtaSecondary: z.boolean().default(true),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = heroSlideSchema.parse(body);

    const heroSlide = await prisma.heroSlide.create({
      data: validatedData,
    });

    return NextResponse.json(heroSlide, { status: 201 });
  } catch (error) {
    console.error("Error creating hero slide:", error);

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
