import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getOrders, getOrderStats, type OrderListItem } from "@/lib/data/products";
import { UserRole } from "@/lib/types";
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
import { ShoppingBag, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";
import { OrderActions } from "./components/order-actions";

interface OrdersPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
}

const dateLocales = {
  tr: tr,
  en: enUS,
  es: es,
};

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

const paymentStatusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "outline",
  PAID: "default",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

export default async function OrdersPage({
  params,
  searchParams,
}: OrdersPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;
  const { page = "1", status = "", search = "" } = await searchParams;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const dateLocale = dateLocales[locale];

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  const [{ data: orders, total }, stats] = await Promise.all([
    getOrders(
      {
        dealerId,
        status: status || undefined,
        search: search || undefined,
      },
      parseInt(page),
      10
    ),
    dealerId ? getOrderStats(dealerId) : null,
  ]);

  const totalPages = Math.ceil(total / 10);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dictionary.orders?.title || "Siparisler"}</h1>
          <p className="text-muted-foreground">{dictionary.orders?.description || "Siparis yonetimi"}</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{dictionary.orders?.totalOrders || "Toplam Siparis"}</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{dictionary.orders?.pendingOrders || "Bekleyen Siparisler"}</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {stats.pendingOrders}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{dictionary.orders?.totalRevenue || "Toplam Gelir"}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {formatPrice(stats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {dictionary.common.showing} {orders.length} {dictionary.common.of}{" "}
            {total} {dictionary.common.entries}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.orders?.orderNumber || "Siparis No"}</TableHead>
                  <TableHead>{dictionary.orders?.customer || "Musteri"}</TableHead>
                  <TableHead>{dictionary.orders?.itemCount || "Urun Sayisi"}</TableHead>
                  <TableHead>{dictionary.orders?.total || "Toplam"}</TableHead>
                  <TableHead>{dictionary.common.status}</TableHead>
                  <TableHead>{dictionary.orders?.payment || "Odeme"}</TableHead>
                  <TableHead>{dictionary.common.date}</TableHead>
                  <TableHead className="text-right">
                    {dictionary.common.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: OrderListItem) => {
                  const orderStatusDict = dictionary.orders?.status as Record<string, string> | undefined;
                  const paymentStatusDict = dictionary.orders?.paymentStatus as Record<string, string> | undefined;
                  const statusLabel = orderStatusDict?.[order.status] || order.status;
                  const statusVariant = statusVariants[order.status] || "secondary";
                  const paymentLabel = paymentStatusDict?.[order.paymentStatus] || order.paymentStatus;
                  const paymentVariant = paymentStatusVariants[order.paymentStatus] || "secondary";

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.customerPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{order._count.items} {dictionary.products?.pieces || "adet"}</TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant}>
                          {statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={paymentVariant}>
                          {paymentLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(order.createdAt, "dd MMM yyyy", { locale: dateLocale })}
                      </TableCell>
                      <TableCell className="text-right">
                        <OrderActions
                          id={order.id}
                          locale={locale}
                          currentStatus={order.status}
                          dictionary={{
                            common: dictionary.common,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/${locale}/orders?page=${p}&status=${status}&search=${search}`}
            >
              <Button
                variant={p === parseInt(page) ? "default" : "outline"}
                size="sm"
              >
                {p}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
