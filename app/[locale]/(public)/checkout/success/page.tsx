import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  ShoppingBag,
  Home,
  ChevronRight,
  Package,
  ArrowRight,
} from "lucide-react";

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { locale } = await params;
  const { order: orderNumber } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href={`/${locale}`}
              className="hover:text-foreground flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              Ana Sayfa
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Siparis Onay</span>
          </nav>
        </div>
      </div>

      {/* Progress Steps - all completed */}
      <div className="bg-white dark:bg-slate-800 border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                Sepet
              </span>
            </div>
            <div className="flex-1 h-1 bg-emerald-600 rounded" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                Odeme
              </span>
            </div>
            <div className="flex-1 h-1 bg-emerald-600 rounded" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                Onay
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <Card className="border-0 shadow-xl">
            <CardContent className="pt-10 pb-10 px-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Tebrikler!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Siparisininiz basariyla olusturuldu.
                </p>
              </div>

              {orderNumber && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Siparis Numarasi
                  </p>
                  <p className="text-xl font-bold font-mono tracking-wider">
                    {orderNumber}
                  </p>
                </div>
              )}

              <div className="bg-emerald-50 dark:bg-emerald-950 rounded-xl p-4 text-sm text-emerald-800 dark:text-emerald-200 space-y-2">
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Siparisininiz en kisa surede hazirlanarak kargoya
                    verilecektir. Siparis durumu hakkinda e-posta ile
                    bilgilendirileceksiniz.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href={`/${locale}/shop`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Alisverise Devam Et
                  </Button>
                </Link>
                <Link href={`/${locale}`} className="flex-1">
                  <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                    Ana Sayfa
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
