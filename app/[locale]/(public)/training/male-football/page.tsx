import { Metadata } from "next";
import { Trophy, Users, Calendar, Clock, Award, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Erkek Futbol Eğitimi | Çamlık Spor Kulübü",
  description: "Profesyonel erkek futbol eğitimi programımız ile geleceğin futbolcularını yetiştiriyoruz.",
};

export default function MaleFootballPage() {
  const features = [
    {
      icon: Users,
      title: "Yaş Gruplarına Özel Eğitim",
      description: "5-16 yaş arası farklı kategorilerde eğitim programları",
    },
    {
      icon: Trophy,
      title: "Profesyonel Kadro",
      description: "UEFA lisanslı ve deneyimli antrenör kadromuz",
    },
    {
      icon: Calendar,
      title: "Düzenli Antrenmanlar",
      description: "Hafta içi ve hafta sonu düzenli antrenman programı",
    },
    {
      icon: Award,
      title: "Turnuva Katılımı",
      description: "Yerel ve ulusal turnuvalara katılım fırsatı",
    },
    {
      icon: Target,
      title: "Teknik Gelişim",
      description: "Bireysel teknik ve taktik gelişim programları",
    },
    {
      icon: Clock,
      title: "Esnek Saatler",
      description: "Farklı zaman dilimlerinde antrenman seçenekleri",
    },
  ];

  const ageGroups = [
    { age: "5-7 Yaş", name: "Minikler", days: "Salı-Perşembe", time: "16:00-17:00" },
    { age: "8-10 Yaş", name: "Yıldızlar", days: "Pazartesi-Çarşamba-Cuma", time: "16:30-18:00" },
    { age: "11-13 Yaş", name: "Gençler", days: "Pazartesi-Çarşamba-Cuma", time: "17:00-18:30" },
    { age: "14-16 Yaş", name: "Altyapı", days: "Salı-Perşembe-Cumartesi", time: "17:30-19:00" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark, left-aligned */}
      <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            Erkek Futbol
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
            Erkek Futbol Eğitimi
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-white/70 animate-fade-in-up">
            Profesyonel futbol eğitimi ile geleceğin yıldızlarını yetiştiriyoruz
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
              Özellikler
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Neden Çamlık Spor Kulübü?
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

      {/* Age Groups */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                Kategoriler
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
              Yaş Grupları ve Antrenman Saatleri
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
      </div>

      {/* Training Program */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Program
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Eğitim Programımız
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">Teknik Beceriler</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Top kontrolü ve pas teknikleri</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Dribling ve 1v1 becerileri</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Şut teknikleri ve isabetli vuruşlar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Hava topu ve kafa vuruşları</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">Taktik Eğitim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Pozisyon oyunu ve takım çalışması</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Savunma ve hücum organizasyonu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Oyun stratejileri ve okuması</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Duran top organizasyonları</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section — dark */}
      <div className="bg-slate-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white uppercase tracking-wide">Hemen Aramıza Katıl!</h2>
          <div className="w-12 h-1 bg-secondary mx-auto rounded-full mb-6" />
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/70">
            Profesyonel eğitim kadromuz ile futbol yolculuğuna başla
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
