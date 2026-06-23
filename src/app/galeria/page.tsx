"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const photos = [
  { src: "/gallery/img1.jpg", key: "gallery.photo1" },
  { src: "/gallery/img2.jpg", key: "gallery.photo2" },
  { src: "/gallery/img3.jpg", key: "gallery.photo3" },
  { src: "/gallery/img4.jpg", key: "gallery.photo4" },
  { src: "/gallery/img5.jpg", key: "gallery.photo5" },
  { src: "/gallery/img6.jpg", key: "gallery.photo6" },
  { src: "/gallery/img7.jpg", key: "gallery.photo7" },
  { src: "/gallery/img8.jpg", key: "gallery.photo8" },
];

export default function Galeria() {
  const { t, language } = useLanguage();
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  const handlePrev = React.useCallback(() => {
    setActivePhoto((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
  }, []);

  const handleNext = React.useCallback(() => {
    setActivePhoto((prev) => (prev !== null ? (prev + 1) % photos.length : null));
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhoto === null) return;
      if (e.key === "Escape") setActivePhoto(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, handlePrev, handleNext]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Header Banner */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <Image
          src="/hero1.jpg"
          alt={t("gallery.title").toUpperCase()}
          fill
          className="object-cover"
          priority
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 flex flex-col gap-4 animate-slide-up">
          <span className="text-brand font-bold text-sm uppercase tracking-widest">
            {t("gallery.badge")}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            {t("gallery.title")}
          </h1>
          <p className="text-zinc-200 text-lg max-w-xl font-light">
            {t("gallery.header.desc")}
          </p>
        </div>
      </section>

      {/* 2. Photo Grid Section */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          <div className="max-w-2xl">
            <span className="text-brand font-semibold text-sm uppercase tracking-wider">
              {t("gallery.info.badge")}
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2 tracking-tight">
              {t("gallery.info.title")}
            </h2>
            <p className="text-zinc-500 mt-4 leading-relaxed">
              {t("gallery.info.desc")}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhoto(idx)}
                className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                aria-label={`Open photo ${idx + 1} in lightbox`}
              >
                <Image
                  src={photo.src}
                  alt={t(photo.key)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-108"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/20 scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Lightbox Modal Overlay */}
      {activePhoto !== null && (
        <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-brand text-white p-3 rounded-full transition-colors z-50"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-brand text-white p-3 rounded-full transition-all duration-300 z-50 hover:scale-105"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-brand text-white p-3 rounded-full transition-all duration-300 z-50 hover:scale-105"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Centered Image Card */}
          <div className="relative max-w-5xl w-full max-h-[80vh] flex flex-col items-center justify-center p-2">
            <div className="relative w-full aspect-[3/2] rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-900 bg-zinc-900">
              <Image
                src={photos[activePhoto].src}
                alt={t(photos[activePhoto].key)}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            
            {/* Description Info overlay */}
            <div className="text-center mt-6 text-zinc-300 max-w-xl">
              <p className="text-sm font-medium">{t(photos[activePhoto].key)}</p>
              <span className="text-zinc-500 text-xs mt-2 block">
                {language === "es"
                  ? `Imagen ${activePhoto + 1} de ${photos.length}`
                  : `Image ${activePhoto + 1} of ${photos.length}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
