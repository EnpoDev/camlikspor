import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { i18n } from "@/lib/i18n/config";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { UserRole } from "@/lib/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  // Validate locale
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const dictionary = await getDictionary(locale);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        locale={locale}
        userRole={session.user.role as UserRole}
        userPermissions={session.user.permissions || []}
        dictionary={dictionary.sidebar}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          locale={locale}
          user={{
            name: session.user.name,
            email: session.user.email,
            dealerName: session.user.dealerName,
          }}
          userRole={session.user.role as UserRole}
          userPermissions={session.user.permissions || []}
          dictionary={dictionary}
        />
        <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
