import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendRefundRequest } from "@/lib/payment/garanti";
import { z } from "zod";

const refundSchema = z.object({
  // Shop order refund
  shopOrderId: z.string().optional(),
  // Aidat payment refund
  paymentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Yetkisiz erisim" }, { status: 401 });
    }

    // Only SUPER_ADMIN and DEALER_ADMIN can refund
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "DEALER_ADMIN") {
      return NextResponse.json({ message: "Iade yetkisi yok" }, { status: 403 });
    }

    const body = await request.json();
    const validated = refundSchema.parse(body);

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (validated.shopOrderId) {
      // Shop order refund
      const order = await prisma.shopOrder.findUnique({
        where: { id: validated.shopOrderId },
      });

      if (!order) {
        return NextResponse.json({ message: "Siparis bulunamadi" }, { status: 404 });
      }

      if (order.paymentStatus === "REFUNDED") {
        return NextResponse.json({ message: "Bu siparis zaten iade edilmis" }, { status: 400 });
      }

      if (order.paymentStatus !== "PAID") {
        return NextResponse.json({ message: "Bu siparis odenmemis, iade yapilamaz" }, { status: 400 });
      }

      // Check dealer authorization
      if (session.user.role === "DEALER_ADMIN" && order.dealerId !== session.user.dealerId) {
        return NextResponse.json({ message: "Bu siparise erisim yetkiniz yok" }, { status: 403 });
      }

      const garantiOrderId = order.garantiOrderId || order.paymentId;
      if (!garantiOrderId) {
        return NextResponse.json(
          { message: "Bu siparis Garanti POS ile odenmemis, manuel iade yapmaniz gerekiyor" },
          { status: 400 }
        );
      }

      const result = await sendRefundRequest({
        orderId: garantiOrderId,
        amount: order.total,
        customerIp: clientIp,
      });

      if (result.success) {
        await prisma.shopOrder.update({
          where: { id: order.id },
          data: {
            paymentStatus: "REFUNDED",
            status: "CANCELLED",
          },
        });

        // Restore stock for order items
        const items = await prisma.shopOrderItem.findMany({
          where: { orderId: order.id },
        });

        for (const item of items) {
          if (item.variantId) {
            await prisma.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      }

      return NextResponse.json({
        success: result.success,
        message: result.message,
      });
    }

    if (validated.paymentId) {
      // Aidat payment refund
      const payment = await prisma.payment.findUnique({
        where: { id: validated.paymentId },
      });

      if (!payment) {
        return NextResponse.json({ message: "Odeme bulunamadi" }, { status: 404 });
      }

      if (payment.status !== "COMPLETED") {
        return NextResponse.json({ message: "Bu odeme tamamlanmamis, iade yapilamaz" }, { status: 400 });
      }

      if (payment.method !== "GARANTI_POS") {
        return NextResponse.json(
          { message: "Bu odeme Garanti POS ile yapilmamis, manuel iade yapmaniz gerekiyor" },
          { status: 400 }
        );
      }

      // Check dealer authorization
      if (session.user.role === "DEALER_ADMIN" && payment.dealerId !== session.user.dealerId) {
        return NextResponse.json({ message: "Bu odemeye erisim yetkiniz yok" }, { status: 403 });
      }

      const garantiOrderId = payment.garantiOrderId;
      if (!garantiOrderId) {
        return NextResponse.json(
          { message: "Garanti POS islem bilgisi bulunamadi" },
          { status: 400 }
        );
      }

      const result = await sendRefundRequest({
        orderId: garantiOrderId,
        amount: payment.amount,
        customerIp: clientIp,
      });

      if (result.success) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "REFUNDED",
            notes: `Garanti POS iade yapildi. ${payment.notes || ""}`.trim(),
          },
        });
      }

      return NextResponse.json({
        success: result.success,
        message: result.message,
      });
    }

    return NextResponse.json({ message: "shopOrderId veya paymentId gerekli" }, { status: 400 });
  } catch (error) {
    console.error("Refund error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Gecersiz veri" }, { status: 400 });
    }

    return NextResponse.json({ message: "Iade islemi basarisiz" }, { status: 500 });
  }
}
