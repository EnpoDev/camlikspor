import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all legal documents for dealer
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.dealerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await prisma.legalDocument.findMany({
      where: {
        dealerId: session.user.dealerId,
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching legal documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST - Create new legal document
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.dealerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, fileUrl, isActive, sortOrder } = body;

    if (!title || !slug || !fileUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const document = await prisma.legalDocument.create({
      data: {
        dealerId: session.user.dealerId,
        title,
        slug,
        fileUrl,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating legal document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
