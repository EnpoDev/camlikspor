import { Metadata } from "next";
import { Gamepad2, Trophy, Users, Target, Brain, Monitor, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "E-Spor Eğitimi | Çamlık Spor Kulübü",
  description: "Profesyonel e-spor eğitimi ile dijital futbol dünyasında yerinizi alın.",
};

export default function EsportsPage() {
  const features = [
    {
      icon: Gamepad2,
      title: "FIFA & eFootball",
      description: "Profesyonel FIFA ve eFootball eğitimi",
    },
    {
      icon: Monitor,
      title: "Modern Ekipman",
      description: "Son teknoloji oyun bilgisayarları ve ekipmanlar",
    },
    {
      icon: Brain,
      title: "Strateji Eğitimi",
      description: "Oyun stratejileri ve taktik analizi",
    },
    {
      icon: Trophy,
      title: "Turnuvalar",
      description: "Online ve fiziksel e-spor turnuvalarına katılım",
    },
    {
      icon: Users,
      title: "Takım Çalışması",
      description: "Pro Clubs modu ile takım oyunu deneyimi",
    },
    {
      icon: Wifi,
      title: "Online Müsabakalar",
      description: "Uluslararası online turnuva deneyimi",
    },
  ];

  const games = [
    {
      name: "FIFA 24 / EA FC 24",
      modes: ["Ultimate Team", "Pro Clubs", "Seasons", "FUT Champions"],
      level: "Tüm Seviyeler",
    },
    {
      name: "eFootball 2024",
      modes: ["myClub", "Dream Team", "Online Maçlar"],
      level: "Başlangıç-İleri",
    },
  ];

  const ageGroups = [
    { age: "8-11 Yaş", name: "Junior E-Spor", days: "Cumartesi-Pazar", time: "10:00-12:00" },
    { age: "12-15 Yaş", name: "Youth E-Spor", days: "Cumartesi-Pazar", time: "13:00-15:00" },
    { age: "16-19 Yaş", name: "Pro E-Spor", days: "Cumartesi-Pazar", time: "15:00-17:00" },
    { age: "20+ Yaş", name: "Elite E-Spor", days: "Cumartesi-Pazar", time: "17:00-19:00" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark, left-aligned */}
      <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            E-Spor
          </span>
          <Gamepad2 className="h-16 w-16 mb-4 text-secondary animate-fade-in-up" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
            E-Spor Akademisi
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-white/70 animate-fade-in-up">
            Dijital futbol dünyasında profesyonel oyuncu olma yolculuğunuz başlıyor
          </p>
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:-translate-y-0.5 transition-all duration-300 shadow-lg animate-fade-in-up">
            <a href="/on-kayit">Hemen Kayıt Ol</a>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Program
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            E-Spor Programımız
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Games Section */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                Oyunlar
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
              Oyun Programları
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {games.map((game, index) => (
              <Card key={index} className="border-2 border-slate-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Gamepad2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{game.name}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-bold text-primary uppercase tracking-wide mb-2">Oyun Modları:</p>
                      <div className="flex flex-wrap gap-2">
                        {game.modes.map((mode, i) => (
                          <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {mode}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm">
                        <strong>Seviye:</strong> {game.level}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Age Groups */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Kategoriler
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Yaş Grupları ve Eğitim Saatleri
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ageGroups.map((group, index) => (
            <Card key={index} className="border-2 border-slate-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{group.age}</h3>
                <p className="text-primary font-semibold mb-4">{group.name}</p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong>Günler:</strong> {group.days}</p>
                  <p><strong>Saat:</strong> {group.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Training Program */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                İçerik
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
              Eğitim İçeriği
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">Teknik Beceriler</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Oyun mekaniği ve kontrol teknikleri</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Takım kurma ve kadro yönetimi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Skill moves ve ileri teknikler</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Set piece oyunları</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">Strateji ve Taktik</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Farklı formasyon ve taktikler</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Rakip analizi ve karşı stratejiler</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Mental dayanıklılık ve konsantrasyon</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Turnuva hazırlığı ve yarışma deneyimi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why E-Sports */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Neden
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Neden E-Spor?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Profesyonel Kariyer</h3>
              <p className="text-slate-600 text-sm">
                E-spor artık bir kariyer fırsatı ve milyonlarca izleyicisi var
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Zihinsel Gelişim</h3>
              <p className="text-slate-600 text-sm">
                Hızlı karar verme, problem çözme ve strateji geliştirme
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Küresel Rekabet</h3>
              <p className="text-slate-600 text-sm">
                Dünyanın her yerinden oyuncularla yarışma fırsatı
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section — dark */}
      <div className="bg-slate-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white uppercase tracking-wide">E-Spor Yolculuğunuz Başlasın!</h2>
          <div className="w-12 h-1 bg-secondary mx-auto rounded-full mb-6" />
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/70">
            Profesyonel e-spor eğitimi ile dijital futbol dünyasında yerinizi alın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
              <a href="/on-kayit">Ön Kayıt Yap</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <a href="tel:05322412431">Bizi Arayın</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
