"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Undo2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RefundButtonProps {
  shopOrderId?: string;
  paymentId?: string;
  amount: number;
  disabled?: boolean;
}

export function RefundButton({ shopOrderId, paymentId, amount, disabled }: RefundButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRefund = async () => {
    setLoading(true);
    try {
      const body: Record<string, string> = {};
      if (shopOrderId) body.shopOrderId = shopOrderId;
      if (paymentId) body.paymentId = paymentId;

      const response = await fetch("/api/payment/garanti/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Iade basariyla tamamlandi");
        router.refresh();
      } else {
        toast.error(result.message || "Iade islemi basarisiz");
      }
    } catch {
      toast.error("Iade istegi gonderilemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabled || loading}
          className="gap-1.5"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Undo2 className="h-4 w-4" />
          )}
          Iade Et
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Iade Onayı</AlertDialogTitle>
          <AlertDialogDescription>
            {amount.toFixed(2)} ₺ tutarindaki odeme Garanti POS uzerinden iade edilecek.
            Bu islem geri alinamaz. Devam etmek istiyor musunuz?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Vazgec</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRefund}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Iade yapiliyor..." : "Iade Et"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
