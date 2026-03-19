"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, CheckCircle, XCircle, Clock, CreditCard, Shield, Phone, HelpCircle, Printer } from "lucide-react";

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

  const handlePrint = useCallback(() => {
    const printContent = document.getElementById("print-area");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Aidat Sorgulama Raporu</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; padding: 2rem; }
          h1 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
          h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
          h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
          .header { border-bottom: 3px solid #1e293b; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .header small { color: #64748b; font-size: 0.875rem; }
          .student-name { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; background: #f1f5f9; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
          .summary-card { border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; }
          .summary-card .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.25rem; }
          .summary-card .value { font-size: 1.25rem; font-weight: 900; }
          .section { margin-bottom: 1.5rem; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; padding: 0.5rem; border-bottom: 2px solid #e2e8f0; }
          td { padding: 0.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; }
          .text-right { text-align: right; }
          .font-bold { font-weight: 700; }
          .payment-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f8fafc; border-radius: 0.5rem; margin-bottom: 0.5rem; }
          .badge { display: inline-block; font-size: 0.75rem; font-weight: 700; padding: 0.125rem 0.5rem; background: #e2e8f0; border-radius: 0.25rem; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark */}
      <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            Aidat Sorgulama
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
            Ödeme Sorgulama
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-white/70 animate-fade-in-up">
            TC Kimlik Numaranız veya Telefon Numaranız ile aidat bilgilerinizi sorgulayabilirsiniz
          </p>
        </div>
      </div>

      {/* Accent Bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-1" />
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Sorgulama
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Aidat Bilgileriniz
          </h2>
        </div>

        {/* Search Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchQuery" className="font-bold text-slate-900">
                  TC Kimlik No veya Telefon No
                </Label>
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
                  <Button type="submit" disabled={isSearching} className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
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
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 flex items-center gap-2 font-medium">
                  <XCircle className="h-5 w-5" />
                  {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hidden print area — rendered but not visible on screen */}
        {result && (
          <div id="print-area" className="hidden">
            <div className="header">
              <h1>Aidat Sorgulama Raporu</h1>
              <small>Tarih: {new Date().toLocaleDateString("tr-TR")}</small>
            </div>
            <div className="student-name">{result.studentName}</div>
            <div className="summary">
              <div className="summary-card">
                <div className="label">Toplam Borç</div>
                <div className="value">{result.totalDebt.toLocaleString("tr-TR")} ₺</div>
              </div>
              <div className="summary-card">
                <div className="label">Bu Ay Ödenecek</div>
                <div className="value">{result.currentMonthDebt.toLocaleString("tr-TR")} ₺</div>
              </div>
              <div className="summary-card">
                <div className="label">Gelecek Aidatlar</div>
                <div className="value">{result.futurePaymentsTotal.toLocaleString("tr-TR")} ₺</div>
              </div>
              <div className="summary-card">
                <div className="label">Toplam Ödenen</div>
                <div className="value">{result.totalPaid.toLocaleString("tr-TR")} ₺</div>
              </div>
            </div>

            {result.pendingPayments?.length > 0 && (
              <div className="section">
                <h2>Bekleyen Ödemeler</h2>
                {result.pendingPayments.map((payment: any) => (
                  <div key={payment.id} className="payment-row">
                    <div>
                      <div className="font-bold">{payment.periodName}</div>
                      <small>Vade: {new Date(payment.dueDate).toLocaleDateString("tr-TR")}</small>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{payment.amount.toLocaleString("tr-TR")} ₺</div>
                      <span className="badge">Beklemede</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.futurePayments?.length > 0 && (
              <div className="section">
                <h2>Gelecek Dönem Aidatları</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Dönem</th>
                      <th>Vade Tarihi</th>
                      <th className="text-right">Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.futurePayments.map((fp: any, index: number) => (
                      <tr key={index}>
                        <td>{fp.periodName}</td>
                        <td>{new Date(fp.dueDate).toLocaleDateString("tr-TR")}</td>
                        <td className="text-right font-bold">{fp.amount.toLocaleString("tr-TR")} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.paidPayments?.length > 0 && (
              <div className="section">
                <h2>Ödenen Ödemeler</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Dönem</th>
                      <th>Vade Tarihi</th>
                      <th>Ödeme Tarihi</th>
                      <th className="text-right">Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.paidPayments.map((payment: any) => (
                      <tr key={payment.id}>
                        <td>{payment.periodName}</td>
                        <td>{new Date(payment.dueDate).toLocaleDateString("tr-TR")}</td>
                        <td>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString("tr-TR") : "-"}</td>
                        <td className="text-right font-bold">{payment.amount.toLocaleString("tr-TR")} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Results — visible on screen */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Student Name Header */}
            <Card className="border-0 shadow-lg bg-slate-900">
              <CardContent className="p-6">
                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                  {result.studentName}
                </h3>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Toplam Borç</p>
                  <p className="text-2xl font-black text-slate-900">
                    {result.totalDebt.toLocaleString("tr-TR")} ₺
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Bu Ay Ödenecek</p>
                  <p className="text-2xl font-black text-slate-900">
                    {result.currentMonthDebt.toLocaleString("tr-TR")} ₺
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Gelecek Aidatlar</p>
                  <p className="text-2xl font-black text-slate-900">
                    {result.futurePaymentsTotal.toLocaleString("tr-TR")} ₺
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Toplam Ödenen</p>
                  <p className="text-2xl font-black text-slate-900">
                    {result.totalPaid.toLocaleString("tr-TR")} ₺
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Payments */}
            {result.pendingPayments?.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <CardTitle className="font-bold uppercase tracking-wide">
                      Bekleyen Ödemeler
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.pendingPayments.map((payment: any) => (
                      <div key={payment.id} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">{payment.periodName}</p>
                          <p className="text-sm text-slate-500">
                            Vade: {new Date(payment.dueDate).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-lg text-slate-900">{payment.amount.toLocaleString("tr-TR")} ₺</p>
                          <Badge variant="secondary" className="font-bold">Beklemede</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Future Payments */}
            {result.futurePayments?.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="font-bold uppercase tracking-wide">
                      Gelecek Dönem Aidatları
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold uppercase tracking-wide text-xs">Dönem</TableHead>
                        <TableHead className="font-bold uppercase tracking-wide text-xs">Vade Tarihi</TableHead>
                        <TableHead className="text-right font-bold uppercase tracking-wide text-xs">Tutar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.futurePayments.map((fp: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{fp.periodName}</TableCell>
                          <TableCell>{new Date(fp.dueDate).toLocaleDateString("tr-TR")}</TableCell>
                          <TableCell className="text-right font-bold">
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
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="font-bold uppercase tracking-wide">
                      Ödenen Ödemeler
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold uppercase tracking-wide text-xs">Dönem</TableHead>
                        <TableHead className="font-bold uppercase tracking-wide text-xs">Vade Tarihi</TableHead>
                        <TableHead className="font-bold uppercase tracking-wide text-xs">Ödeme Tarihi</TableHead>
                        <TableHead className="text-right font-bold uppercase tracking-wide text-xs">Tutar</TableHead>
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
                          <TableCell className="text-right font-bold">
                            {payment.amount.toLocaleString("tr-TR")} ₺
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Online Payment CTA */}
            {result.pendingPayments?.length > 0 && (
              <div className="bg-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">
                    Online Ödeme
                  </h3>
                  <p className="text-white/70">
                    Bekleyen ödemelerinizi hemen online olarak yapabilirsiniz
                  </p>
                </div>
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:-translate-y-0.5 transition-all duration-300 shadow-lg font-bold">
                  Online Ödeme Yap
                </Button>
              </div>
            )}

            {/* Print Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="shadow-md hover:shadow-lg transition-all duration-300 gap-2"
              >
                <Printer className="h-4 w-4" />
                Yazdır
              </Button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-16">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                Yardım
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
              Sık Sorulan Sorular
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Nasıl Sorgularım?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  TC Kimlik Numaranızı (11 haneli) veya kayıtlı telefon numaranızı (05XXXXXXXXX) girin.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Güvenli Sorgulama</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tüm bilgileriniz şifrelenmiş ve güvenli şekilde saklanmaktadır.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Destek Hattı</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sorularınız için:
                </p>
                <p className="font-black text-lg text-slate-900 mt-1">0532 241 24 31</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
