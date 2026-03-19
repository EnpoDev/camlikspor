import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Rate limiter: 5 attempts / 15 minutes / IP
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: "Cok fazla deneme. Lutfen 15 dakika sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "STUDENT") {
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

    // Get student from database
    const student = await prisma.student.findUnique({
      where: { id: session.user.id },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Sporcu bulunamadi" },
        { status: 404 }
      );
    }

    if (!student.passwordHash) {
      return NextResponse.json(
        { message: "Sifre bilgisi bulunamadi" },
        { status: 400 }
      );
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      student.passwordHash
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
    await prisma.student.update({
      where: { id: student.id },
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
