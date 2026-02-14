"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CashRegisterPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddTransaction = () => {
    toast.success("İşlem ekleme formu yakında eklenecek");
    setIsSheetOpen(false);
  };

  const handleButtonClick = () => {
    console.log("Button clicked!");
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Kasa
          </h1>
          <p className="text-muted-foreground text-sm">
            Tüm Şubeler
          </p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              className="w-full sm:w-auto relative z-10"
              onClick={handleButtonClick}
            >
              <Plus className="mr-2 h-4 w-4" />
              İşlem Ekle
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Yeni İşlem Ekle</SheetTitle>
              <SheetDescription>
                Kasa işlemi eklemek için formu doldurun.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <p className="text-center text-muted-foreground">
                İşlem ekleme formu yakında eklenecek...
              </p>
            </div>
            <SheetFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="w-full sm:w-auto">
                İptal
              </Button>
              <Button onClick={handleAddTransaction} className="w-full sm:w-auto">
                Kaydet
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-600">
              Toplam Gelir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">0 TL</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-red-600">
              Toplam Gider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">0 TL</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Bakiye
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">0 TL</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Son İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground text-sm">
            Veri bulunamadı
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
