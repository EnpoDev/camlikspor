import { Metadata } from "next";
import { Zap, Users, Award, Target, Footprints, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Futsal Eğitimi | Çamlık Spor Kulübü",
  description: "Hızlı, teknik ve eğlenceli futsal eğitimi ile becerilerinizi geliştirin.",
};

export default function FutsalPage() {
  const features = [
    {
      icon: Zap,
      title: "Hızlı Tempo",
      description: "Dinamik ve hızlı tempolu oyun ile refleksler gelişir",
    },
    {
      icon: Brain,
      title: "Teknik Gelişim",
      description: "Dar alanda oynama ile üstün teknik beceriler",
    },
    {
      icon: Footprints,
      title: "Her Mevsim",
      description: "Kapalı salon avantajı ile yıl boyu antrenman",
    },
    {
      icon: Users,
      title: "5v5 Oyun",
      description: "Küçük takım ile herkes topa daha çok dokunur",
    },
    {
      icon: Award,
      title: "Turnuvalar",
      description: "Bölgesel ve ulusal futsal turnuvalarına katılım",
    },
    {
      icon: Target,
      title: "Taktik Eğitim",
      description: "Futsal taktikleri ve oyun zekası gelişimi",
    },
  ];

  const ageGroups = [
    { age: "7-9 Yaş", name: "Mini Futsal", days: "Pazartesi-Perşembe", time: "16:00-17:00" },
    { age: "10-12 Yaş", name: "Futsal U12", days: "Salı-Cuma", time: "17:00-18:30" },
    { age: "13-15 Yaş", name: "Futsal U15", days: "Çarşamba-Cumartesi", time: "17:30-19:00" },
    { age: "16+ Yaş", name: "Yetişkin Futsal", days: "Perşembe-Pazar", time: "19:00-20:30" },
  ];

  const differences = [
    { title: "Saha", futsal: "40x20m kapalı saha", football: "90x45m açık saha" },
    { title: "Oyuncu", futsal: "5v5 (kaleci dahil)", football: "11v11" },
    { title: "Top", futsal: "Küçük ve az zıplayan", football: "Büyük ve normal" },
    { title: "Süre", futsal: "2x20 dakika", football: "2x45 dakika" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark, left-aligned */}
      <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            Futsal
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
            Futsal Eğitimi
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-white/70 animate-fade-in-up">
            Hızlı, teknik ve eğlenceli futsal ile becerilerinizi geliştirin
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
              Avantajlar
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Futsal&apos;ın Avantajları
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

      {/* Futsal vs Football */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                Karşılaştırma
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
              Futsal vs Klasik Futbol
            </h2>
          </div>
          <div className="max-w-3xl">
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-4 text-left font-bold uppercase tracking-wide text-sm">Özellik</th>
                    <th className="p-4 text-left font-bold uppercase tracking-wide text-sm">Futsal</th>
                    <th className="p-4 text-left font-bold uppercase tracking-wide text-sm">Klasik Futbol</th>
                  </tr>
                </thead>
                <tbody>
                  {differences.map((diff, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold">{diff.title}</td>
                      <td className="p-4 text-primary font-medium">{diff.futsal}</td>
                      <td className="p-4 text-slate-600">{diff.football}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* Why Futsal */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                Neden
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
              Neden Futsal?
            </h2>
          </div>
          <div className="max-w-4xl space-y-6">
            <Card className="border-l-4 border-l-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Hızlı Gelişim</h3>
                <p className="text-slate-600">
                  Küçük sahada oynadığınız için topa daha sık dokunursunuz. Bu da teknik becerilerinizin çok daha hızlı gelişmesini sağlar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Oyun Zekası</h3>
                <p className="text-slate-600">
                  Hızlı tempo ve dar alan, hızlı düşünme ve karar verme yeteneğinizi geliştirir.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Yıl Boyu Oyun</h3>
                <p className="text-slate-600">
                  Kapalı saha avantajı ile yağmur, kar veya sıcak demeden yıl boyunca antrenman yapabilirsiniz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section — dark */}
      <div className="bg-slate-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white uppercase tracking-wide">Futsal Macerası Başlasın!</h2>
          <div className="w-12 h-1 bg-secondary mx-auto rounded-full mb-6" />
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/70">
            Hızlı, eğlenceli ve gelişim odaklı futsal eğitimi için hemen katıl
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
