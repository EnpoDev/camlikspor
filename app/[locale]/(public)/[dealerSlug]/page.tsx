import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getMatchesByDealer } from "@/lib/actions/matches";
import { getSponsorsByDealer } from "@/lib/actions/sponsors";
import { HeroSection } from "@/components/public/hero-section";
import { GallerySection } from "@/components/public/gallery-section";
import { NewsSection } from "@/components/public/news-section";
import { MatchesSection } from "@/components/public/matches-section";
import { CtaGridSection } from "@/components/public/cta-grid-section";
import { BannerSection } from "@/components/public/banner-section";
import { SponsorsSection } from "@/components/public/sponsors-section";

interface LandingPageProps {
  params: Promise<{ locale: string; dealerSlug: string }>;
}

export async function generateMetadata({ params }: LandingPageProps) {
  const { dealerSlug } = await params;

  const dealer = await prisma.dealer.findUnique({
    where: { slug: dealerSlug },
    select: { name: true, heroTitle: true, heroSubtitle: true },
  });

  if (!dealer) {
    return { title: "Sayfa Bulunamadi" };
  }

  return {
    title: dealer.heroTitle || dealer.name,
    description: dealer.heroSubtitle || `${dealer.name} - Profesyonel Futbol Okulu`,
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale: localeParam, dealerSlug } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  // Fetch dealer with all landing page data
  const dealer = await prisma.dealer.findUnique({
    where: {
      slug: dealerSlug,
      isActive: true,
      isPublicPageActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      heroImage: true,
      heroTitle: true,
      heroSubtitle: true,
      contactPhone: true,
      contactEmail: true,
      contactAddress: true,
      // Banner
      bannerImage: true,
      bannerTitle: true,
      bannerLink: true,
      // Section visibility flags (from Dealer model)
      showMatchesSection: true,
      showNewsSection: true,
      showSponsorsSection: true,
      showShopPreviewSection: true,
      showPreRegSection: true,
    },
  });

  if (!dealer) {
    notFound();
  }

  // Run all data fetches in parallel for performance
  const [matches, sponsors, blogPosts, galleryImages, products] =
    await Promise.all([
      getMatchesByDealer(dealer.id),
      getSponsorsByDealer(dealer.id),
      prisma.blogPost.findMany({
        where: { dealerId: dealer.id, isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          category: true,
          publishedAt: true,
        },
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
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: true,
          category: { select: { name: true } },
        },
      }),
    ]);

  const dictionary = await getDictionary(locale);
  // Cast to any so we can safely access keys that may not exist in the
  // current dictionary shape without TypeScript errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicDict = (dictionary.public || {}) as Record<string, any>;

  return (
    <>
      {/* 1. Hero */}
      <HeroSection
        dealerSlug={dealer.slug}
        dealerName={dealer.name}
        heroImage={dealer.heroImage}
        heroTitle={dealer.heroTitle}
        heroSubtitle={dealer.heroSubtitle}
        locale={locale}
        dictionary={{
          shopCta: publicDict.hero?.shopCta || "Magazaya Git",
          contactCta: publicDict.hero?.contactCta || "Iletisim",
        }}
      />

      {/* 2. Matches */}
      <MatchesSection
        matches={matches as any}
        sponsors={sponsors as any}
        isVisible={dealer.showMatchesSection}
        dictionary={{
          title: publicDict.matchesSection?.title || "Maclar",
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

      {/* 4. CTA Grid — Magaza + On Kayit */}
      <CtaGridSection
        dealerSlug={dealer.slug}
        locale={locale}
        shopVisible={dealer.showShopPreviewSection && products.length > 0}
        preRegVisible={dealer.showPreRegSection}
        dictionary={{
          store: publicDict.ctaGrid?.store || "MAGAZA",
          preReg: publicDict.ctaGrid?.preReg || "ON KAYIT",
        }}
      />

      {/* 6. Banner */}
      <BannerSection
        bannerImage={dealer.bannerImage}
        bannerTitle={dealer.bannerTitle}
        bannerLink={dealer.bannerLink}
        isVisible={!!(dealer.bannerTitle || dealer.bannerImage)}
      />

      {/* 7. Gallery */}
      {galleryImages.length > 0 && (
        <GallerySection
          images={galleryImages}
          dealerSlug={dealer.slug}
          locale={locale}
          dictionary={{
            title:
              publicDict.gallerySection?.title || "Fotograf Galerisi",
            viewAll:
              publicDict.gallerySection?.viewAll || "Tum Galeriye Git",
          }}
        />
      )}

      {/* 8. Sponsors */}
      <SponsorsSection
        sponsors={sponsors as any}
        isVisible={dealer.showSponsorsSection}
        dictionary={{
          title: publicDict.sponsorsSection?.title || "Resmi Ortaklar",
          mainPartners:
            publicDict.sponsorsSection?.mainPartners || "Ana Sponsor",
          officialPartners:
            publicDict.sponsorsSection?.officialPartners ||
            "Resmi Ortaklar",
          partners:
            publicDict.sponsorsSection?.partners || "Partnerler",
        }}
      />

    </>
  );
}
