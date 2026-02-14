"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Globe, Menu, KeyRound } from "lucide-react";
import { i18n, localeNames, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { UserRole } from "@/lib/types";

interface HeaderProps {
  locale: Locale;
  user: {
    name?: string | null;
    email?: string | null;
    dealerName?: string | null;
  };
  userRole: UserRole;
  userPermissions: string[];
  dictionary: Dictionary;
}

export function Header({
  locale,
  user,
  userRole,
  userPermissions,
  dictionary,
}: HeaderProps) {
  const pathname = usePathname();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}/login` });
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar
            locale={locale}
            userRole={userRole}
            userPermissions={userPermissions}
            dictionary={dictionary.sidebar}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex items-center gap-3">
        <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-white border">
          <Image
            src="/logo.png"
            alt="Çamlık Spor"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
        </div>
        {user.dealerName && (
          <span className="text-sm font-medium text-foreground">
            {user.dealerName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Switcher - Hidden on mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Globe className="h-4 w-4" />
              <span className="sr-only">{dictionary.header.language}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{dictionary.header.language}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {i18n.locales.map((l) => (
              <DropdownMenuItem key={l} asChild>
                <Link href={switchLocale(l)}>{localeNames[l]}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full">
              <Avatar className="h-9 w-9 md:h-10 md:w-10">
                <AvatarFallback className="text-xs md:text-sm">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/settings/profile`}>
                <User className="mr-2 h-4 w-4" />
                <span>{dictionary.header.profile}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/settings/password`}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>{dictionary.settings.changePassword}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{dictionary.header.logout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
