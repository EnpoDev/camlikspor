import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PARENT") {
      return NextResponse.json(
        { message: "Yetkisiz erisim" },
        { status: 401 }
      );
    }

    const parent = await prisma.parent.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        tcKimlikNo: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    if (!parent) {
      return NextResponse.json(
        { message: "Veli bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ parent });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: "Bir hata olustu" },
      { status: 500 }
    );
  }
}
