import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getPublicDealer } from "@/lib/utils/get-public-dealer";
import { getMatchesByDealer } from "@/lib/actions/matches";
import { getSponsorsByDealer } from "@/lib/actions/sponsors";
import { HeroSlider } from "@/components/public/hero-slider";
import { GallerySection } from "@/components/public/gallery-section";
import { NewsSection } from "@/components/public/news-section";
import { MatchesSection } from "@/components/public/matches-section";
import { CtaGridSection } from "@/components/public/cta-grid-section";
import { BannerSection } from "@/components/public/banner-section";
import { SponsorsSection } from "@/components/public/sponsors-section";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  const dealer = await getPublicDealer();
  if (!dealer) return { title: "Sayfa Bulunamadı" };
  return {
    title: dealer.heroTitle || dealer.name,
    description: dealer.heroSubtitle || `${dealer.name} - Profesyonel Futbol Okulu`,
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  const dealer = await getPublicDealer();
  if (!dealer) notFound();

  const [matches, sponsors, blogPosts, galleryImages, products, heroSlides] =
    await Promise.all([
      getMatchesByDealer(dealer.id),
      getSponsorsByDealer(dealer.id),
      prisma.blogPost.findMany({
        where: { dealerId: dealer.id, isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 6,
        select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, category: true, publishedAt: true },
      }),
      prisma.galleryImage.findMany({
        where: { dealerId: dealer.id, isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 10,
        select: { id: true, url: true, title: true, description: true },
      }),
      prisma.product.findMany({
        where: { dealerId: dealer.id, isActive: true },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: { id: true, name: true, slug: true, price: true, images: true, category: { select: { name: true } } },
      }),
      prisma.heroSlide.findMany({
        where: { dealerId: dealer.id, isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true, image: true, badge: true, title: true, titleColor: true,
          subtitle: true, ctaPrimary: true, ctaPrimaryUrl: true,
          ctaSecondary: true, ctaSecondaryUrl: true,
          showCtaPrimary: true, showCtaSecondary: true,
        },
      }),
    ]);

  const dictionary = await getDictionary(locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicDict = (dictionary.public || {}) as Record<string, any>;

  return (
    <>
      {/* 1. Hero Slider */}
      <HeroSlider dealerName={dealer.name} locale={locale} slides={heroSlides} />

      {/* 2. Matches */}
      <MatchesSection
        matches={matches as any}
        sponsors={sponsors as any}
        isVisible={dealer.showMatchesSection}
        dictionary={{
          title: publicDict.matchesSection?.title || "Maçlar",
          matchTickets: publicDict.matchesSection?.matchTickets || "Bilet Al",
          tbd: publicDict.matchesSection?.tbd || "TBD",
        }}
      />

      {/* 3. News */}
      {dealer.showNewsSection && blogPosts.length > 0 && (
        <NewsSection
          posts={blogPosts}
          locale={locale}
          dealerSlug={dealer.slug}
          dictionary={{
            badge: publicDict.newsSection?.badge || "Haberler",
            title: publicDict.newsSection?.title || "Son Haberler",
            subtitle: publicDict.newsSection?.subtitle || "Kulübümüzden en güncel haberler",
            featured: publicDict.newsSection?.featured || "ÖNE ÇIKAN",
            viewAll: publicDict.newsSection?.viewAll || "Tüm Haberler",
          }}
        />
      )}

      {/* 4. CTA Grid — Mağaza + Ön Kayıt */}
      <CtaGridSection
        dealerSlug={dealer.slug}
        locale={locale}
        shopVisible={dealer.showShopPreviewSection && products.length > 0}
        preRegVisible={dealer.showPreRegSection}
        dictionary={{
          store: publicDict.ctaGrid?.store || "MAĞAZA",
          preReg: publicDict.ctaGrid?.preReg || "ÖN KAYIT",
        }}
      />

      {/* 5. Banner */}
      <BannerSection
        bannerImage={dealer.bannerImage}
        bannerTitle={dealer.bannerTitle}
        bannerLink={dealer.bannerLink}
        isVisible={!!(dealer.bannerTitle || dealer.bannerImage)}
      />

      {/* 6. Gallery */}
      {galleryImages.length > 0 && (
        <GallerySection
          images={galleryImages}
          dealerSlug={dealer.slug}
          locale={locale}
          dictionary={{
            title: publicDict.gallerySection?.title || "Fotoğraf Galerisi",
            viewAll: publicDict.gallerySection?.viewAll || "Tüm Galeriyi Gör",
          }}
        />
      )}

      {/* 7. Sponsors */}
      <SponsorsSection
        sponsors={sponsors as any}
        isVisible={dealer.showSponsorsSection}
        dictionary={{
          title: publicDict.sponsorsSection?.title || "Resmi Ortaklar",
          mainPartners: publicDict.sponsorsSection?.mainPartners || "Ana Sponsor",
          officialPartners: publicDict.sponsorsSection?.officialPartners || "Resmi Ortaklar",
          partners: publicDict.sponsorsSection?.partners || "Partnerler",
        }}
      />

    </>
  );
}
