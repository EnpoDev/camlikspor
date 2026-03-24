import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const galleryImageUpdateSchema = z.object({
  url: z.string().min(1).optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
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
    const validatedData = galleryImageUpdateSchema.parse(body);

    const existing = await prisma.galleryImage.findFirst({
      where: {
        id,
        dealerId: session.user.dealerId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
      );
    }

    const galleryImage = await prisma.galleryImage.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(galleryImage);
  } catch (error) {
    console.error("Error updating gallery image:", error);

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

    const existing = await prisma.galleryImage.findFirst({
      where: {
        id,
        dealerId: session.user.dealerId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
      );
    }

    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
