import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dealerSlug = searchParams.get("dealerSlug");

    if (!dealerSlug) {
      return NextResponse.json(
        { error: "Dealer slug is required" },
        { status: 400 }
      );
    }

    // Find dealer by slug
    const dealer = await prisma.dealer.findUnique({
      where: { slug: dealerSlug },
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    // Get active legal documents
    const documents = await prisma.legalDocument.findMany({
      where: {
        dealerId: dealer.id,
        isActive: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        fileUrl: true,
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching public legal documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
