import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const preRegistrationSchema = z.object({
  dealerId: z.string().min(1, "Dealer ID gerekli"),
  parentName: z.string().min(2, "Veli adı gerekli"),
  studentName: z.string().min(2, "Öğrenci adı gerekli"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  email: z.string().email("Geçerli bir e-posta adresi girin").optional().or(z.literal("")),
  studentAge: z.string().min(1, "Öğrenci yaşı gerekli"),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = preRegistrationSchema.parse(body);

    // Verify dealer exists
    const dealer = await prisma.dealer.findUnique({
      where: { id: validatedData.dealerId, isActive: true },
    });

    if (!dealer) {
      return NextResponse.json(
        { message: "Geçersiz dealer" },
        { status: 400 }
      );
    }

    // Parse student name into first and last name
    const nameParts = validatedData.studentName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "-";

    // Create pre-registration record
    const preRegistration = await prisma.preRegistration.create({
      data: {
        dealerId: validatedData.dealerId,
        firstName,
        lastName,
        parentName: validatedData.parentName,
        parentPhone: validatedData.phone,
        parentEmail: validatedData.email || null,
        birthDate: calculateBirthDateFromAge(validatedData.studentAge),
        notes: validatedData.message || null,
        status: "PENDING",
        source: "website",
      },
    });

    return NextResponse.json({
      success: true,
      id: preRegistration.id,
      message: "Başvurunuz alındı",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Pre-registration error:", error);
    return NextResponse.json(
      { message: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}

function calculateBirthDateFromAge(ageString: string): Date {
  const age = parseInt(ageString, 10);
  if (isNaN(age)) {
    return new Date();
  }

  const today = new Date();
  const birthYear = today.getFullYear() - age;
  return new Date(birthYear, 0, 1);
}
