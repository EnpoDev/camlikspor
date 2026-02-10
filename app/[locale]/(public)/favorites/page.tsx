"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useFavorites } from "@/lib/contexts/favorites-context";

export default function FavoritesPage() {
  const { locale } = useParams<{ locale: string }>();
  const { items, removeFavorite, clearFavorites } = useFavorites();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
              <Heart className="h-10 w-10 fill-white" />
              Favorilerim
            </h1>
            <p className="text-white/80 text-lg">
              {items.length} ürün favorilerinizde
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Heart className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Henüz favoriniz yok</h3>
              <p className="text-muted-foreground mb-6">
                Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
              </p>
              <Link href={`/${locale}/shop`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Mağazaya Git
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {items.length} ürün favorilerinizde
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={clearFavorites}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Tümünü Temizle
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card
                  key={item.productId}
                  className="group h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden bg-white dark:bg-slate-800"
                >
                  <Link href={`/${locale}/shop/${item.slug}`}>
                    <div className="aspect-square relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-slate-300" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <CardContent className="p-4">
                    <Link href={`/${locale}/shop/${item.slug}`}>
                      <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-emerald-600">
                        {formatPrice(item.price)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeFavorite(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
