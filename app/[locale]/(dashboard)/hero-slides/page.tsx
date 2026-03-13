import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { HeroSlidesList } from "./components/hero-slides-list";

interface HeroSlidesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HeroSlidesPage({
  params,
}: HeroSlidesPageProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user || !session.user.dealerId) {
    redirect(`/${locale}/login`);
  }

  const slides = await prisma.heroSlide.findMany({
    where: { dealerId: session.user.dealerId },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      dealerId: true,
      image: true,
      badge: true,
      title: true,
      titleColor: true,
      subtitle: true,
      ctaPrimary: true,
      ctaPrimaryUrl: true,
      ctaSecondary: true,
      ctaSecondaryUrl: true,
      showCtaPrimary: true,
      showCtaSecondary: true,
      sortOrder: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hero Slider Yönetimi</h1>
          <p className="text-muted-foreground">
            Ana sayfanız için hero slider görsellerini yönetin
          </p>
        </div>
        <Link href={`/${locale}/hero-slides/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Slider Ekle
          </Button>
        </Link>
      </div>

      <HeroSlidesList slides={slides} locale={locale} />
    </div>
  );
}
