import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { HeroSlideForm } from "../components/hero-slide-form";
import { prisma } from "@/lib/prisma";

interface EditHeroSlidePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditHeroSlidePage({
  params,
}: EditHeroSlidePageProps) {
  const session = await auth();
  const { locale: localeParam, id } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  const slide = await prisma.heroSlide.findUnique({
    where: { id },
  });

  if (!slide) {
    redirect(`/${locale}/hero-slides`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Slider Düzenle</h1>
        <p className="text-muted-foreground">
          Hero slider bilgilerini güncelleyin
        </p>
      </div>

      <HeroSlideForm
        slide={slide}
        dealerId={session.user.dealerId}
        locale={locale}
      />
    </div>
  );
}
