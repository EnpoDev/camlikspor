import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const profileSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmali"),
  phone: z.string().optional().nullable(),
});

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Oturum gerekli" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Gecersiz veri" },
        { status: 400 }
      );
    }

    const { name, phone } = result.data;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, phone: phone || null },
    });

    return NextResponse.json({ message: "Profil basariyla guncellendi" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Bir hata olustu" },
      { status: 500 }
    );
  }
}
