import { Metadata } from "next";
import { Zap, Users, Calendar, Clock, Award, Target, Footprints, Brain } from "lucide-react";
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
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-600" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Futsal Eğitimi
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
            Hızlı, teknik ve eğlenceli futsal ile becerilerinizi geliştirin
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100">
            <a href="#contact">Hemen Kayıt Ol</a>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Futsal'ın Avantajları</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Futsal vs Football */}
      <div className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Futsal vs Klasik Futbol</h2>
          <div className="max-w-3xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-orange-600 text-white">
                    <th className="p-4 text-left">Özellik</th>
                    <th className="p-4 text-left">Futsal</th>
                    <th className="p-4 text-left">Klasik Futbol</th>
                  </tr>
                </thead>
                <tbody>
                  {differences.map((diff, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4 font-semibold">{diff.title}</td>
                      <td className="p-4 text-orange-600 font-medium">{diff.futsal}</td>
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
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Yaş Grupları ve Antrenman Saatleri</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ageGroups.map((group, index) => (
            <Card key={index} className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{group.age}</h3>
                <p className="text-orange-600 font-semibold mb-4">{group.name}</p>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p><strong>Günler:</strong> {group.days}</p>
                  <p><strong>Saat:</strong> {group.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Futsal */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Neden Futsal?</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-orange-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">⚡ Hızlı Gelişim</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Küçük sahada oynadığınız için topa daha sık dokunursunuz. Bu da teknik becerilerinizin çok daha hızlı gelişmesini sağlar.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">🧠 Oyun Zekası</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Hızlı tempo ve dar alan, hızlı düşünme ve karar verme yeteneğinizi geliştirir.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">☀️ Yıl Boyu Oyun</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Kapalı saha avantajı ile yağmur, kar veya sıcak demeden yıl boyunca antrenman yapabilirsiniz.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Futsal Macerası Başlasın!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hızlı, eğlenceli ve gelişim odaklı futsal eğitimi için hemen katıl
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100">
              <a href="#contact">Ön Kayıt Yap</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <a href="tel:05322412431">Bizi Arayın</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
