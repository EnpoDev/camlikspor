import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface BannerSectionProps {
  bannerImage?: string | null;
  bannerTitle?: string | null;
  bannerLink?: string | null;
  isVisible: boolean;
}

export function BannerSection({
  bannerImage,
  bannerTitle,
  bannerLink,
  isVisible,
}: BannerSectionProps) {
  if (!isVisible) return null;

  const inner = (
    <div className="group relative w-full h-[300px] md:h-[400px] overflow-hidden">
      {/* Background */}
      {bannerImage ? (
        <Image
          src={bannerImage}
          alt={bannerTitle ?? "Banner"}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="100vw"
          priority={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000] via-primary to-[#8B0000]" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

      {/* Content */}
      {bannerTitle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide drop-shadow-lg max-w-4xl leading-tight">
            {bannerTitle}
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-4" />
          {bannerLink && (
            <div className="mt-6 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors text-sm font-semibold uppercase tracking-widest">
              <span>Devamını Gör</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (bannerLink) {
    return (
      <section className="w-full">
        <Link href={bannerLink} className="block">
          {inner}
        </Link>
      </section>
    );
  }

  return <section className="w-full">{inner}</section>;
}
