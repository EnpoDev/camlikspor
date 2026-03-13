"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ArrowRight,
  Trophy,
  Users,
  Target,
  Calendar,
  Heart,
} from "lucide-react";

interface HeroSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  titleColor?: string;
  subtitle: string;
  ctaPrimary: string;
  ctaPrimaryUrl?: string;
  ctaSecondary: string;
  ctaSecondaryUrl?: string;
  showCtaPrimary?: boolean;
  showCtaSecondary?: boolean;
}

interface HeroSliderProps {
  dealerName: string;
  locale: string;
  slides?: HeroSlide[];
}

export function HeroSlider({ dealerName, locale, slides: initialSlides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use provided slides or fall back to default slides
  const slides: HeroSlide[] = initialSlides && initialSlides.length > 0
    ? initialSlides
    : [
        {
          id: "default-1",
          image: "/images/hero-1.jpg",
          badge: "Profesyonel Futbol Eğitimi",
          title: `${dealerName} Futbol Okulu`,
          subtitle: "Profesyonel eğitmenler eşliğinde, modern tesislerde çocuğunuzun futbol yeteneğini keşfedin!",
          ctaPrimary: "Kayıt Ol",
          ctaSecondary: "Hakkımızda",
        },
        {
          id: "default-2",
          image: "/images/hero-2.jpg",
          badge: "Modern Tesisler",
          title: "En İyi Eğitim Ortamı",
          subtitle: "Son teknoloji sentetik sahalarımız ve profesyonel antrenman alanlarımızla çocuklarınıza en iyisini sunuyoruz!",
          ctaPrimary: "Tesisleri İncele",
          ctaSecondary: "İletişim",
        },
        {
          id: "default-3",
          image: "/images/hero-3.jpg",
          badge: "Deneyimli Kadro",
          title: "UEFA Lisanslı Antrenörler",
          subtitle: "Deneyimli ve lisanslı antrenör kadromuzla her yaş grubuna özel eğitim programları sunuyoruz!",
          ctaPrimary: "Hemen Başla",
          ctaSecondary: "Detaylı Bilgi",
        },
      ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
      {/* Slide Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-emerald-900/70" />
        </div>
      ))}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-6 md:px-4 relative z-30">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8 animate-fade-in-down">
            <Trophy className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 shrink-0" />
            <span className="text-white/90 text-xs md:text-sm font-medium">
              {currentSlideData.badge}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight px-2 animate-fade-in-up delay-100">
            <span style={{ color: currentSlideData.titleColor || "#10b981" }}>
              {currentSlideData.title}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4 animate-fade-in-up delay-200">
            {currentSlideData.subtitle}
          </p>

          {/* CTA Buttons */}
          {(currentSlideData.showCtaPrimary !== false || currentSlideData.showCtaSecondary !== false) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              {currentSlideData.showCtaPrimary !== false && (
                <Link href={currentSlideData.ctaPrimaryUrl || `/${locale}#contact`}>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                  >
                    <GraduationCap className="mr-2 h-5 w-5" />
                    {currentSlideData.ctaPrimary}
                  </Button>
                </Link>
              )}
              {currentSlideData.showCtaSecondary !== false && (
                <Link href={currentSlideData.ctaSecondaryUrl || `/${locale}#about`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    {currentSlideData.ctaSecondary}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Club Features Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/70 animate-fade-in delay-500">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">Profesyonel Eğitmenler</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">Modern Tesisler</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">Esnek Antrenman Saatleri</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">Her Yaş Grubu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            className="dark:fill-slate-950"
          />
        </svg>
      </div>
    </section>
  );
}
