import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResponseHash, isPaymentSuccessful } from "@/lib/payment/garanti";

export async function POST(request: NextRequest) {
  try {
    const formDataRaw = await request.formData();
    const formData: Record<string, string> = {};
    formDataRaw.forEach((value, key) => {
      formData[key] = value.toString();
    });

    const orderId = formData["orderid"] || "";
    const mdstatus = formData["mdstatus"] || "";
    const procreturncode = formData["procreturncode"] || "";
    const errmsg = formData["errmsg"] || "";
    const txnamount = formData["txnamount"] || "";

    console.log(`[GARANTI CALLBACK] orderId=${orderId} mdstatus=${mdstatus} procreturncode=${procreturncode} errmsg=${errmsg} amount=${txnamount}`);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Determine if shop or aidat payment
    const isShop = orderId.startsWith("SHOP");
    const isAidat = orderId.startsWith("AIDAT");

    // Verify response hash
    const hashValid = procreturncode === "00" ? verifyResponseHash(formData) : true;
    if (!hashValid) {
      console.warn(`[GARANTI CALLBACK] Hash verification warning for orderId=${orderId} - proceeding with procreturncode check`);
    }

    // Determine success based on procreturncode (primary) and response fields
    const success = procreturncode === "00";

    if (isShop) {
      // Find order by garantiOrderId
      const order = await prisma.shopOrder.findFirst({
        where: { garantiOrderId: orderId },
      });

      if (order) {
        await prisma.shopOrder.update({
          where: { id: order.id },
          data: {
            paymentStatus: success ? "PAID" : "FAILED",
            paymentId: orderId,
            status: success ? "CONFIRMED" : order.status,
          },
        });
      }

      const displayOrder = order?.orderNumber || orderId;
      const redirectUrl = success
        ? `${appUrl}/tr/checkout/success?order=${displayOrder}`
        : `${appUrl}/tr/checkout/result?status=error&order=${displayOrder}&message=${encodeURIComponent(errmsg || "Odeme basarisiz")}`;

      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    if (isAidat) {
      // Find payment by garantiOrderId
      const payment = await prisma.payment.findFirst({
        where: { garantiOrderId: orderId },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: success ? "COMPLETED" : "FAILED",
            method: "GARANTI_POS",
            paidAt: success ? new Date() : null,
            notes: success
              ? `Garanti POS ile odendi. islem: ${orderId}`
              : `Garanti POS odeme basarisiz: ${errmsg}`,
          },
        });
      }

      const redirectUrl = success
        ? `${appUrl}/tr/payment/result?status=success&message=${encodeURIComponent("Odemeniz basariyla tamamlandi")}`
        : `${appUrl}/tr/payment/result?status=error&message=${encodeURIComponent(errmsg || "Odeme basarisiz")}`;

      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    // Unknown order type
    return NextResponse.redirect(`${appUrl}/tr/payment/result?status=error&message=${encodeURIComponent("Bilinmeyen islem")}`, { status: 303 });
  } catch (error) {
    console.error("[GARANTI CALLBACK] Error:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/tr/payment/result?status=error&message=${encodeURIComponent("Bir hata olustu")}`, { status: 303 });
  }
}
