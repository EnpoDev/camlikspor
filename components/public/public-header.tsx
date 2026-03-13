"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Menu,
  X,
  Phone,
  Mail,
  Search,
  User,
  Heart,
  ChevronDown,
  ShoppingBag,
  Store,
  MessageCircle,
  BookOpen,
  Info,
  CreditCard,
  UserPlus,
  Image as ImageIcon,
  Globe,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/contexts/cart-context";
import { useFavorites } from "@/lib/contexts/favorites-context";

interface NavLink {
  id: string;
  href: string;
  label: string;
  icon: any;
  children?: { id: string; href: string; label: string }[];
}

interface PublicHeaderProps {
  dealerSlug: string;
  dealerName: string;
  dealerLogo?: string | null;
  locale: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  dictionary: {
    home: string;
    about: string;
    shop: string;
    gallery: string;
    contact: string;
    blog: string;
    payments: string;
    registration: string;
    training: string;
    maleFootball: string;
    femaleFootball: string;
    futsal: string;
    esports: string;
    cart: string;
    favorites: string;
    login: string;
    search: string;
    searchPlaceholder: string;
    selectLanguage: string;
  };
  useRootPaths?: boolean;
}

export function PublicHeader({
  dealerSlug,
  dealerName,
  dealerLogo,
  locale,
  contactPhone,
  contactEmail,
  dictionary,
  useRootPaths = false,
}: PublicHeaderProps) {
  // Hardcoded contact information
  const hardcodedPhone = "0532 241 24 31";
  const hardcodedEmail = "info@camliksk.com";
  const hardcodedWhatsApp = "905322412431"; // International format for WhatsApp

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();

  const languages = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  const changeLanguage = (newLocale: string) => {
    const newPath = pathname?.replace(`/${locale}`, `/${newLocale}`) || `/${newLocale}`;
    router.push(newPath);
    setIsLanguageMenuOpen(false);
  };

  // Show cart only on shop pages
  const isShopPage = pathname?.includes("/shop") || pathname?.includes("/cart");

  // Build paths based on whether we're using root paths or dealer-specific paths
  const basePath = useRootPaths ? `/${locale}` : `/${locale}/${dealerSlug}`;

  // Blog always points to main dealer (camlikspor)
  const blogPath = `/${locale}/camlikspor/blog`;

  const navLinks: NavLink[] = [
    { id: "home", href: basePath, label: dictionary.home, icon: Store },
    { id: "about", href: `${basePath}#about`, label: dictionary.about, icon: Info },
    { id: "gallery", href: `${basePath}/gallery`, label: dictionary.gallery, icon: ImageIcon },
    { id: "shop", href: `${basePath}/shop`, label: dictionary.shop, icon: ShoppingBag },
    {
      id: "training",
      href: "#",
      label: dictionary.training,
      icon: BookOpen,
      children: [
        { id: "male-football", href: `${basePath}/training/male-football`, label: dictionary.maleFootball },
        { id: "female-football", href: `${basePath}/training/female-football`, label: dictionary.femaleFootball },
        { id: "futsal", href: `${basePath}/training/futsal`, label: dictionary.futsal },
        { id: "esports", href: `${basePath}/training/esports`, label: dictionary.esports },
      ],
    },
    { id: "blog", href: blogPath, label: dictionary.blog, icon: BookOpen },
    { id: "payments", href: `/${locale}/aidat-sorgulama`, label: dictionary.payments, icon: CreditCard },
    { id: "registration", href: `${basePath}#contact`, label: dictionary.registration, icon: UserPlus },
    { id: "contact", href: `${basePath}#contact`, label: dictionary.contact, icon: MessageCircle },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isLanguageMenuOpen && !target.closest('.language-menu-container')) {
        setIsLanguageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLanguageMenuOpen]);

  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg"
            : "!bg-transparent"
        }`}
      >
        <div className="w-full px-4">
          <div className="flex h-[100px] items-center justify-between">
            {/* Logo */}
            <Link href={basePath} className="flex items-center gap-3 group -ml-2">
              <div className={`relative w-16 h-16 flex-shrink-0 rounded-full bg-white transition-all duration-500 overflow-hidden ${
                isScrolled ? "shadow-md group-hover:shadow-lg" : "shadow-xl"
              }`}>
                <Image
                  src={dealerLogo || "/logo.png"}
                  alt={dealerName}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {dealerName}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;

                // If link has children, render dropdown
                if (link.children && link.children.length > 0) {
                  return (
                    <div key={link.id} className="relative group/dropdown">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <Icon className="h-4 w-4" />
                        {link.label}
                        <ChevronDown className="h-3 w-3 transition-transform group-hover/dropdown:rotate-180" />
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute left-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Regular link without children
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="group relative px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </span>
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative language-menu-container">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                >
                  <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </Button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                          lang.code === locale ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button - Only show on shop pages */}
              {isShopPage && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  }}
                >
                  <Search className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </Button>
              )}

              {/* Wishlist - Only show on shop pages */}
              {isShopPage && (
                <Link href={`${basePath}/favorites`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hidden md:flex h-10 w-10 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 group"
                  >
                    <Heart className={`h-5 w-5 transition-colors ${totalFavorites > 0 ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-400 group-hover:text-red-500"}`} />
                    {totalFavorites > 0 && (
                      <Badge className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500 text-[10px] font-bold animate-in zoom-in duration-200">
                        {totalFavorites > 9 ? "9+" : totalFavorites}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {/* Cart - Only show on shop pages */}
              {isShopPage && (
                <Link href={`${basePath}/cart`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group"
                  >
                    <ShoppingCart className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    {totalItems > 0 && (
                      <Badge className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-600 hover:bg-emerald-600 text-[10px] font-bold animate-in zoom-in duration-200">
                        {totalItems > 9 ? "9+" : totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {/* User Account */}
              <Link href={`/${locale}/login`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10 rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`overflow-hidden transition-all duration-300 border-t ${
            isSearchOpen ? "max-h-24" : "max-h-0 border-t-0"
          }`}
        >
          <div className="container mx-auto px-4 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`${basePath}/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }
              }}
              className="flex items-center gap-2 max-w-xl mx-auto"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dictionary.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                {dictionary.search}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-[48rem] border-t" : "max-h-0"
          }`}
        >
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;

              // If link has children, render accordion
              if (link.children && link.children.length > 0) {
                const isOpen = openMobileSubmenu === link.id;
                return (
                  <div key={link.id}>
                    <button
                      onClick={() => setOpenMobileSubmenu(isOpen ? null : link.id)}
                      className="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {/* Submenu */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        isOpen ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="ml-8 mt-1 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="block rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Regular link without children
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Links */}
            <div className="pt-4 mt-4 border-t space-y-2">
              {/* Language Switcher Mobile */}
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">{dictionary.selectLanguage}</p>
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        lang.code === locale
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="text-xs">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href={`/${locale}/login`}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                {dictionary.login}
              </Link>
              <Link
                href={`${basePath}/favorites`}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5" />
                {dictionary.favorites}
                {totalFavorites > 0 && (
                  <Badge className="ml-auto h-5 px-2 bg-red-500 hover:bg-red-500 text-[10px]">
                    {totalFavorites}
                  </Badge>
                )}
              </Link>
            </div>

            {/* Mobile Contact Info */}
            <div className="pt-4 mt-4 border-t space-y-3">
              <a
                href={`tel:${hardcodedPhone}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400"
              >
                <Phone className="h-4 w-4" />
                {hardcodedPhone}
              </a>
              <a
                href={`https://wa.me/${hardcodedWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-green-600"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={`mailto:${hardcodedEmail}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400"
              >
                <Mail className="h-4 w-4" />
                {hardcodedEmail}
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
