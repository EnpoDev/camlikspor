import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { Award, Users, Landmark } from "lucide-react";

interface AboutPageProps {
  params: Promise<{ locale: string; dealerSlug: string }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { dealerSlug } = await params;
  const dealer = await prisma.dealer.findUnique({
    where: { slug: dealerSlug },
    select: { name: true },
  });
  if (!dealer) return { title: "Sayfa Bulunamadı" };
  return {
    title: `Hakkımızda - ${dealer.name}`,
    description: `${dealer.name} hakkında bilgi`,
  };
}

const featureIcons = [Award, Users, Landmark] as const;

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam, dealerSlug } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  const dealer = await prisma.dealer.findUnique({
    where: { slug: dealerSlug, isActive: true },
    select: { name: true, aboutText: true, contactPhone: true, contactEmail: true, contactAddress: true },
  });

  if (!dealer) notFound();

  const dictionary = await getDictionary(locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aboutDict = ((dictionary.public as Record<string, any>)?.homepage?.about || {}) as Record<string, string>;

  const features = [
    { title: aboutDict.feature1Title || "Lisanslı Eğitmenler", desc: aboutDict.feature1Desc || "UEFA lisanslı, deneyimli antrenör kadromuz" },
    { title: aboutDict.feature2Title || "Yaş Gruplarına Özel Eğitim", desc: aboutDict.feature2Desc || "5-16 yaş arası farklı kategorilerde eğitim programları" },
    { title: aboutDict.feature3Title || "Modern Altyapı", desc: aboutDict.feature3Desc || "Sentetik çim sahalar ve profesyonel eğitim ortamı" },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              {aboutDict.badge || "Hakkımızda"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6">
              {aboutDict.title || "Geleceğin Futbolcularını Yetiştiriyoruz"}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              <span className="font-semibold text-slate-900">{dealer.name}</span>{" "}
              {dealer.aboutText || aboutDict.description || "çocukların futbol yeteneklerini keşfetmeleri ve geliştirmeleri için ideal ortamı sunan profesyonel bir futbol okuludur."}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, i) => {
                const Icon = featureIcons[i];
                return (
                  <div
                    key={i}
                    className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-5">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      {(dealer.contactPhone || dealer.contactEmail || dealer.contactAddress) && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Bize Ulaşın</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-600">
                {dealer.contactPhone && (
                  <a href={`tel:${dealer.contactPhone}`} className="hover:text-primary transition-colors">
                    {dealer.contactPhone}
                  </a>
                )}
                {dealer.contactEmail && (
                  <a href={`mailto:${dealer.contactEmail}`} className="hover:text-primary transition-colors">
                    {dealer.contactEmail}
                  </a>
                )}
              </div>
              {dealer.contactAddress && (
                <p className="mt-4 text-sm text-slate-500">{dealer.contactAddress}</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
