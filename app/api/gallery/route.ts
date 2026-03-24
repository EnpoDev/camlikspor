import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const galleryImageSchema = z.object({
  dealerId: z.string(),
  url: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = galleryImageSchema.parse(body);

    const galleryImage = await prisma.galleryImage.create({
      data: validatedData,
    });

    return NextResponse.json(galleryImage, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);

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
