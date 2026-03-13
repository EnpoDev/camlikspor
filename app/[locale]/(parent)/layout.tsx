import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { i18n } from "@/lib/i18n/config";
import Link from "next/link";
import { Home, Calendar, Users, CreditCard, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function ParentLayout({
  children,
  params,
}: ParentLayoutProps) {
  const session = await auth();
  const { locale: localeParam } = await params;

  // Validate locale
  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  // Redirect if not logged in or not a parent
  if (!session?.user) {
    redirect(`/${locale}/parent-login`);
  }

  if (session.user.role !== "PARENT") {
    redirect(`/${locale}/dashboard`);
  }

  // Check if password must be changed
  if (session.user.mustChangePassword) {
    redirect(`/${locale}/parent/parent/change-password`);
  }

  const dictionary = await getDictionary(locale);

  const menuItems = [
    {
      title: "Ana Sayfa",
      href: `/${locale}/parent/parent`,
      icon: Home,
    },
    {
      title: "Ders Programi",
      href: `/${locale}/parent/parent/schedule`,
      icon: Calendar,
    },
    {
      title: "Devamsizlik",
      href: `/${locale}/parent/parent/attendance`,
      icon: Users,
    },
    {
      title: "Aidat Takibi",
      href: `/${locale}/parent/parent/payments`,
      icon: CreditCard,
    },
    {
      title: "Ayarlar",
      href: `/${locale}/parent/parent/settings`,
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        {/* Logo/Header */}
        <div className="flex h-16 items-center justify-center border-b border-slate-200 dark:border-slate-800 px-6">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Veli Paneli
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="border-b border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
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
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <form action="/api/auth/signout" method="POST">
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Cikis Yap
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Veli Paneli
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
