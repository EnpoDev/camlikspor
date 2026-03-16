"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendParentCredentialsSMS } from "@/lib/sms/send-parent-credentials";

/**
 * Generates a random temporary password for parents
 */
export async function generateTemporaryPassword(): Promise<string> {
  // Generate 8-character password with letters and numbers
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Creates or updates a parent account for a student
 * If parent with same email exists, links student to existing parent
 */
export async function createOrLinkParent({
  dealerId,
  studentId,
  parentName,
  parentEmail,
  parentPhone,
  parentTcKimlik,
}: {
  dealerId: string;
  studentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentTcKimlik?: string | null;
}): Promise<{ parent: any; temporaryPassword?: string }> {
  // Check if parent already exists with this email
  const existingParent = await prisma.parent.findUnique({
    where: { email: parentEmail },
  });

  if (existingParent) {
    // Parent exists, just link to student
    await prisma.studentParent.create({
      data: {
        studentId,
        parentId: existingParent.id,
        relation: "PARENT",
      },
    });

    return { parent: existingParent };
  }

  // Create new parent account
  const temporaryPassword = await generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);

  const parent = await prisma.parent.create({
    data: {
      dealerId,
      email: parentEmail,
      passwordHash,
      name: parentName,
      phone: parentPhone,
      tcKimlikNo: parentTcKimlik || null,
      mustChangePassword: true, // Force password change on first login
    },
  });

  // Link student to parent
  await prisma.studentParent.create({
    data: {
      studentId,
      parentId: parent.id,
      relation: "PARENT",
    },
  });

  // Send SMS with temporary password
  if (temporaryPassword && parentPhone) {
    await sendParentCredentialsSMS(parentPhone, temporaryPassword);
  }

  return { parent, temporaryPassword };
}

/**
 * Gets all students for a parent
 */
export async function getParentStudents(parentId: string) {
  const studentParents = await prisma.studentParent.findMany({
    where: { parentId },
    include: {
      student: {
        include: {
          branch: true,
          location: true,
          facility: true,
          groups: {
            where: { isActive: true },
            include: {
              group: {
                include: {
                  schedules: true,
                  period: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return studentParents.map((sp) => sp.student);
}

/**
 * Gets payment summary for a student (for parent view)
 */
export async function getStudentPaymentSummaryForParent(studentId: string) {
  const payments = await prisma.payment.findMany({
    where: { studentId },
    orderBy: { dueDate: "desc" },
  });

  const pending = payments.filter((p) => p.status === "PENDING");
  const completed = payments.filter((p) => p.status === "COMPLETED");

  const totalDebt = pending.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = completed.reduce((sum, p) => sum + p.amount, 0);

  return {
    totalDebt,
    totalPaid,
    pendingPayments: pending,
    completedPayments: completed,
  };
}

/**
 * Gets attendance records for a student (for parent view)
 */
export async function getStudentAttendanceForParent(
  studentId: string,
  limit: number = 20
) {
  const attendances = await prisma.attendance.findMany({
    where: { studentId },
    include: {
      session: {
        include: {
          group: true,
        },
      },
    },
    orderBy: {
      session: {
        date: "desc",
      },
    },
    take: limit,
  });

  return attendances;
}
