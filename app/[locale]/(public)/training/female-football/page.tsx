import { Metadata } from "next";
import { Trophy, Users, Calendar, Award, Heart, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kız Futbol Eğitimi | Çamlık Spor Kulübü",
  description: "Kızlarımız için özel tasarlanmış futbol eğitimi programı ile güçlü, özgüvenli sporcular yetiştiriyoruz.",
};

export default function FemaleFootballPage() {
  const features = [
    {
      icon: Heart,
      title: "Kızlara Özel Program",
      description: "Kız sporcuların gelişimine özel tasarlanmış eğitim programı",
    },
    {
      icon: Users,
      title: "Kadın Antrenörler",
      description: "Deneyimli kadın antrenörlerimiz ile güvenli ortam",
    },
    {
      icon: Sparkles,
      title: "Özgüven Geliştirme",
      description: "Spor ile özgüven ve liderlik becerilerini güçlendirme",
    },
    {
      icon: Trophy,
      title: "Kadın Futbolu",
      description: "Kadın futbolunun gelişimine katkı sağlama",
    },
    {
      icon: Calendar,
      title: "Düzenli Antrenmanlar",
      description: "Haftalık düzenli ve sistematik antrenman programı",
    },
    {
      icon: Award,
      title: "Turnuva Katılımı",
      description: "Kız futbol turnuvalarına katılım ve yarışma deneyimi",
    },
  ];

  const ageGroups = [
    { age: "6-8 Yaş", name: "Mini Kızlar", days: "Çarşamba-Cuma", time: "16:00-17:00" },
    { age: "9-11 Yaş", name: "Genç Kızlar", days: "Salı-Perşembe-Cumartesi", time: "16:30-18:00" },
    { age: "12-14 Yaş", name: "Yıldızlar", days: "Pazartesi-Çarşamba-Cuma", time: "17:00-18:30" },
    { age: "15-17 Yaş", name: "Büyükler", days: "Salı-Perşembe-Pazar", time: "17:30-19:00" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark, left-aligned */}
      <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            Kız Futbol
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
            Kız Futbol Eğitimi
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-white/70 animate-fade-in-up">
            Güçlü, özgüvenli ve başarılı kız futbolcular yetiştiriyoruz
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
            Kız Futbolunda Öncüyüz
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

      {/* Why Girls Football */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Faydalar
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Kız Futbolunun Faydaları
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fiziksel Gelişim</h3>
            <p className="text-slate-600">
              Koordinasyon, denge ve motor becerilerin gelişimi
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Özgüven</h3>
            <p className="text-slate-600">
              Kendine güvenen, güçlü ve kararlı kızlar yetiştiriyoruz
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sosyalleşme</h3>
            <p className="text-slate-600">
              Takım ruhu ve arkadaşlık bağlarının gelişimi
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section — dark */}
      <div className="bg-slate-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white uppercase tracking-wide">Kızların Futbol Yolculuğu Başlasın!</h2>
          <div className="w-12 h-1 bg-secondary mx-auto rounded-full mb-6" />
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/70">
            Güçlü, özgüvenli ve başarılı kız futbolcular yetiştirmek için buradayız
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
