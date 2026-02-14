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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

export default function CashRegisterPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    category: "",
    description: "",
    paymentMethod: "cash",
    date: new Date().toISOString().split("T")[0],
  });

  const incomeCategories = [
    "Öğrenci Ödemesi",
    "Ürün Satışı",
    "Kayıt Ücreti",
    "Diğer Gelir",
  ];

  const expenseCategories = [
    "Kira",
    "Personel Maaşı",
    "Faturalar",
    "Malzeme Alımı",
    "Bakım-Onarım",
    "Diğer Gider",
  ];

  const paymentMethods = [
    { value: "cash", label: "Nakit" },
    { value: "credit_card", label: "Kredi Kartı" },
    { value: "bank_transfer", label: "Banka Transferi" },
    { value: "check", label: "Çek" },
  ];

  const handleAddTransaction = () => {
    if (!formData.amount || !formData.category) {
      toast.error("Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    console.log("Transaction Data:", formData);
    toast.success(
      `${formData.type === "income" ? "Gelir" : "Gider"} kaydedildi: ${formData.amount} TL`
    );

    // Reset form
    setFormData({
      type: "income",
      amount: "",
      category: "",
      description: "",
      paymentMethod: "cash",
      date: new Date().toISOString().split("T")[0],
    });
    setIsSheetOpen(false);
  };

  const handleButtonClick = () => {
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
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Yeni Kasa İşlemi</SheetTitle>
              <SheetDescription>
                Gelir veya gider kaydı oluşturun.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-6">
              {/* İşlem Tipi */}
              <div className="space-y-3">
                <Label>İşlem Tipi *</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value, category: "" })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="income" id="income" />
                    <Label
                      htmlFor="income"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Gelir
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label
                      htmlFor="expense"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      Gider
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Tutar */}
              <div className="space-y-2">
                <Label htmlFor="amount">Tutar (TL) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="text-lg"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.type === "income"
                      ? incomeCategories
                      : expenseCategories
                    ).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ödeme Yöntemi */}
              <div className="space-y-2">
                <Label htmlFor="payment">Ödeme Yöntemi</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger id="payment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tarih */}
              <div className="space-y-2">
                <Label htmlFor="date">Tarih</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              {/* Açıklama */}
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  placeholder="İşlem detayları (opsiyonel)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>

            <SheetFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSheetOpen(false)}
                className="w-full sm:w-auto"
              >
                İptal
              </Button>
              <Button
                onClick={handleAddTransaction}
                className="w-full sm:w-auto"
              >
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
