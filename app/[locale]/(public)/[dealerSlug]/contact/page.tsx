import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";
import { ContactSection } from "@/components/public/contact-section";

interface ContactPageProps {
  params: Promise<{ locale: string; dealerSlug: string }>;
}

export async function generateMetadata({ params }: ContactPageProps) {
  const { dealerSlug } = await params;
  const dealer = await prisma.dealer.findUnique({
    where: { slug: dealerSlug },
    select: { name: true },
  });
  if (!dealer) return { title: "Sayfa Bulunamadı" };
  return {
    title: `İletişim | ${dealer.name}`,
    description: `${dealer.name} ile iletişime geçin.`,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: localeParam, dealerSlug } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  const dealer = await prisma.dealer.findUnique({
    where: { slug: dealerSlug, isActive: true, isPublicPageActive: true },
    select: {
      contactPhone: true,
      contactEmail: true,
      contactAddress: true,
    },
  });

  if (!dealer) notFound();

  const dictionary = await getDictionary(locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicDict = (dictionary.public || {}) as Record<string, any>;

  return (
    <ContactSection
      contactPhone={dealer.contactPhone}
      contactEmail={dealer.contactEmail}
      contactAddress={dealer.contactAddress}
      dictionary={{
        title: publicDict.contactSection?.title || "İletişim",
        subtitle: publicDict.contactSection?.subtitle || "Sorularınız için bizimle iletişime geçin.",
        phoneLabel: publicDict.contactSection?.phoneLabel || "Telefon",
        emailLabel: publicDict.contactSection?.emailLabel || "E-posta",
        addressLabel: publicDict.contactSection?.addressLabel || "Adres",
        hoursLabel: publicDict.contactSection?.hoursLabel || "Çalışma Saatleri",
        hours: publicDict.contactSection?.hours || "Pazartesi - Cumartesi: 09:00 - 21:00",
      }}
    />
  );
}
