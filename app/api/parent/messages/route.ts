import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PARENT") {
      return NextResponse.json({ message: "Yetkisiz erisim" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { parentId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET /api/parent/messages error:", error);
    return NextResponse.json({ message: "Bir hata olustu" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PARENT") {
      return NextResponse.json({ message: "Yetkisiz erisim" }, { status: 401 });
    }

    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json(
        { message: "Konu ve icerik gereklidir" },
        { status: 400 }
      );
    }

    if (subject.trim().length === 0 || content.trim().length === 0) {
      return NextResponse.json(
        { message: "Konu ve icerik bos olamaz" },
        { status: 400 }
      );
    }

    const parent = await prisma.parent.findUnique({
      where: { id: session.user.id },
      select: { dealerId: true, name: true },
    });

    if (!parent) {
      return NextResponse.json({ message: "Veli bulunamadi" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        parentId: session.user.id,
        dealerId: parent.dealerId,
        senderType: "PARENT",
        senderName: parent.name,
        subject: subject.trim(),
        content: content.trim(),
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("POST /api/parent/messages error:", error);
    return NextResponse.json({ message: "Bir hata olustu" }, { status: 500 });
  }
}
