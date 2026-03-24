import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { GalleryImageForm } from "../components/gallery-image-form";

interface NewGalleryImagePageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewGalleryImagePage({
  params,
}: NewGalleryImagePageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Fotoğraf Ekle</h1>
        <p className="text-muted-foreground">
          Galeri sayfası için yeni bir fotoğraf ekleyin
        </p>
      </div>

      <GalleryImageForm dealerId={session.user.dealerId} locale={locale} />
    </div>
  );
}
