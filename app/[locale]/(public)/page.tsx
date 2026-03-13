import { prisma } from "@/lib/prisma";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPublicDealer } from "@/lib/utils/get-public-dealer";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductsSwiper } from "@/components/public/products-swiper";
import { ContactForm } from "@/components/public/contact-form";
import { HeroSlider } from "@/components/public/hero-slider";
import { NewsSection } from "@/components/public/news-section";
import {
  ShoppingBag,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Trophy,
  Users,
  Calendar,
  Target,
  GraduationCap,
  Dumbbell,
  Heart,
  CheckCircle,
} from "lucide-react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  const dealer = await getPublicDealer();

  if (!dealer) {
    return { title: "Sayfa Bulunamadı" };
  }

  return {
    title: dealer.name,
    description: dealer.heroSubtitle || `${dealer.name} - Profesyonel eğitmenler eşliğinde futbol eğitimi`,
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  const dealer = await getPublicDealer();

  if (!dealer) {
    notFound();
  }

  // Get translations
  const dictionary = await getDictionary(locale);
  const dict = dictionary.public || {};
  const homepageDict = dict.homepage || {};

  // Fetch hero slides
  const heroSlides = await prisma.heroSlide.findMany({
    where: {
      dealerId: dealer.id,
      isActive: true,
    },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
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
    },
  });

  // Fetch gallery images
  const galleryImages = await prisma.galleryImage.findMany({
    where: {
      dealerId: dealer.id,
      isActive: true,
    },
    orderBy: { sortOrder: "asc" },
    take: 6,
    select: {
      id: true,
      url: true,
      title: true,
    },
  });

  // Fetch featured products (for shop preview at bottom)
  const products = await prisma.product.findMany({
    where: {
      dealerId: dealer.id,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      category: {
        select: { name: true },
      },
    },
  });

  // Fetch recent blog posts
  const blogPosts = await prisma.blogPost.findMany({
    where: {
      dealerId: dealer.id,
      isPublished: true,
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider
        dealerName={dealer.name}
        locale={locale}
        slides={heroSlides}
      />

      {/* About / Club Introduction Section */}
      <section id="about" className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  {homepageDict.about?.badge || "Hakkımızda"}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {homepageDict.about?.title || "Geleceğin Futbolcularını Yetiştiriyoruz"}
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  {dealer.name}, {homepageDict.about?.description || "çocukların futbol yeteneklerini keşfetmeleri ve geliştirmeleri için ideal ortamı sunan profesyonel bir futbol okuludur."}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{homepageDict.about?.feature1Title || "Lisanslı Eğitmenler"}</h4>
                      <p className="text-muted-foreground text-sm">{homepageDict.about?.feature1Desc || "UEFA lisanslı, deneyimli antrenör kadromuz"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{homepageDict.about?.feature2Title || "Yaş Gruplarına Özel Eğitim"}</h4>
                      <p className="text-muted-foreground text-sm">{homepageDict.about?.feature2Desc || "5-16 yaş arası farklı kategorilerde eğitim programları"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{homepageDict.about?.feature3Title || "Modern Altyapı"}</h4>
                      <p className="text-muted-foreground text-sm">{homepageDict.about?.feature3Desc || "Sentetik çim sahalar ve profesyonel eğitim ortamı"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-hero.png"
                  alt="Futbol antrenmanı yapan çocuklar"
                  width={600}
                  height={400}
                  className="object-cover w-full hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Club Focused */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                {homepageDict.features?.badge || "Özelliklerimiz"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{homepageDict.features?.title || "Neden Bizi Tercih Etmelisiniz?"}</h2>
              <p className="text-muted-foreground text-lg">
                {homepageDict.features?.subtitle || "Çocuğunuzun futbol yolculuğu için en iyi başlangıç noktası"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-600 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{homepageDict.features?.card1Title || "Profesyonel Eğitmenler"}</h3>
                <p className="text-muted-foreground text-sm">
                  {homepageDict.features?.card1Desc || "UEFA lisanslı, deneyimli antrenör kadromuz"}
                </p>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-600 flex items-center justify-center">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{homepageDict.features?.card2Title || "Modern Tesisler"}</h3>
                <p className="text-muted-foreground text-sm">
                  {homepageDict.features?.card2Desc || "Son teknoloji sentetik sahalar ve eğitim alanları"}
                </p>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-slate-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-600 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{homepageDict.features?.card3Title || "Yaş Grupları"}</h3>
                <p className="text-muted-foreground text-sm">
                  {homepageDict.features?.card3Desc || "5-16 yaş arası kategorilere özel programlar"}
                </p>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-600 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{homepageDict.features?.card4Title || "Esnek Saatler"}</h3>
                <p className="text-muted-foreground text-sm">
                  {homepageDict.features?.card4Desc || "Hafta içi ve hafta sonu antrenman seçenekleri"}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsSection posts={blogPosts} locale={locale} dealerSlug={dealer.slug} />

      {/* Gallery Preview Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
                  {homepageDict.gallery?.badge || "Galeri"}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{homepageDict.gallery?.title || "Tesislerimiz ve Etkinliklerimiz"}</h2>
                <p className="text-muted-foreground text-lg">{homepageDict.gallery?.subtitle || "Antrenmanlardan ve turnuvalardan kareler"}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative rounded-xl overflow-hidden shadow-lg ${index === 0 ? 'md:col-span-2 md:row-span-2 h-64 md:h-auto' : 'h-48'}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.title || "Galeri"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Shop Preview Section - Secondary */}
      {products.length > 0 && (
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <Badge className="mb-3 bg-slate-100 text-slate-700 hover:bg-slate-100">
                    {homepageDict.shop?.badge || "Mağaza"}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{homepageDict.shop?.title || "Kulüp Ürünleri"}</h2>
                  <p className="text-muted-foreground">{homepageDict.shop?.subtitle || "Forma ve kulüp malzemelerimiz"}</p>
                </div>
                <Link href={`/${locale}/shop`}>
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    {homepageDict.shop?.viewAll || "Tümünü Gör"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <ProductsSwiper products={products} locale={locale} />

              <div className="mt-6 text-center md:hidden">
                <Link href={`/${locale}/shop`}>
                  <Button variant="outline" size="sm">
                    {homepageDict.shop?.viewAll || "Tümünü Gör"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact & Registration Section */}
      <section id="contact" className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-10">
            <Badge className="mb-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {homepageDict.contact?.badge || "Kayıt ve İletişim"}
            </Badge>
            <h2 className="text-3xl font-bold mb-3">{homepageDict.contact?.title || "Bize Ulaşın"}</h2>
            <p className="text-muted-foreground">
              {homepageDict.contact?.subtitle || "Kayıt ve sorularınız için bizimle iletişime geçin"}
            </p>
          </div>

          {/* Contact Info Bar */}
          <div className="max-w-6xl mx-auto mb-10">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
                  {dealer.contactPhone && (
                    <a href={`tel:${dealer.contactPhone}`} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{homepageDict.contact?.phone || "Telefon"}</p>
                        <p className="font-medium text-sm truncate">{dealer.contactPhone}</p>
                      </div>
                    </a>
                  )}
                  {dealer.contactEmail && (
                    <a href={`mailto:${dealer.contactEmail}`} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{homepageDict.contact?.email || "E-posta"}</p>
                        <p className="font-medium text-sm truncate">{dealer.contactEmail}</p>
                      </div>
                    </a>
                  )}
                  {dealer.contactAddress && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(dealer.contactAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{homepageDict.contact?.address || "Adres"}</p>
                        <p className="font-medium text-sm truncate">{dealer.contactAddress}</p>
                      </div>
                    </a>
                  )}
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{homepageDict.contact?.trainingHours || "Antrenman Saatleri"}</p>
                      <p className="font-medium text-sm">{homepageDict.contact?.schedule || "Pzt-Cmt 15:00-20:00"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Send className="h-6 w-6 text-emerald-600" />
                    Bilgi ve Kayıt Formu
                  </h3>
                  {/* Social Links */}
                  {(dealer.socialFacebook || dealer.socialInstagram || dealer.socialTwitter || dealer.socialYoutube) && (
                    <div className="flex gap-3">
                      {dealer.socialFacebook && (
                        <a href={dealer.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {dealer.socialInstagram && (
                        <a href={dealer.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {dealer.socialTwitter && (
                        <a href={dealer.socialTwitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {dealer.socialYoutube && (
                        <a href={dealer.socialYoutube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                          <Youtube className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <ContactForm dealerId={dealer.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
