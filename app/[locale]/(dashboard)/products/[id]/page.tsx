import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getProductById } from "@/lib/data/products";
import { UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { tr, enUS, es } from "date-fns/locale";

interface ProductDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

const dateLocales = { tr: tr, en: enUS, es: es };

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  const dateLocale = dateLocales[locale];

  const dealerId =
    session?.user?.role === UserRole.SUPER_ADMIN
      ? undefined
      : session?.user?.dealerId || undefined;

  const product = await getProductById(id, dealerId);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getImages = (imagesJson: string | null): string[] => {
    if (!imagesJson) return [];
    try {
      const images = JSON.parse(imagesJson);
      return Array.isArray(images) ? images : [];
    } catch {
      return [];
    }
  };

  const images = getImages(product.images);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/products`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-muted-foreground">{product.category.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive
              ? dictionary.common.active
              : dictionary.common.inactive}
          </Badge>
          <Link href={`/${locale}/products/${id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {dictionary.common.edit}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.sidebar.products}</CardTitle>
          </CardHeader>
          <CardContent>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {images.map((url, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-hidden bg-muted ${
                      index === 0 ? "col-span-2 h-64" : "h-40"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                <Package className="h-16 w-16 text-muted-foreground/50" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Info */}
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.common.info || "Bilgiler"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Slug</p>
                <p className="font-mono font-medium">{product.slug}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {dictionary.sidebar.products}
                </p>
                <Badge variant="outline">{product.category.name}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{dictionary.products?.price || "Fiyat"}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{dictionary.common.total} Stok</p>
                <p className="text-2xl font-bold">{totalStock}</p>
              </div>
            </div>
            {product.description && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {dictionary.shop?.description || "Aciklama"}
                </p>
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>
            )}
            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{dictionary.common.date}</p>
                <p className="font-medium">
                  {format(product.createdAt, "d MMMM yyyy", {
                    locale: dateLocale,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{dictionary.common.status}</p>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive
                    ? dictionary.common.active
                    : dictionary.common.inactive}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle>
            Varyantlar ({product.variants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.variants.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {dictionary.common.noData}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.shop?.size || "Beden"}</TableHead>
                  <TableHead>{dictionary.shop?.color || "Renk"}</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">
                      {variant.size}
                    </TableCell>
                    <TableCell>{variant.color || "-"}</TableCell>
                    <TableCell className="font-mono">
                      {variant.sku || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={variant.stock > 5 ? "default" : variant.stock > 0 ? "secondary" : "destructive"}
                      >
                        {variant.stock}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
