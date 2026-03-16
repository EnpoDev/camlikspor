import { notFound } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getPublicDealer } from "@/lib/utils/get-public-dealer";
import {
  Award,
  Users,
  Landmark,
  Trophy,
  Target,
  Heart,
  Shield,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  const dealer = await getPublicDealer();
  if (!dealer) return { title: "Sayfa Bulunamadı" };
  return {
    title: `Hakkımızda - ${dealer.name}`,
    description: `${dealer.name} - Profesyonel futbol okulu eğitimi ile geleceğin yıldızlarını yetiştiriyoruz.`,
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  const dealer = await getPublicDealer();
  if (!dealer) notFound();

  const stats = [
    { value: "500+", label: "Aktif Sporcu", icon: Users },
    { value: "15+", label: "Yıllık Deneyim", icon: Calendar },
    { value: "20+", label: "Profesyonel Antrenör", icon: Award },
    { value: "50+", label: "Turnuva Başarısı", icon: Trophy },
  ];

  const values = [
    {
      icon: Target,
      title: "Misyonumuz",
      description:
        "Çocukların ve gençlerin futbol yeteneklerini keşfetmelerini, geliştirmelerini ve profesyonel seviyeye taşımalarını sağlamak. Sporun disiplin, takım ruhu ve adil oyun değerlerini aşılayarak bireysel ve sosyal gelişimlerine katkıda bulunmak.",
    },
    {
      icon: Star,
      title: "Vizyonumuz",
      description:
        "Türkiye'nin en saygın ve başarılı futbol akademilerinden biri olmak. Yetiştirdiğimiz sporcularla ulusal ve uluslararası arenada ülkemizi temsil eden, futbol kültürüne değer katan bir kurum olmak.",
    },
    {
      icon: Heart,
      title: "Değerlerimiz",
      description:
        "Adil oyun, saygı, disiplin, takım ruhu ve sürekli gelişim temel değerlerimizdir. Her sporcumuza eşit fırsat sunar, yeteneklerini en üst düzeye çıkarmak için çalışırız.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "UEFA Lisanslı Eğitmenler",
      description: "Tüm antrenörlerimiz UEFA B ve C lisanslarına sahip, deneyimli profesyonellerdir.",
    },
    {
      icon: Users,
      title: "Yaş Gruplarına Özel Eğitim",
      description: "5-16 yaş arası farklı kategorilerde, yaşa uygun müfredat ile eğitim programları sunuyoruz.",
    },
    {
      icon: Landmark,
      title: "Modern Tesisler",
      description: "FIFA standartlarında sentetik çim sahalar, kapalı salon ve modern soyunma odaları.",
    },
    {
      icon: Trophy,
      title: "Turnuva ve Müsabakalar",
      description: "Düzenli olarak yerel, bölgesel ve ulusal turnuvalara katılım imkanı sağlıyoruz.",
    },
    {
      icon: Target,
      title: "Bireysel Gelişim Takibi",
      description: "Her sporcumuzun teknik, fiziksel ve taktik gelişimini düzenli olarak ölçüyor ve raporluyoruz.",
    },
    {
      icon: Heart,
      title: "Karakter Eğitimi",
      description: "Futbol eğitiminin yanı sıra, sportmenlik, liderlik ve takım çalışması değerlerini aşılıyoruz.",
    },
  ];

  const timeline = [
    { year: "2009", title: "Kuruluş", description: "Çamlık Spor Kulübü, İstanbul Ümraniye'de kuruldu." },
    { year: "2012", title: "İlk Şampiyonluk", description: "İl şampiyonluğu kazanılarak ilk büyük başarı elde edildi." },
    { year: "2015", title: "Altyapı Genişlemesi", description: "Kız futbolu ve futsal bölümleri açıldı." },
    { year: "2018", title: "Yeni Tesisler", description: "Modern eğitim tesisleri hizmete girdi." },
    { year: "2021", title: "E-Spor Akademisi", description: "Dijital futbol eğitimi için E-Spor bölümü kuruldu." },
    { year: "2024", title: "500+ Sporcu", description: "Aktif sporcu sayısı 500'ü aştı, 20+ antrenör kadrosu oluştu." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark */}
      <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            Hakkımızda
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
            Geleceğin Yıldızlarını Yetiştiriyoruz
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mb-8 text-white/70 animate-fade-in-up">
            <span className="text-secondary font-bold">{dealer.name}</span>,
            çocukların ve gençlerin futbol yeteneklerini keşfetmeleri ve geliştirmeleri için
            profesyonel eğitim ortamı sunan köklü bir spor kulübüdür.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <Icon className="h-6 w-6 text-white/60 mx-auto mb-2" />
                  <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
                  <div className="text-sm text-white/70 font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Kurumsal
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Misyon, Vizyon ve Değerlerimiz
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Why Us */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                Neden Biz
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
              Neden {dealer.name}?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Tarihçe
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Yolculuğumuz
          </h2>
        </div>
        <div className="max-w-3xl">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-primary/20" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="pb-2">
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">{item.year}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{item.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                İletişim
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
              Bize Ulaşın
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            {dealer.contactPhone && (
              <a href={`tel:${dealer.contactPhone}`} className="group">
                <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Phone className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Telefon</p>
                      <p className="font-bold text-slate-900">{dealer.contactPhone}</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            )}
            {dealer.contactEmail && (
              <a href={`mailto:${dealer.contactEmail}`} className="group">
                <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Mail className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">E-posta</p>
                      <p className="font-bold text-slate-900">{dealer.contactEmail}</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            )}
            {dealer.contactAddress && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(dealer.contactAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                      <MapPin className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Adres</p>
                      <p className="font-bold text-slate-900 text-sm">{dealer.contactAddress}</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section — dark */}
      <div className="bg-slate-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white uppercase tracking-wide">
            Aramıza Katıl!
          </h2>
          <div className="w-12 h-1 bg-secondary mx-auto rounded-full mb-6" />
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/70">
            Profesyonel eğitim kadromuz ile çocuğunuzun futbol yolculuğunu başlatın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/on-kayit`}>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
                Ön Kayıt Yap
              </Button>
            </Link>
            <a href="tel:05322412431">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Bizi Arayın
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
