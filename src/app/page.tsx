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
  Droplet,
  Flower2,
  TreePine,
  Armchair,
  Star,
  Quote,
  Clock
} from "lucide-react";

export default function Home() {
  // Hero Carousel Logic
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      image: "/hero1.jpg",
      title: "Bienvenido a Garden Center Linda Vista",
      description: "Tu vivero de confianza en la Costa del Sol desde 1989. Selección única de plantas, decoración y servicios de jardinería.",
    },
    {
      image: "/hero2.jpg",
      title: "El vivero de referencia en Marbella",
      description: "Situados en San Pedro Alcántara, a escasos minutos de Puerto Banús. Descubre nuestra gran variedad de macetas y cerámicas.",
    },
    {
      image: "/hero3.jpg",
      title: "Servicios de Jardinería Profesional",
      description: "Diseñamos, construimos y mantenemos el jardín de tus sueños con un equipo experto y maquinaria moderna.",
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
      text: "Gran variedad de plantas de interior y exterior, flores, hierbas y todo tipo de macetas y decoración de jardines. Buen servicio y muy amables.",
      stars: 5,
    },
    {
      name: "Monika Aloka",
      text: "Excelente selección y personal muy servicial y amable. Siempre salgo muy contenta de este vivero.",
      stars: 5,
    },
    {
      name: "Dholdings",
      text: "Excelente personal, de lo más útil e informativo. Te asesoran a la perfección en la elección de plantas.",
      stars: 5,
    },
    {
      name: "Brian Hurley",
      text: "Excelente calidad de productos en el centro de jardinería. Variedad inmejorable en toda la zona de Marbella.",
      stars: 5,
    },
    {
      name: "Paul Wilcox",
      text: "Siempre es mi centro de jardinería 'ir'. El asesoramiento profesional es excelente y el trato impecable.",
      stars: 5,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
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
                  <span className="text-brand font-bold text-xs sm:text-sm uppercase tracking-widest bg-brand/10 text-brand px-3 py-1.5 rounded-full w-fit">
                    Vivero Familiar desde 1989
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-zinc-200 font-light leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <Link
                      href="/contacto"
                      className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand/20 active:scale-95 text-center sm:w-auto w-full"
                    >
                      Solicitar Información
                    </Link>
                    <Link
                      href="/sobre-nosotros"
                      className="border-2 border-white hover:bg-white hover:text-zinc-950 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 active:scale-95 text-center sm:w-auto w-full"
                    >
                      Saber Más
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
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-950/40 hover:bg-brand/90 hover:scale-105 text-white p-2.5 sm:p-3 rounded-full transition-all duration-300 z-30"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-950/40 hover:bg-brand/90 hover:scale-105 text-white p-2.5 sm:p-3 rounded-full transition-all duration-300 z-30"
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
              className={`h-2 rounded-full transition-all duration-300 ${
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
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Biochar</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Utilizamos y aconsejamos abonos y enmiendas orgánicas enriquecidas con carbón vegetal activo para mejorar la estructura del suelo y asegurar un óptimo desarrollo radicular.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glassmorphism rounded-2xl p-8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Droplet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Microalgas</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Incorporamos bioestimulantes biológicos avanzados de microalgas que aumentan las defensas naturales de las plantas, potencian la floración y promueven la sostenibilidad.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glassmorphism rounded-2xl p-8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Transporte Propio</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Disponemos de vehículos equipados y personal cualificado para realizar la entrega de tus plantas y cerámicas a domicilio de forma rápida y segura en toda la Costa del Sol.
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
                Sobre Nosotros
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
                Garden Center Linda Vista es un vivero fundado en 1989 en San Pedro Alcántara
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
                Como empresa familiar ubicada en el corazón de la Costa del Sol, conocemos de primera mano las necesidades del cliente nacional y extranjero. Ofrecemos un servicio de atención agradable, comunicativo y experto para garantizar el éxito de tu jardín.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
                A solo 3 minutos de Puerto Banús y 10 minutos de Marbella, disponemos de la mayor selección de maceterías y cerámicas de la costa, así como ofertas especiales de temporada y plantas frescas cada semana.
              </p>
              <div className="pt-2">
                <Link
                  href="/sobre-nosotros"
                  className="inline-flex items-center gap-2 text-brand hover:text-brand-dark font-semibold text-base transition-colors group"
                >
                  Conoce más sobre nuestra historia
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
              Nuestros Servicios
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              ¿Qué ofrecemos en Linda Vista?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Descubre las cuatro áreas principales que nos definen y los productos que tenemos disponibles para transformar tus espacios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-8 flex flex-col gap-6 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Jardinería</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Realizamos diseño, construcción y mantenimiento integral de jardines públicos y privados, optimizando el riego y adaptándonos al clima.
                </p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-8 flex flex-col gap-6 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Flower2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Plantas</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Gran variedad de plantas de interior, exterior, árboles ejemplares, arbustos y flores de temporada. Abastecimiento semanal.
                </p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-8 flex flex-col gap-6 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Decoración</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  La mayor selección de la costa de alfarería y macetas de todo tipo (cerámica, barro, resina) y complementos decorativos de jardín.
                </p>
              </div>
            </div>

            {/* Service 4 */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-8 flex flex-col gap-6 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Armchair className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Muebles</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Mobiliario exclusivo de exterior y complementos confortables diseñados para resistir las condiciones climáticas del Mediterráneo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Timetable & Callback CTA Section */}
      <section className="relative py-28 bg-brand text-white overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-light/35 via-brand/10 to-brand-dark/20 z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                ¿Necesitas asesoramiento profesional para tu jardín?
              </h2>
              <p className="text-brand-light text-zinc-100 font-light text-base leading-relaxed">
                Llámanos directamente o ven a visitarnos en San Pedro Alcántara. Nuestro equipo de profesionales estará encantado de ayudarte a elegir las mejores plantas y diseños para tus espacios exteriores e interiores.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <a
                  href="tel:952785206"
                  className="bg-zinc-950 hover:bg-zinc-900 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-xl active:scale-95 text-center"
                >
                  Llamar: 952 78 52 06
                </a>
                <Link
                  href="/contacto"
                  className="border-2 border-white hover:bg-white hover:text-brand text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 active:scale-95 text-center"
                >
                  Enviar Mensaje
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col gap-6 shadow-xl">
              <h3 className="text-xl font-bold text-white tracking-wide border-b border-white/20 pb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-light" />
                Horarios de Apertura
              </h3>
              <div className="flex flex-col gap-4 text-zinc-100">
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-white">Lunes a Viernes</span>
                  <span>08:30 - 14:00 / 16:00 - 20:00</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/10 pt-4">
                  <span className="font-medium text-white">Sábados</span>
                  <span>10:00 - 14:00</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-white/10 pt-4">
                  <span className="font-medium text-white">Domingos</span>
                  <span className="text-brand-light font-medium bg-zinc-950/20 px-3 py-1 rounded-full text-xs">Cerrado</span>
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
              Opiniones de Clientes
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Lo que opinan de nosotros
            </h2>
          </div>

          <div className="relative glassmorphism dark:bg-zinc-900/60 rounded-3xl p-10 md:p-14 shadow-xl flex flex-col gap-6 min-h-[300px] justify-center transition-all duration-300">
            {/* Quote Icon */}
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
                    Cliente Satisfecho
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
                className={`h-2.5 rounded-full transition-all duration-300 ${
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
