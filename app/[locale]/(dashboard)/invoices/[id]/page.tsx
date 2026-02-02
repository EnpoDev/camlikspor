import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Printer, Mail, CheckCircle } from "lucide-react";
import { getInvoice } from "@/lib/actions/invoices";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { InvoiceActions } from "./invoice-actions";

interface Props {
  params: Promise<{ locale: Locale; id: string }>;
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { locale, id } = await params;

  const session = await auth();
  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const invoice = await getInvoice(id);

  if (!invoice) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    DRAFT: { label: "Taslak", color: "bg-gray-100 text-gray-800" },
    SENT: { label: "Gönderildi", color: "bg-blue-100 text-blue-800" },
    PAID: { label: "Ödendi", color: "bg-green-100 text-green-800" },
    OVERDUE: { label: "Gecikmiş", color: "bg-red-100 text-red-800" },
    CANCELLED: { label: "İptal", color: "bg-gray-100 text-gray-800" },
  };

  const status = statusConfig[invoice.status] || statusConfig.DRAFT;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/invoices`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Fatura #{invoice.invoiceNo}
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(invoice.issueDate), "dd MMMM yyyy", { locale: tr })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={status.color}>{status.label}</Badge>
          <InvoiceActions invoice={invoice} locale={locale} />
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Yazdır / PDF
          </Button>
        </div>
      </div>

      {/* Printable Invoice */}
      <div className="bg-white rounded-lg border shadow-sm p-8 print:shadow-none print:border-none">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {invoice.dealer.logo && (
              <img
                src={invoice.dealer.logo}
                alt={invoice.dealer.name}
                className="h-16 mb-4"
              />
            )}
            <h2 className="text-xl font-bold">{invoice.dealer.name}</h2>
            {invoice.dealer.address && (
              <p className="text-sm text-muted-foreground mt-1">
                {invoice.dealer.address}
              </p>
            )}
            {invoice.dealer.phone && (
              <p className="text-sm text-muted-foreground">
                Tel: {invoice.dealer.phone}
              </p>
            )}
            {invoice.dealer.email && (
              <p className="text-sm text-muted-foreground">
                E-posta: {invoice.dealer.email}
              </p>
            )}
            {invoice.dealer.taxNumber && (
              <p className="text-sm text-muted-foreground">
                Vergi No: {invoice.dealer.taxNumber}
              </p>
            )}
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-primary mb-2">FATURA</h1>
            <p className="text-lg font-medium">#{invoice.invoiceNo}</p>
            <div className="mt-4 space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Tarih:</span>{" "}
                {format(new Date(invoice.issueDate), "dd/MM/yyyy")}
              </p>
              <p>
                <span className="text-muted-foreground">Son Ödeme:</span>{" "}
                {format(new Date(invoice.dueDate), "dd/MM/yyyy")}
              </p>
              {invoice.periodMonth && invoice.periodYear && (
                <p>
                  <span className="text-muted-foreground">Dönem:</span>{" "}
                  {invoice.periodMonth}/{invoice.periodYear}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-muted/50 rounded-lg p-4 mb-8">
          <h3 className="font-medium mb-2">Fatura Adresi</h3>
          <p className="font-medium">
            {invoice.student.parentName}
          </p>
          <p className="text-sm text-muted-foreground">
            Öğrenci: {invoice.student.firstName} {invoice.student.lastName}
          </p>
          {invoice.student.address && (
            <p className="text-sm text-muted-foreground">
              {invoice.student.address}
            </p>
          )}
          {invoice.student.parentPhone && (
            <p className="text-sm text-muted-foreground">
              Tel: {invoice.student.parentPhone}
            </p>
          )}
          {invoice.student.parentEmail && (
            <p className="text-sm text-muted-foreground">
              E-posta: {invoice.student.parentEmail}
            </p>
          )}
        </div>

        {/* Invoice Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 font-medium">Açıklama</th>
              <th className="text-center py-3 font-medium w-24">Miktar</th>
              <th className="text-right py-3 font-medium w-32">Birim Fiyat</th>
              <th className="text-right py-3 font-medium w-32">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-3">{item.description}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ara Toplam</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>İndirim</span>
                <span>-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">KDV</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Toplam</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
            {invoice.status === "PAID" && invoice.paidAmount && (
              <div className="flex justify-between text-green-600">
                <span>Ödenen</span>
                <span>{formatCurrency(invoice.paidAmount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-medium mb-2">Notlar</h3>
            <p className="text-sm text-muted-foreground">{invoice.notes}</p>
          </div>
        )}

        {/* Payment Status Banner */}
        {invoice.status === "PAID" && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Fatura Ödendi</p>
              {invoice.paidAt && (
                <p className="text-sm text-green-600">
                  Ödeme Tarihi: {format(new Date(invoice.paidAt), "dd/MM/yyyy HH:mm")}
                  {invoice.paymentMethod && ` (${invoice.paymentMethod})`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Bu fatura elektronik olarak oluşturulmuştur.</p>
          <p className="mt-1">
            Sorularınız için: {invoice.dealer.phone || invoice.dealer.email}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bg-white.rounded-lg,
          .bg-white.rounded-lg * {
            visibility: visible;
          }
          .bg-white.rounded-lg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
