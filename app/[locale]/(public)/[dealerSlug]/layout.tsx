import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { i18n, type Locale } from "@/lib/i18n/config";

interface PublicLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; dealerSlug: string }>;
}

export default async function PublicLayout({
  children,
  params,
}: PublicLayoutProps) {
  const { locale: localeParam, dealerSlug } = await params;

  // Validate locale
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  // Fetch dealer by slug to validate it exists
  const dealer = await prisma.dealer.findUnique({
    where: {
      slug: dealerSlug,
      isActive: true,
      isPublicPageActive: true,
    },
  });

  if (!dealer) {
    notFound();
  }

  // Just return children - parent layout handles UI
  return <>{children}</>;
}
