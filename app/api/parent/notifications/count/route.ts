import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PARENT") {
      return NextResponse.json({ message: "Yetkisiz erisim" }, { status: 401 });
    }

    const unreadCount = await prisma.notification.count({
      where: {
        parentId: session.user.id,
        isRead: false,
      },
    });

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("Notifications count GET error:", error);
    return NextResponse.json({ message: "Bir hata olustu" }, { status: 500 });
  }
}
