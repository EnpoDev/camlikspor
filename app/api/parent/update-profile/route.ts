import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "PARENT") {
      return NextResponse.json(
        { message: "Yetkisiz erisim" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, email } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Ad Soyad zorunludur" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { message: "Ad Soyad en az 2 karakter olmalidir" },
        { status: 400 }
      );
    }

    // Validate phone format (Turkish phone: 05XX XXX XX XX)
    if (phone !== undefined && phone !== null && phone !== "") {
      const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
      const normalizedPhone = phone.toString().replace(/\s/g, "");
      if (!phoneRegex.test(normalizedPhone)) {
        return NextResponse.json(
          { message: "Gecerli bir telefon numarasi giriniz (05XX XXX XX XX)" },
          { status: 400 }
        );
      }
    }

    // Validate email format
    if (email !== undefined && email !== null && email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { message: "Gecerli bir e-posta adresi giriniz" },
          { status: 400 }
        );
      }

      // Check email uniqueness excluding the current parent
      const existingParent = await prisma.parent.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: session.user.id },
        },
      });

      if (existingParent) {
        return NextResponse.json(
          { message: "Bu e-posta adresi baska bir hesap tarafindan kullaniliyor" },
          { status: 409 }
        );
      }
    }

    // Build update data object
    const updateData: { name: string; phone?: string; email?: string } = {
      name: name.trim(),
    };

    if (phone !== undefined && phone !== null && phone !== "") {
      updateData.phone = phone.toString().replace(/\s/g, "");
    }

    if (email !== undefined && email !== null && email !== "") {
      updateData.email = email.toLowerCase();
    }

    const updatedParent = await prisma.parent.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        tcKimlikNo: true,
      },
    });

    return NextResponse.json({
      message: "Profil basariyla guncellendi",
      parent: updatedParent,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Bir hata olustu. Lutfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
