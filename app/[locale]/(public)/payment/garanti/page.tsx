"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CreditCard } from "lucide-react";

export default function GarantiPaymentPage() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    gatewayUrl: string;
    formFields: Record<string, string>;
  } | null>(null);

  const shopOrderId = searchParams.get("shopOrderId");
  const paymentId = searchParams.get("paymentId");
  const customerEmail = searchParams.get("email");

  useEffect(() => {
    async function initiatePayment() {
      try {
        const body: Record<string, string> = {};
        if (shopOrderId) body.shopOrderId = shopOrderId;
        if (paymentId) body.paymentId = paymentId;
        if (customerEmail) body.customerEmail = customerEmail;

        const response = await fetch("/api/payment/garanti/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Odeme baslatilamadi");
        }

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata olustu");
      } finally {
        setLoading(false);
      }
    }

    if (shopOrderId || paymentId) {
      initiatePayment();
    } else {
      setError("Gecersiz odeme bilgisi");
      setLoading(false);
    }
  }, [shopOrderId, paymentId, customerEmail]);

  // Auto-submit form to Garanti gateway
  useEffect(() => {
    if (formData && formRef.current) {
      formRef.current.submit();
    }
  }, [formData]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Odeme Hatasi
          </h1>
          <p className="text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Garanti BBVA Odeme Sayfasina Yonlendiriliyorsunuz
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Lutfen bekleyin, kart bilgilerinizi girebileceginiz guvenli odeme sayfasina yonlendiriliyorsunuz...
        </p>
      </div>

      {/* Hidden auto-submit form */}
      {formData && (
        <form
          ref={formRef}
          method="POST"
          action={formData.gatewayUrl}
          style={{ display: "none" }}
        >
          {Object.entries(formData.formFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        </form>
      )}
    </div>
  );
}
