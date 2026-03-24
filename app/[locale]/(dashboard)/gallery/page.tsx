import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { GalleryList } from "./components/gallery-list";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  const images = await prisma.galleryImage.findMany({
    where: { dealerId: session.user.dealerId },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Galeri Yönetimi</h1>
          <p className="text-muted-foreground">
            Galeri sayfanızdaki fotoğrafları yönetin
          </p>
        </div>
        <Link href={`/${locale}/gallery/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Fotoğraf Ekle
          </Button>
        </Link>
      </div>

      <GalleryList images={images} locale={locale} />
    </div>
  );
}
