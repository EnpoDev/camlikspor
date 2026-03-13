"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, CheckCircle, XCircle, Clock, CreditCard } from "lucide-react";

export default function PaymentInquiryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <CreditCard className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-slate-900 dark:text-white">
            Aidat Sorgulama
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            TC Kimlik Numaranız veya Telefon Numaranız ile aidat bilgilerinizi sorgulayabilirsiniz
          </p>
        </div>

        {/* Search Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Ödeme Bilgisi Sorgula
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg">
                <p className="text-red-700 dark:text-red-300 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  {error}
                </p>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="mt-6 space-y-6">
                {/* Student Name Header */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    {result.studentName}
                  </h3>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                    <CardContent className="p-4">
                      <p className="text-sm text-red-700 dark:text-red-300 mb-1">Toplam Borç</p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                        {result.totalDebt.toLocaleString("tr-TR")} ₺
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                    <CardContent className="p-4">
                      <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">Bu Ay Ödenecek</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        {result.currentMonthDebt.toLocaleString("tr-TR")} ₺
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                    <CardContent className="p-4">
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Gelecek Aidatlar</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {result.futurePaymentsTotal.toLocaleString("tr-TR")} ₺
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
                    <CardContent className="p-4">
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Toplam Ödenen</p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {result.totalPaid.toLocaleString("tr-TR")} ₺
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Pending Payments */}
                {result.pendingPayments?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                        Bekleyen Ödemeler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {result.pendingPayments.map((payment: any) => (
                          <div key={payment.id} className="p-3 border rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium">{payment.periodName}</p>
                              <p className="text-sm text-muted-foreground">
                                Vade: {new Date(payment.dueDate).toLocaleDateString("tr-TR")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{payment.amount.toLocaleString("tr-TR")} ₺</p>
                              <Badge variant="secondary">Beklemede</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Future Payments */}
                {result.futurePayments?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Gelecek Dönem Aidatları
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dönem</TableHead>
                            <TableHead>Vade Tarihi</TableHead>
                            <TableHead className="text-right">Tutar</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.futurePayments.map((fp: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{fp.periodName}</TableCell>
                              <TableCell>{new Date(fp.dueDate).toLocaleDateString("tr-TR")}</TableCell>
                              <TableCell className="text-right font-semibold">
                                {fp.amount.toLocaleString("tr-TR")} ₺
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {/* Paid Payments */}
                {result.paidPayments?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        Ödenen Ödemeler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dönem</TableHead>
                            <TableHead>Vade Tarihi</TableHead>
                            <TableHead>Ödeme Tarihi</TableHead>
                            <TableHead className="text-right">Tutar</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.paidPayments.map((payment: any) => (
                            <TableRow key={payment.id}>
                              <TableCell className="font-medium">{payment.periodName}</TableCell>
                              <TableCell>{new Date(payment.dueDate).toLocaleDateString("tr-TR")}</TableCell>
                              <TableCell>
                                {payment.paidAt
                                  ? new Date(payment.paidAt).toLocaleDateString("tr-TR")
                                  : "-"}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {payment.amount.toLocaleString("tr-TR")} ₺
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Button for Pending Payments */}
        {result && result.pendingPayments?.length > 0 && (
          <Card className="mt-6 border-2 border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    💳 Online Ödeme
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Bekleyen ödemelerinizi hemen online olarak yapabilirsiniz
                  </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Online Ödeme Yap
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Nasıl Sorgularım?
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                TC Kimlik Numaranızı (11 haneli) veya kayıtlı telefon numaranızı (05XXXXXXXXX) girin.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-900">
            <CardContent className="p-6">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                🔒 Güvenli Sorgulama
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Tüm bilgileriniz şifrelenmiş ve güvenli şekilde saklanmaktadır.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-900">
            <CardContent className="p-6">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                📞 Destek Hattı
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Sorularınız için:<br />
                <strong className="text-base">0532 241 24 31</strong>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Print Button */}
        {result && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Yazdır
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
