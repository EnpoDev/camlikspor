"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Camera, Images } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
}

interface GalleryPageClientProps {
  images: GalleryImage[];
  dealerName: string;
}

export function GalleryPageClient({ images, dealerName }: GalleryPageClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  if (images.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Hero */}
        <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
          <div className="container mx-auto relative z-10 max-w-5xl">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
              Galeri
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
              Foto Galeri
            </h1>
            <p className="text-lg md:text-xl max-w-3xl text-white/70 animate-fade-in-up">
              <span className="text-secondary font-bold">{dealerName}</span> ailesinden kareler
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-20 text-center">
          <Camera className="h-24 w-24 mx-auto text-slate-300 mb-6" />
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Henuz Fotograf Yok</h2>
          <p className="text-slate-500">Galeri fotograflari yakinda eklenecek.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section — dark */}
      <div className="relative bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-slate-900 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            Galeri
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide mb-4 text-white animate-fade-in-up">
            Foto Galeri
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-white/70 animate-fade-in-up">
            <span className="text-secondary font-bold">{dealerName}</span> ailesinden kareler
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Images className="h-5 w-5 text-white/60" />
            <span className="text-2xl font-black text-white">{images.length}</span>
            <span className="text-sm text-white/70 font-medium uppercase tracking-wide">Fotograf</span>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1 w-8 rounded-full bg-primary" />
            <span className="text-primary text-sm font-bold uppercase tracking-widest">
              Koleksiyon
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-wide">
            Anlarımız
          </h2>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Image
                src={image.url}
                alt={image.title || `Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {image.title && (
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-bold">{image.title}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl p-0 border-0 bg-transparent">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-50 rounded-full bg-black/50 backdrop-blur-sm p-2 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            {selectedIndex !== null && images[selectedIndex] && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden">
                <Image
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].title || "Gallery image"}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Caption */}
            {selectedIndex !== null && images[selectedIndex]?.title && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white text-center rounded-b-2xl">
                <p className="font-bold text-lg">{images[selectedIndex].title}</p>
                {images[selectedIndex].description && (
                  <p className="text-sm text-white/70 mt-1">
                    {images[selectedIndex].description}
                  </p>
                )}
              </div>
            )}

            {/* Counter */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-sm font-medium">
              {selectedIndex !== null && `${selectedIndex + 1} / ${images.length}`}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
