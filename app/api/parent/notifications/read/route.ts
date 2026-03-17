import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PARENT") {
      return NextResponse.json({ message: "Yetkisiz erisim" }, { status: 401 });
    }

    const body = await req.json();
    const ids: string[] = body?.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Gecerli bildirim id listesi gerekli" },
        { status: 400 }
      );
    }

    // Only allow marking notifications that belong to the current parent
    await prisma.notification.updateMany({
      where: {
        id: { in: ids },
        parentId: session.user.id,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json({ message: "Bir hata olustu" }, { status: 500 });
  }
}
