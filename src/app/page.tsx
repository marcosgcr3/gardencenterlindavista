"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sprout,
  Compass,
  Truck,
  Flower2,
  TreePine,
  Armchair,
  Star,
  Quote,
  Clock,
  Heart
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t, language } = useLanguage();

  // Hero Carousel Logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      image: "/hero1.jpg",
      title: t("home.slide1.title"),
      description: t("home.slide1.desc"),
    },
    {
      image: "/hero2.jpg",
      title: t("home.slide2.title"),
      description: t("home.slide2.desc"),
    },
    {
      image: "/hero3.jpg",
      title: t("home.slide3.title"),
      description: t("home.slide3.desc"),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // Testimonials Carousel Logic
  const [currentReview, setCurrentReview] = useState(0);
  const reviews = [
    {
      name: "Carlo Piran",
      text: t("review.1"),
      stars: 5,
    },
    {
      name: "Monika Aloka",
      text: t("review.2"),
      stars: 5,
    },
    {
      name: "Dholdings",
      text: t("review.3"),
      stars: 5,
    },
    {
      name: "Brian Hurley",
      text: t("review.4"),
      stars: 5,
    },
    {
      name: "Paul Wilcox",
      text: t("review.5"),
      stars: 5,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const titleText = language === "es"
    ? "Garden Center Linda Vista | Vivero y Jardinería en Marbella"
    : "Garden Center Linda Vista | Nursery & Gardening in Marbella";
  const descText = language === "es"
    ? "Vivero familiar en San Pedro Alcántara (Marbella) desde 1989. Amplia selección de plantas de interior, exterior, alfarería artesanal y servicios de jardinería profesional."
    : "Family nursery in San Pedro Alcántara (Marbella) since 1989. Large selection of indoor and outdoor plants, artisan pottery, and professional gardening services.";

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <title>{titleText}</title>
      <meta name="description" content={descText} />
      <meta property="og:title" content={titleText} />
      <meta property="og:description" content={descText} />
      <meta property="og:url" content="http://gardencenterlindavista.com" />
      <meta name="twitter:title" content={titleText} />
      <meta name="twitter:description" content={descText} />
      {/* 1. Hero Carousel Section */}
      <section className="relative h-[80vh] min-h-[500px] w-full bg-zinc-900 text-white">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-black/45 z-10" />
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={idx === 0}
            />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl flex flex-col gap-6 animate-slide-up">
                  <span className="text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit backdrop-blur-xs">
                    {t("home.badge")}
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-zinc-250 font-light leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <Link
                      href="/contacto"
                      className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand/20 active:scale-95 text-center sm:w-auto w-full"
                    >
                      {t("home.btn.info")}
                    </Link>
                    <Link
                      href="/sobre-nosotros"
                      className="border-2 border-white hover:bg-white hover:text-zinc-950 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 active:scale-95 text-center sm:w-auto w-full"
                    >
                      {t("home.btn.more")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-950/40 hover:bg-brand/90 hover:scale-105 text-white p-2.5 sm:p-3 rounded-full transition-all duration-300 z-30 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-950/40 hover:bg-brand/90 hover:scale-105 text-white p-2.5 sm:p-3 rounded-full transition-all duration-300 z-30 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? "w-8 bg-brand" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Premium Features Quick Grid */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glassmorphism rounded-2xl p-8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t("home.features.title1")}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                {t("home.features.desc1")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glassmorphism rounded-2xl p-8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t("home.features.title2")}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                {t("home.features.desc2")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glassmorphism rounded-2xl p-8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t("home.features.title3")}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                {t("home.features.desc3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Us Preview Section */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Text Side */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <span className="text-brand font-bold text-sm uppercase tracking-wider">
                {t("home.about.badge")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
                {t("home.about.title")}
              </h2>
              <p className="text-zinc-655 dark:text-zinc-400 leading-relaxed text-base font-light">
                {t("home.about.desc1")}
              </p>
              <p className="text-zinc-655 dark:text-zinc-400 leading-relaxed text-base font-light">
                {t("home.about.desc2")}
              </p>
              <div className="pt-2">
                <Link
                  href="/sobre-nosotros"
                  className="inline-flex items-center gap-2 text-brand hover:text-brand-dark font-semibold text-base transition-colors group"
                >
                  {t("home.about.link")}
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Image Side */}
            <div className="lg:col-span-5 relative w-full aspect-square md:aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-zinc-200 dark:shadow-none border-8 border-white dark:border-zinc-900 group">
              <Image
                src="/about.jpg"
                alt="Instalaciones Garden Center Linda Vista"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Grid Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <span className="text-brand font-bold text-sm uppercase tracking-wider">
              {t("home.services.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {t("home.services.title")}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              {t("home.services.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-8 flex flex-col gap-6 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t("home.services.s1.title")}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                  {t("home.services.s1.desc")}
                </p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-8 flex flex-col gap-6 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Flower2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t("home.services.s2.title")}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                  {t("home.services.s2.desc")}
                </p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-8 flex flex-col gap-6 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t("home.services.s3.title")}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                  {t("home.services.s3.desc")}
                </p>
              </div>
            </div>

            {/* Service 4 */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-2xl p-8 flex flex-col gap-6 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Armchair className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t("home.services.s4.title")}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                  {t("home.services.s4.desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Timetable & Callback CTA Section */}
      <section className="relative py-28 bg-brand text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-light/35 via-brand/10 to-brand-dark/20 z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {t("home.cta.title")}
              </h2>
              <p className="text-zinc-100 font-light text-base leading-relaxed">
                {t("home.cta.desc")}
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <a
                  href="tel:952785206"
                  className="bg-zinc-950 hover:bg-zinc-900 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-xl active:scale-95 text-center"
                >
                  {t("home.cta.btn.call")}
                </a>
                <Link
                  href="/contacto"
                  className="border-2 border-white hover:bg-white hover:text-brand text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 active:scale-95 text-center"
                >
                  {t("home.cta.btn.msg")}
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col gap-6 shadow-xl">
              <h3 className="text-xl font-bold text-white tracking-wide border-b border-white/20 pb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-light" />
                {t("home.cta.hours.title")}
              </h3>
              <div className="flex flex-col gap-4 text-zinc-100 font-light">
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-white">{t("days.mon-fri")}</span>
                  <span>08:30 - 14:00 / 16:00 - 20:00</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/10 pt-4">
                  <span className="font-medium text-white">{t("days.sat")}</span>
                  <span>10:00 - 14:00</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/10 pt-4">
                  <span className="font-medium text-white">{t("days.sun")}</span>
                  <span className="text-brand-light font-medium bg-zinc-950/20 px-3 py-1 rounded-full text-xs">{t("status.closed")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-brand font-bold text-sm uppercase tracking-wider">
              {t("home.reviews.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {t("home.reviews.title")}
            </h2>
          </div>

          <div className="relative glassmorphism dark:bg-zinc-900/60 rounded-3xl p-10 md:p-14 shadow-xl flex flex-col gap-6 min-h-[300px] justify-center transition-all duration-300">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-brand rounded-full flex items-center justify-center shadow-lg shadow-brand/20">
              <Quote className="w-5 h-5 text-white" />
            </div>

            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className={`transition-all duration-500 flex flex-col gap-6 ${
                  idx === currentReview
                    ? "opacity-100 scale-100 flex"
                    : "opacity-0 scale-95 hidden"
                }`}
              >
                <div className="flex justify-center gap-1">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 italic font-light leading-relaxed px-4 md:px-8">
                  &ldquo;{rev.text}&rdquo;
                </p>
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                    {rev.name}
                  </h4>
                  <span className="text-xs text-zinc-400 uppercase tracking-widest mt-1 block">
                    {t("home.reviews.subtitle")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Nav dots */}
          <div className="flex justify-center gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentReview(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentReview ? "w-8 bg-brand" : "w-2.5 bg-zinc-200 dark:bg-zinc-800"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
