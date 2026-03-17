import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PARENT") {
      return NextResponse.json({ message: "Yetkisiz erisim" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { parentId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json({ message: "Bir hata olustu" }, { status: 500 });
  }
}
