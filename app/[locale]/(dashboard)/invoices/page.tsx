import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  FileText,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Receipt,
} from "lucide-react";
import { getInvoices, getInvoiceStats } from "@/lib/actions/invoices";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { GenerateInvoicesButton } from "./generate-invoices-button";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function InvoicesPage({ params }: Props) {
  const { locale } = await params;

  const session = await auth();
  if (!session?.user?.dealerId) {
    redirect(`/${locale}/login`);
  }

  const dict = await getDictionary(locale);
  const [invoicesResult, stats] = await Promise.all([
    getInvoices({ page: 1, limit: 20 }),
    getInvoiceStats(),
  ]);

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    DRAFT: {
      label: "Taslak",
      color: "bg-gray-100 text-gray-800",
      icon: <FileText className="h-4 w-4" />,
    },
    SENT: {
      label: "Gönderildi",
      color: "bg-blue-100 text-blue-800",
      icon: <Clock className="h-4 w-4" />,
    },
    PAID: {
      label: "Ödendi",
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    OVERDUE: {
      label: "Gecikmiş",
      color: "bg-red-100 text-red-800",
      icon: <AlertCircle className="h-4 w-4" />,
    },
    CANCELLED: {
      label: "İptal",
      color: "bg-gray-100 text-gray-800",
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faturalar</h1>
          <p className="text-muted-foreground">
            Öğrenci faturalarını yönetin
          </p>
        </div>
        <div className="flex gap-2">
          <GenerateInvoicesButton locale={locale} />
          <Link href={`/${locale}/invoices/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Fatura
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taslak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gönderildi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ödendi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gecikmiş</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Tahsilat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Fatura Listesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoicesResult.invoices.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dict.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fatura No</TableHead>
                  <TableHead>Öğrenci</TableHead>
                  <TableHead>Dönem</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Son Ödeme</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="w-[80px]">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoicesResult.invoices.map((invoice) => {
                  const status = statusConfig[invoice.status] || statusConfig.DRAFT;
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNo}
                      </TableCell>
                      <TableCell>
                        {invoice.student.firstName} {invoice.student.lastName}
                      </TableCell>
                      <TableCell>
                        {invoice.periodMonth && invoice.periodYear
                          ? `${invoice.periodMonth}/${invoice.periodYear}`
                          : "-"}
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        {format(new Date(invoice.dueDate), "dd MMM yyyy", {
                          locale: tr,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          <span className="flex items-center gap-1">
                            {status.icon}
                            {status.label}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/${locale}/invoices/${invoice.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
