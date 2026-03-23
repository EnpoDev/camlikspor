import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildOosFormFields, getGatewayUrl } from "@/lib/payment/garanti";
import { z } from "zod";

const initiateSchema = z.object({
  // For shop orders
  shopOrderId: z.string().optional(),
  // For aidat payments
  paymentId: z.string().optional(),
  // Customer info (required for aidat, optional for shop since it's in the order)
  customerEmail: z.string().email().optional(),
});

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = initiateSchema.parse(body);

    let orderId: string;
    let amount: number;
    let customerEmail: string;

    if (validated.shopOrderId) {
      // Shop order payment
      const order = await prisma.shopOrder.findUnique({
        where: { id: validated.shopOrderId },
      });

      if (!order) {
        return NextResponse.json({ message: "Siparis bulunamadi" }, { status: 404 });
      }

      if (order.paymentStatus === "PAID") {
        return NextResponse.json({ message: "Bu siparis zaten odendi" }, { status: 400 });
      }

      orderId = `SHOP-${order.orderNumber}`;
      amount = order.total;
      customerEmail = order.customerEmail;

      // Save garanti order id
      await prisma.shopOrder.update({
        where: { id: order.id },
        data: { garantiOrderId: orderId },
      });
    } else if (validated.paymentId) {
      // Aidat payment
      const payment = await prisma.payment.findUnique({
        where: { id: validated.paymentId },
        include: { student: true },
      });

      if (!payment) {
        return NextResponse.json({ message: "Odeme bulunamadi" }, { status: 404 });
      }

      if (payment.status === "COMPLETED") {
        return NextResponse.json({ message: "Bu odeme zaten tamamlandi" }, { status: 400 });
      }

      orderId = `AIDAT-${payment.id.slice(-8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      amount = payment.amount;
      customerEmail = validated.customerEmail || payment.student?.email || "noemail@camliksk.com";

      // Save garanti order id
      await prisma.payment.update({
        where: { id: payment.id },
        data: { garantiOrderId: orderId },
      });
    } else {
      return NextResponse.json({ message: "shopOrderId veya paymentId gerekli" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const customerIp = getClientIp(request);

    const formFields = buildOosFormFields({
      orderId,
      amount,
      customerEmail,
      customerIp,
      successUrl: `${appUrl}/api/payment/garanti/callback`,
      errorUrl: `${appUrl}/api/payment/garanti/callback`,
    });

    return NextResponse.json({
      gatewayUrl: getGatewayUrl(),
      formFields,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Gecersiz veri", errors: error.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Odeme baslatma hatasi" }, { status: 500 });
  }
}
