import { redirect } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n/config";

interface RootPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RootPage({ params }: RootPageProps) {
  const { locale: localeParam } = await params;
  const locale = i18n.locales.includes(localeParam as Locale)
    ? localeParam
    : i18n.defaultLocale;

  redirect(`/${locale}/dashboard`);
}
