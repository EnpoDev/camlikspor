"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PaymentInquiryFormProps {
  dealerId: string;
  locale: string;
}

interface PaymentRecord {
  id: string;
  studentName: string;
  amount: number;
  dueDate: Date;
  paidAt: Date | null;
  status: "PAID" | "PENDING" | "OVERDUE";
  periodName: string;
}

interface InquiryResult {
  studentName: string;
  studentId: string;
  totalDebt: number;
  totalPaid: number;
  pendingPayments: PaymentRecord[];
  paidPayments: PaymentRecord[];
}

export function PaymentInquiryForm({ dealerId, locale }: PaymentInquiryFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Lütfen TC Kimlik No veya Telefon No girin");
      return;
    }

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/public/payment-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerId,
          query: searchQuery.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sorgulama başarısız");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Ödendi</Badge>;
      case "OVERDUE":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Gecikmiş</Badge>;
      case "PENDING":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Beklemede</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="searchQuery">TC Kimlik No veya Telefon No</Label>
          <div className="flex gap-2">
            <Input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="12345678901 veya 05551234567"
              className="flex-1"
              disabled={isSearching}
            />
            <Button type="submit" disabled={isSearching} className="bg-emerald-600 hover:bg-emerald-700">
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sorgulanıyor...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Sorgula
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-6">
            <p className="text-red-700 dark:text-red-300 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Student Info */}
          <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  {result.studentName}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-emerald-700 dark:text-emerald-300">Toplam Borç</p>
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                      {result.totalDebt.toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                  <div>
                    <p className="text-emerald-700 dark:text-emerald-300">Toplam Ödenen</p>
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                      {result.totalPaid.toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments */}
          {result.pendingPayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bekleyen Ödemeler</CardTitle>
                <CardDescription>Ödenmemiş aidat kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.pendingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{payment.periodName}</p>
                        <p className="text-sm text-muted-foreground">
                          Son Ödeme: {format(new Date(payment.dueDate), "d MMMM yyyy", { locale: tr })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold">{payment.amount.toLocaleString("tr-TR")} ₺</p>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paid Payments */}
          {result.paidPayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ödenen Kayıtlar</CardTitle>
                <CardDescription>Tamamlanmış ödemeler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.paidPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{payment.periodName}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.paidAt && `Ödeme: ${format(new Date(payment.paidAt), "d MMMM yyyy", { locale: tr })}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">
                          {payment.amount.toLocaleString("tr-TR")} ₺
                        </p>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No payments found */}
          {result.pendingPayments.length === 0 && result.paidPayments.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Ödeme kaydı bulunamadı</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
