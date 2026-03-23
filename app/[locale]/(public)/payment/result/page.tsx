"use client";

import { Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;

  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const isSuccess = status === "success";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isSuccess
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-red-100 dark:bg-red-900/30"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {isSuccess ? "Odeme Basarili!" : "Odeme Basarisiz"}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {message
              ? decodeURIComponent(message)
              : isSuccess
              ? "Odemeniz basariyla tamamlandi."
              : "Odeme islemi sirasinda bir hata olustu. Lutfen tekrar deneyin."}
          </p>

          <div className="flex flex-col gap-3">
            <Link href={`/${locale}`}>
              <Button className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Ana Sayfaya Don
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Yukleniyor...</p>
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
