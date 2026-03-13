import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PARENT") {
      return NextResponse.json(
        { message: "Yetkisiz erisim" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Tum alanlar gerekli" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Yeni sifre en az 8 karakter olmali" },
        { status: 400 }
      );
    }

    // Get parent from database
    const parent = await prisma.parent.findUnique({
      where: { id: session.user.id },
    });

    if (!parent) {
      return NextResponse.json(
        { message: "Veli bulunamadi" },
        { status: 404 }
      );
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      parent.passwordHash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Mevcut sifre yanlis" },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password and clear mustChangePassword flag
    await prisma.parent.update({
      where: { id: parent.id },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
    });

    return NextResponse.json({
      message: "Sifre basariyla degistirildi",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Bir hata olustu" },
      { status: 500 }
    );
  }
}
