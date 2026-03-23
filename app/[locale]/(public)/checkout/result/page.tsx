"use client";

import { Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function CheckoutResultContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;

  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const order = searchParams.get("order");

  // This page is only for error states; success goes to /checkout/success
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Odeme Basarisiz
          </h1>

          {order && (
            <p className="text-sm text-slate-400 mb-2">
              Siparis: {order}
            </p>
          )}

          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {message
              ? decodeURIComponent(message)
              : "Odeme islemi sirasinda bir hata olustu. Lutfen tekrar deneyin."}
          </p>

          <div className="flex flex-col gap-3">
            <Link href={`/${locale}/shop`}>
              <Button className="w-full gap-2">
                <ShoppingBag className="h-4 w-4" />
                Magazaya Don
              </Button>
            </Link>
            <Link href={`/${locale}`}>
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Ana Sayfa
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Yukleniyor...</p>
        </div>
      }
    >
      <CheckoutResultContent />
    </Suspense>
  );
}
