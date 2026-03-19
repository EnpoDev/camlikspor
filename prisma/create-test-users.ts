import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const dealer = await prisma.dealer.findFirst({ where: { slug: "camlikspor" } });
  if (dealer === null) {
    console.log("Dealer not found. Run seed first.");
    return;
  }

  const branch = await prisma.branch.findFirst({ where: { dealerId: dealer.id } });
  const location = await prisma.location.findFirst({ where: { dealerId: dealer.id } });
  const facility = await prisma.facility.findFirst({ where: { dealerId: dealer.id } });
  const period = await prisma.period.findFirst({ where: { dealerId: dealer.id } });

  const passwordHash = await bcrypt.hash("Test1234", 12);

  // Create parent
  const parent = await prisma.parent.upsert({
    where: { email: "veli@test.com" },
    update: {},
    create: {
      email: "veli@test.com",
      passwordHash,
      name: "Ahmet Yılmaz",
      phone: "05551234567",
      isActive: true,
      mustChangePassword: false,
      dealerId: dealer.id,
    },
  });
  console.log("Parent created:", parent.email);

  // Create student
  const existingStudent = await prisma.student.findFirst({ where: { email: "ogrenci@test.com" } });
  let student;
  if (existingStudent) {
    student = existingStudent;
    console.log("Student already exists:", student.email);
  } else {
    student = await prisma.student.create({
      data: {
        firstName: "Ege",
        lastName: "Yılmaz",
        studentNumber: "2024001",
        email: "ogrenci@test.com",
        passwordHash,
        phone: "05559876543",
        birthDate: new Date("2012-05-15"),
        gender: "MALE",
        parentName: "Ahmet Yılmaz",
        parentPhone: "05551234567",
        parentEmail: "veli@test.com",
        isActive: true,
        mustChangePassword: false,
        dealerId: dealer.id,
        branchId: branch?.id ?? "",
        locationId: location?.id ?? "",
        facilityId: facility?.id ?? "",
      },
    });
    console.log("Student created:", student.email);
  }

  // Link parent to student
  const existingLink = await prisma.studentParent.findFirst({
    where: { studentId: student.id, parentId: parent.id },
  });
  if (existingLink === null) {
    await prisma.studentParent.create({
      data: {
        studentId: student.id,
        parentId: parent.id,
        relation: "FATHER",
      },
    });
    console.log("Parent linked to student");
  }

  console.log("\n=== Test Giriş Bilgileri ===");
  console.log("Veli Paneli:    veli@test.com / Test1234");
  console.log("Öğrenci Paneli: ogrenci@test.com / Test1234");
}

main().catch(console.error).finally(() => prisma.$disconnect());
