import { prisma } from "@/lib/prisma";
import { i18n, type Locale } from "@/lib/i18n/config";
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
    title: dealer.heroTitle || `${dealer.name} - Profesyonel Futbol Okulu`,
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

  return (
    <div className="min-h-screen">
      {/* Hero Section - Football Club Focus */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900">
        {/* Animated Gradient Background - Always visible */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 animate-gradient" />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-emerald-900/50 to-emerald-700 opacity-60 animate-gradient-reverse" />
        </div>

        {/* Video Background - Mobile and Desktop */}
        <div className="absolute inset-0 z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover blur-sm"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-emerald-900/70" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 z-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-4 relative z-30">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8">
              <Trophy className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 shrink-0" />
              <span className="text-white/90 text-xs md:text-sm font-medium">Profesyonel Futbol Eğitimi ve Ekipmanları</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight px-2">
              {dealer.heroTitle || (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">{dealer.name}</span>
                  <br />
                  Futbol Okulu
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              {dealer.heroSubtitle || "Profesyonel eğitmenler eşliğinde, modern tesislerde çocuğunuzun futbol yeteneğini keşfedin!"}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/${locale}#contact`}>
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Kayıt Ol
                </Button>
              </Link>
              <Link href={`/${locale}#about`}>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                  Hakkımızda
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Club Features Badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/70">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                <span className="text-sm">Profesyonel Eğitmenler</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-400" />
                <span className="text-sm">Modern Tesisler</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-400" />
                <span className="text-sm">Esnek Antrenman Saatleri</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-400" />
                <span className="text-sm">Her Yaş Grubu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" className="dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      {/* About / Club Introduction Section */}
      <section id="about" className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Hakkımızda
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Geleceğin Futbolcularını Yetiştiriyoruz
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  {dealer.name}, çocukların futbol yeteneklerini keşfetmeleri ve geliştirmeleri için ideal ortamı sunan profesyonel bir futbol okuludur.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Lisanslı Eğitmenler</h4>
                      <p className="text-muted-foreground text-sm">UEFA lisanslı, deneyimli antrenör kadromuz</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Yaş Gruplarına Özel Eğitim</h4>
                      <p className="text-muted-foreground text-sm">5-16 yaş arası farklı kategorilerde eğitim programları</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Modern Altyapı</h4>
                      <p className="text-muted-foreground text-sm">Sentetik çim sahalar ve profesyonel eğitim ortamı</p>
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
                Özelliklerimiz
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
              <p className="text-muted-foreground text-lg">
                Çocuğunuzun futbol yolculuğu için en iyi başlangıç noktası
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-600 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Profesyonel Eğitmenler</h3>
                <p className="text-muted-foreground text-sm">
                  UEFA lisanslı, deneyimli antrenör kadromuz
                </p>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-600 flex items-center justify-center">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Modern Tesisler</h3>
                <p className="text-muted-foreground text-sm">
                  Son teknoloji sentetik sahalar ve eğitim alanları
                </p>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-slate-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-600 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Yaş Grupları</h3>
                <p className="text-muted-foreground text-sm">
                  5-16 yaş arası kategorilere özel programlar
                </p>
              </Card>

              <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-600 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Esnek Saatler</h3>
                <p className="text-muted-foreground text-sm">
                  Hafta içi ve hafta sonu antrenman seçenekleri
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100">
                  Galeri
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Tesislerimiz ve Etkinliklerimiz</h2>
                <p className="text-muted-foreground text-lg">Antrenmanlardan ve turnuvalardan kareler</p>
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
                    Mağaza
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Kulüp Ürünleri</h2>
                  <p className="text-muted-foreground">Forma ve kulüp malzemelerimiz</p>
                </div>
                <Link href={`/${locale}/shop`}>
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    Tümünü Gör
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <ProductsSwiper products={products} locale={locale} />

              <div className="mt-6 text-center md:hidden">
                <Link href={`/${locale}/shop`}>
                  <Button variant="outline" size="sm">
                    Tümünü Gör
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
              Kayıt ve İletişim
            </Badge>
            <h2 className="text-3xl font-bold mb-3">Bize Ulaşın</h2>
            <p className="text-muted-foreground">
              Kayıt ve sorularınız için bizimle iletişime geçin
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
                        <p className="text-xs text-muted-foreground">Telefon</p>
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
                        <p className="text-xs text-muted-foreground">E-posta</p>
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
                        <p className="text-xs text-muted-foreground">Adres</p>
                        <p className="font-medium text-sm truncate">{dealer.contactAddress}</p>
                      </div>
                    </a>
                  )}
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Antrenman Saatleri</p>
                      <p className="font-medium text-sm">Pzt-Cmt 15:00-20:00</p>
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
