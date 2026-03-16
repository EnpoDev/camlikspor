import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { HeroSlideForm } from "../components/hero-slide-form";

interface NewHeroSlidePageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewHeroSlidePage({
  params,
}: NewHeroSlidePageProps) {
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
        <h1 className="text-3xl font-bold tracking-tight">Yeni Slider Ekle</h1>
        <p className="text-muted-foreground">
          Ana sayfa için yeni bir hero slider oluşturun
        </p>
      </div>

      <HeroSlideForm dealerId={session.user.dealerId} locale={locale} />
    </div>
  );
}
