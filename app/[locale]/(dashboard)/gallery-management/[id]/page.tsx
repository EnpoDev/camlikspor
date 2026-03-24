import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { GalleryImageForm } from "../components/gallery-image-form";
import { prisma } from "@/lib/prisma";

interface EditGalleryImagePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditGalleryImagePage({
  params,
}: EditGalleryImagePageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  const image = await prisma.galleryImage.findUnique({
    where: { id },
  });

  if (!image) {
    redirect(`/${locale}/gallery-management`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fotoğraf Düzenle</h1>
        <p className="text-muted-foreground">
          Galeri fotoğrafı bilgilerini güncelleyin
        </p>
      </div>

      <GalleryImageForm
        image={image}
        dealerId={session.user.dealerId}
        locale={locale}
      />
    </div>
  );
}
