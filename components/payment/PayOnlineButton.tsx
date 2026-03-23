"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PayOnlineButtonProps {
  paymentId: string;
  amount: number;
  email?: string;
  size?: "sm" | "default";
}

export function PayOnlineButton({ paymentId, amount, email, size = "sm" }: PayOnlineButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handlePay = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ paymentId });
      if (email) query.set("email", email);
      router.push(`/${locale}/payment/garanti?${query.toString()}`);
    } catch {
      toast.error("Odeme sayfasina yonlendirilemedi");
      setLoading(false);
    }
  };

  return (
    <Button
      size={size}
      onClick={handlePay}
      disabled={loading}
      className="gap-1.5 bg-primary hover:bg-primary/90"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <CreditCard className="h-3.5 w-3.5" />
      )}
      {amount.toFixed(2)} ₺ Ode
    </Button>
  );
}
