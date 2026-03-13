import { Metadata } from "next";
import { Trophy, Users, Calendar, Clock, Award, Target, Heart, Sparkles } from "lucide-react";
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
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Kız Futbol Eğitimi
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
            Güçlü, özgüvenli ve başarılı kız futbolcular yetiştiriyoruz
          </p>
          <Button size="lg" className="bg-white text-pink-600 hover:bg-slate-100">
            <a href="#contact">Hemen Kayıt Ol</a>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Kız Futbolunda Öncüyüz</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Age Groups */}
      <div className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Yaş Grupları ve Antrenman Saatleri</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ageGroups.map((group, index) => (
              <Card key={index} className="border-2 border-pink-200 hover:border-pink-400 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{group.age}</h3>
                  <p className="text-pink-600 font-semibold mb-4">{group.name}</p>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
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
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Kız Futbolunun Faydaları</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-10 w-10 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fiziksel Gelişim</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Koordinasyon, denge ve motor becerilerin gelişimi
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Özgüven</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Kendine güvenen, güçlü ve kararlı kızlar yetiştiriyoruz
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sosyalleşme</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Takım ruhu ve arkadaşlık bağlarının gelişimi
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Kızların Futbol Yolculuğu Başlasın!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Güçlü, özgüvenli ve başarılı kız futbolcular yetiştirmek için buradayız
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-slate-100">
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
