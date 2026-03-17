import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PARENT") {
      return NextResponse.json({ message: "Yetkisiz erisim" }, { status: 401 });
    }

    const { id } = await params;

    const message = await prisma.message.findUnique({
      where: { id },
      select: { parentId: true },
    });

    if (!message) {
      return NextResponse.json({ message: "Mesaj bulunamadi" }, { status: 404 });
    }

    if (message.parentId !== session.user.id) {
      return NextResponse.json({ message: "Yetkisiz erisim" }, { status: 403 });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/parent/messages/[id]/read error:", error);
    return NextResponse.json({ message: "Bir hata olustu" }, { status: 500 });
  }
}
