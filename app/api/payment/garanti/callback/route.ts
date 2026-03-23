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

    // Verify hash - only for successful transactions (mdstatus=1, procreturncode=00)
    const hashValid = procreturncode === "00" ? verifyResponseHash(formData) : true;

    if (procreturncode === "00" && !hashValid) {
      console.error(`[GARANTI CALLBACK] Hash verification FAILED for orderId=${orderId}`);
      // Redirect to error page
      const errorUrl = isShop
        ? `${appUrl}/tr/checkout/result?status=error&message=${encodeURIComponent("Guvenlik dogrulamasi basarisiz")}`
        : `${appUrl}/tr/payment/result?status=error&message=${encodeURIComponent("Guvenlik dogrulamasi basarisiz")}`;
      return NextResponse.redirect(errorUrl, { status: 303 });
    }

    const success = isPaymentSuccessful(formData);

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
