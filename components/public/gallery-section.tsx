"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ArrowRight, Camera } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  title?: string | null;
  description?: string | null;
}

interface GallerySectionProps {
  images: GalleryImage[];
  dealerSlug: string;
  locale: string;
  dictionary: {
    title: string;
    viewAll: string;
  };
  useRootPaths?: boolean;
}

function GalleryCard({
  image,
  index,
  large,
  onOpen,
}: {
  image: GalleryImage;
  index: number;
  large: boolean;
  onOpen: (i: number) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const handleError = useCallback(() => setHasError(true), []);

  return (
    <button
      onClick={() => onOpen(index)}
      className={`group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        large ? "aspect-[16/9]" : "aspect-[4/3]"
      } w-full`}
    >
      {hasError ? (
        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
          <Camera className="h-10 w-10 text-slate-400" />
        </div>
      ) : (
        <Image
          src={image.url}
          alt={image.title || `Galeri fotoğrafı ${index + 1}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes={large ? "(max-width: 640px) 50vw, 33vw" : "(max-width: 640px) 50vw, 33vw"}
          onError={handleError}
        />
      )}

      {/* Permanent subtle overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300 group-hover:ring-2 group-hover:ring-primary group-hover:ring-inset" />

      {/* Top overlay: camera icon (appears on hover) */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="h-8 w-8 rounded-full bg-black/60 flex items-center justify-center">
          <Camera className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Bottom overlay: title */}
      {image.title && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className={`text-white font-semibold line-clamp-2 ${large ? "text-base" : "text-sm"}`}>
            {image.title}
          </p>
        </div>
      )}
    </button>
  );
}

export function GallerySection({
  images,
  dealerSlug,
  locale,
  dictionary,
  useRootPaths = false,
}: GallerySectionProps) {
  const basePath = useRootPaths ? `/${locale}` : `/${locale}/${dealerSlug}`;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const featured = images.slice(0, 3);
  const secondary = images.slice(3, 6);
  const hasMore = images.length > 6;

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section header — centered, Beşiktaş style */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-12 bg-primary/60" />
              <span className="text-primary text-xs font-bold uppercase tracking-[0.25em]">
                Medya
              </span>
              <span className="h-px w-12 bg-primary/60" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase tracking-tight">
              {dictionary.title}
            </h2>
          </div>

          {/* First row: 3 featured large photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {featured.map((image, i) => (
              <GalleryCard
                key={image.id}
                image={image}
                index={i}
                large
                onOpen={openLightbox}
              />
            ))}
          </div>

          {/* Second row: up to 3 smaller photos */}
          {secondary.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {secondary.map((image, i) => (
                <GalleryCard
                  key={image.id}
                  image={image}
                  index={i + 3}
                  large={false}
                  onOpen={openLightbox}
                />
              ))}
            </div>
          )}

          {/* CTA button — centered */}
          <div className="mt-10 flex justify-center">
            <Link href={`${basePath}/gallery`}>
              <Button
                size="lg"
                className="gap-2 px-8 bg-primary text-white hover:bg-primary/90"
              >
                {dictionary.viewAll}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent
          className="max-w-5xl p-0 border-0 bg-transparent shadow-none"
          aria-describedby="gallery-lightbox-description"
        >
          <div className="relative">
            {/* Counter */}
            {selectedIndex !== null && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/60 rounded-full px-4 py-1.5 text-white text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </div>
            )}

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
              aria-label="Önceki"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
              aria-label="Sonraki"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            {selectedIndex !== null && images[selectedIndex] && (
              <div className="relative aspect-video w-full bg-black">
                <Image
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].title || "Galeri fotoğrafı"}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Caption */}
            {selectedIndex !== null &&
              (images[selectedIndex]?.title || images[selectedIndex]?.description) && (
                <div className="absolute bottom-0 inset-x-0 bg-black/75 px-6 py-4 text-center">
                  {images[selectedIndex].title && (
                    <p className="text-white font-semibold">
                      {images[selectedIndex].title}
                    </p>
                  )}
                  {images[selectedIndex].description && (
                    <p className="text-white/70 text-sm mt-1">
                      {images[selectedIndex].description}
                    </p>
                  )}
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
