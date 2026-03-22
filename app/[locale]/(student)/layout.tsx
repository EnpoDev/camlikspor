import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Locale } from "@/lib/i18n/config";
import { i18n } from "@/lib/i18n/config";
import Link from "next/link";
import {
  Home,
  Calendar,
  Users,
  CreditCard,
  Settings,
  LogOut,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function StudentLayout({
  children,
  params,
}: StudentLayoutProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  if (!session?.user) {
    redirect(`/${locale}/student-login`);
  }

  if (session.user.role !== "STUDENT") {
    redirect(`/${locale}/dashboard`);
  }

  if (session.user.mustChangePassword) {
    redirect(`/${locale}/student/change-password`);
  }

  const menuItems = [
    {
      title: "Ana Sayfa",
      href: `/${locale}/student`,
      icon: Home,
    },
    {
      title: "Ders Programı",
      href: `/${locale}/student/schedule`,
      icon: Calendar,
    },
    {
      title: "Yoklama",
      href: `/${locale}/student/attendance`,
      icon: Users,
    },
    {
      title: "Ödemeler",
      href: `/${locale}/student/payments`,
      icon: CreditCard,
    },
    {
      title: "Gelişim",
      href: `/${locale}/student/development`,
      icon: TrendingUp,
    },
    {
      title: "Ayarlar",
      href: `/${locale}/student/settings`,
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col bg-slate-900 border-r border-slate-800">
        {/* Logo/Header */}
        <div className="flex h-16 items-center justify-center border-b border-slate-800 px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold uppercase tracking-wide text-white">
              Sporcu Paneli
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-primary/10 hover:text-secondary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 p-4">
          <form action="/api/auth/signout" method="POST">
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Çıkış Yap
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold uppercase tracking-wide text-white">
              Sporcu Paneli
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
