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
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/contexts/cart-context";
import { useFavorites } from "@/lib/contexts/favorites-context";

interface PublicHeaderProps {
  dealerSlug: string;
  dealerName: string;
  dealerLogo?: string | null;
  locale: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  dictionary: {
    shop: string;
    gallery: string;
    contact: string;
    cart: string;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();

  // Build paths based on whether we're using root paths or dealer-specific paths
  const basePath = useRootPaths ? `/${locale}` : `/${locale}/${dealerSlug}`;

  const navLinks = [
    { href: basePath, label: "Ana Sayfa", icon: Store },
    { href: `${basePath}/shop`, label: "Mağaza", icon: ShoppingBag },
    { href: `${basePath}#contact`, label: "İletişim", icon: MessageCircle },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-slate-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              {contactPhone && (
                <a
                  href={`tel:${contactPhone}`}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>{contactPhone}</span>
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>{contactEmail}</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Ücretsiz Kargo | Güvenli Ödeme</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg"
            : "bg-white dark:bg-slate-900"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href={basePath} className="flex items-center gap-3 group">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-full bg-white shadow-md group-hover:shadow-lg transition-shadow overflow-hidden">
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
                <p className="text-xs text-slate-500">Resmi Mağaza</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
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
              {/* Search Button */}
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

              {/* Wishlist */}
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

              {/* Cart */}
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
                  placeholder="Ürün ara..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Ara
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
            isMobileMenuOpen ? "max-h-96 border-t" : "max-h-0"
          }`}
        >
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Contact Info */}
            <div className="pt-4 mt-4 border-t space-y-3">
              {contactPhone && (
                <a
                  href={`tel:${contactPhone}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  <Phone className="h-4 w-4" />
                  {contactPhone}
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  <Mail className="h-4 w-4" />
                  {contactEmail}
                </a>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
