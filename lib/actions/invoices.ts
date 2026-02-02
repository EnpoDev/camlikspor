"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface CreateInvoiceData {
  studentId: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  dueDate: Date;
  periodMonth?: number;
  periodYear?: number;
  discountAmount?: number;
  taxRate?: number;
  notes?: string;
}

export interface InvoiceResult {
  success: boolean;
  message: string;
  invoiceId?: string;
}

/**
 * Generate next invoice number
 */
async function generateInvoiceNumber(dealerId: string): Promise<string> {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      dealerId,
      invoiceNo: {
        startsWith: `INV-${year}${month}`,
      },
    },
    orderBy: { invoiceNo: "desc" },
  });

  let sequence = 1;
  if (lastInvoice) {
    const lastSeq = parseInt(lastInvoice.invoiceNo.split("-")[2], 10);
    sequence = lastSeq + 1;
  }

  return `INV-${year}${month}-${String(sequence).padStart(4, "0")}`;
}

/**
 * Create a new invoice
 */
export async function createInvoice(data: CreateInvoiceData): Promise<InvoiceResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  const dealerId = session.user.dealerId;

  if (!dealerId && session.user.role !== UserRole.SUPER_ADMIN) {
    return { success: false, message: "Yetkisiz işlem" };
  }

  if (!data.items.length) {
    return { success: false, message: "En az bir kalem gerekli" };
  }

  try {
    // Verify student belongs to dealer
    const student = await prisma.student.findFirst({
      where: {
        id: data.studentId,
        ...(dealerId ? { dealerId } : {}),
      },
    });

    if (!student) {
      return { success: false, message: "Öğrenci bulunamadı" };
    }

    // Calculate totals
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const discountAmount = data.discountAmount || 0;
    const taxRate = data.taxRate || 0;
    const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
    const total = subtotal - discountAmount + taxAmount;

    // Generate invoice number
    const invoiceNo = await generateInvoiceNumber(student.dealerId);

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        dealerId: student.dealerId,
        studentId: data.studentId,
        invoiceNo,
        issueDate: new Date(),
        dueDate: data.dueDate,
        periodMonth: data.periodMonth,
        periodYear: data.periodYear,
        subtotal,
        discountAmount,
        taxAmount,
        total,
        status: "DRAFT",
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
    });

    revalidatePath("/invoices");

    return {
      success: true,
      message: "Fatura oluşturuldu",
      invoiceId: invoice.id,
    };
  } catch (error) {
    console.error("Create invoice error:", error);
    return { success: false, message: "Fatura oluşturulurken bir hata oluştu" };
  }
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  status: string,
  paymentDetails?: {
    paidAmount?: number;
    paymentMethod?: string;
  }
): Promise<InvoiceResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  const dealerId = session.user.dealerId;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        ...(dealerId ? { dealerId } : {}),
      },
    });

    if (!invoice) {
      return { success: false, message: "Fatura bulunamadı" };
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        ...(status === "PAID"
          ? {
              paidAt: new Date(),
              paidAmount: paymentDetails?.paidAmount || invoice.total,
              paymentMethod: paymentDetails?.paymentMethod,
            }
          : {}),
      },
    });

    revalidatePath("/invoices");

    return { success: true, message: "Fatura güncellendi" };
  } catch (error) {
    console.error("Update invoice status error:", error);
    return { success: false, message: "Fatura güncellenirken bir hata oluştu" };
  }
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(invoiceId: string): Promise<InvoiceResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  const dealerId = session.user.dealerId;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        ...(dealerId ? { dealerId } : {}),
      },
    });

    if (!invoice) {
      return { success: false, message: "Fatura bulunamadı" };
    }

    if (invoice.status === "PAID") {
      return { success: false, message: "Ödenmiş fatura silinemez" };
    }

    await prisma.invoice.delete({
      where: { id: invoiceId },
    });

    revalidatePath("/invoices");

    return { success: true, message: "Fatura silindi" };
  } catch (error) {
    console.error("Delete invoice error:", error);
    return { success: false, message: "Fatura silinirken bir hata oluştu" };
  }
}

/**
 * Get invoice list for dealer
 */
export async function getInvoices(options?: {
  page?: number;
  limit?: number;
  status?: string;
  studentId?: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, invoices: [], total: 0 };
  }

  const dealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? undefined
      : session.user.dealerId;

  const page = options?.page || 1;
  const limit = options?.limit || 20;

  try {
    const where = {
      ...(dealerId ? { dealerId } : {}),
      ...(options?.status ? { status: options.status } : {}),
      ...(options?.studentId ? { studentId: options.studentId } : {}),
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              parentName: true,
              parentPhone: true,
            },
          },
          items: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      success: true,
      invoices,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Get invoices error:", error);
    return { success: false, invoices: [], total: 0 };
  }
}

/**
 * Get single invoice by ID
 */
export async function getInvoice(invoiceId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const dealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? undefined
      : session.user.dealerId;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        ...(dealerId ? { dealerId } : {}),
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            parentName: true,
            parentPhone: true,
            parentEmail: true,
            address: true,
          },
        },
        dealer: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
            taxNumber: true,
            logo: true,
          },
        },
        items: true,
      },
    });

    return invoice;
  } catch (error) {
    console.error("Get invoice error:", error);
    return null;
  }
}

/**
 * Get invoice statistics
 */
export async function getInvoiceStats() {
  const session = await auth();

  if (!session?.user?.id) {
    return { draft: 0, sent: 0, paid: 0, overdue: 0, totalAmount: 0 };
  }

  const dealerId =
    session.user.role === UserRole.SUPER_ADMIN
      ? undefined
      : session.user.dealerId;

  const where = dealerId ? { dealerId } : {};

  try {
    const [draft, sent, paid, overdue, totalPaid] = await Promise.all([
      prisma.invoice.count({ where: { ...where, status: "DRAFT" } }),
      prisma.invoice.count({ where: { ...where, status: "SENT" } }),
      prisma.invoice.count({ where: { ...where, status: "PAID" } }),
      prisma.invoice.count({
        where: {
          ...where,
          status: { in: ["DRAFT", "SENT"] },
          dueDate: { lt: new Date() },
        },
      }),
      prisma.invoice.aggregate({
        where: { ...where, status: "PAID" },
        _sum: { paidAmount: true },
      }),
    ]);

    return {
      draft,
      sent,
      paid,
      overdue,
      totalAmount: totalPaid._sum.paidAmount || 0,
    };
  } catch (error) {
    console.error("Get invoice stats error:", error);
    return { draft: 0, sent: 0, paid: 0, overdue: 0, totalAmount: 0 };
  }
}

/**
 * Generate bulk invoices for monthly fees
 */
export async function generateMonthlyInvoices(
  month: number,
  year: number
): Promise<{
  success: boolean;
  message: string;
  count?: number;
}> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Oturum açmanız gerekiyor" };
  }

  const dealerId = session.user.dealerId;

  if (!dealerId && session.user.role !== UserRole.SUPER_ADMIN) {
    return { success: false, message: "Yetkisiz işlem" };
  }

  try {
    // Get active students with monthly fees
    const students = await prisma.student.findMany({
      where: {
        ...(dealerId ? { dealerId } : {}),
        isActive: true,
        monthlyFee: { gt: 0 },
      },
      select: {
        id: true,
        dealerId: true,
        firstName: true,
        lastName: true,
        monthlyFee: true,
        discountAmount: true,
      },
    });

    // Check for existing invoices this month
    const existingInvoices = await prisma.invoice.findMany({
      where: {
        periodMonth: month,
        periodYear: year,
        studentId: { in: students.map((s) => s.id) },
      },
      select: { studentId: true },
    });

    const existingStudentIds = new Set(existingInvoices.map((i) => i.studentId));
    const newStudents = students.filter((s) => !existingStudentIds.has(s.id));

    if (newStudents.length === 0) {
      return {
        success: true,
        message: "Bu dönem için tüm faturalar zaten oluşturulmuş",
        count: 0,
      };
    }

    // Create invoices for each student
    const dueDate = new Date(year, month, 15); // 15th of the month

    for (const student of newStudents) {
      const invoiceNo = await generateInvoiceNumber(student.dealerId);
      const subtotal = student.monthlyFee;
      const discountAmount = student.discountAmount || 0;
      const total = subtotal - discountAmount;

      await prisma.invoice.create({
        data: {
          dealerId: student.dealerId,
          studentId: student.id,
          invoiceNo,
          issueDate: new Date(),
          dueDate,
          periodMonth: month,
          periodYear: year,
          subtotal,
          discountAmount,
          taxAmount: 0,
          total,
          status: "DRAFT",
          items: {
            create: {
              description: `${year} ${getMonthName(month)} Ayı Aidat`,
              quantity: 1,
              unitPrice: subtotal,
              total: subtotal,
            },
          },
        },
      });
    }

    revalidatePath("/invoices");

    return {
      success: true,
      message: `${newStudents.length} fatura oluşturuldu`,
      count: newStudents.length,
    };
  } catch (error) {
    console.error("Generate monthly invoices error:", error);
    return { success: false, message: "Faturalar oluşturulurken bir hata oluştu" };
  }
}

function getMonthName(month: number): string {
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  return months[month - 1] || "";
}
