import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Sun,
  Droplet,
  Thermometer,
  Wind,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sprout,
  Heart,
  CalendarDays
} from "lucide-react";
import { plants, Plant } from "@/data/plants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return plants.map((plant) => ({
    slug: plant.slug,
  }));
}

export default async function PlantaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const plant = plants.find((p) => p.slug === slug);

  if (!plant) {
    notFound();
  }

  const getDifficultyColor = (difficulty: Plant["difficulty"]) => {
    switch (difficulty) {
      case "Bajo":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30";
      case "Medio":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30";
      case "Alto":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30";
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-zinc-50/40 dark:bg-zinc-950/20 py-8">
      {/* 1. Navigation & Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        {/* Back Link & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/plantas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-brand dark:text-zinc-400 dark:hover:text-brand transition-colors bg-white dark:bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-150 dark:border-zinc-900 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al Catálogo
          </Link>

          <nav className="text-zinc-500 text-xs sm:text-sm font-medium" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-brand transition-colors">
                  Inicio
                </Link>
              </li>
              <li className="text-zinc-400 select-none">/</li>
              <li>
                <Link href="/plantas" className="hover:text-brand transition-colors">
                  Catálogo
                </Link>
              </li>
              <li className="text-zinc-400 select-none">/</li>
              <li className="text-zinc-800 dark:text-zinc-300 font-semibold truncate max-w-[150px] sm:max-w-none" aria-current="page">
                {plant.name}
              </li>
            </ol>
          </nav>
        </div>

        {/* 2. Main Plant Card Split (Two Columns, No banner image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          {/* Left Column: Visual Container */}
          <div className="lg:col-span-5 w-full flex flex-col gap-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden border-8 border-white dark:border-zinc-900 shadow-xl bg-white dark:bg-zinc-950 group">
              <Image
                src={plant.imageUrl}
                alt={plant.name}
                fill
                priority
                sizes="(max-w-768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-102"
              />
              
              {/* Floating Badge category */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-white/95 dark:bg-zinc-950/95 text-zinc-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-sm border border-zinc-200/10">
                  {plant.category}
                </span>
              </div>
            </div>

            {/* Quick Micro-Stats card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-2xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Garantía Linda Vista</h4>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                  Todas nuestras plantas son seleccionadas directamente por expertos y pasan controles periódicos de salud vegetal antes de la entrega.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Identity & Core specs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <span className="italic text-brand font-semibold text-sm sm:text-base uppercase tracking-wider block">
                {plant.scientificName}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-2 leading-tight">
                {plant.name}
              </h1>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
              {plant.description}
            </p>

            <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light requirement */}
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xxs uppercase font-bold text-zinc-400 tracking-wider">Iluminación</span>
                  <span className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{plant.light}</span>
                </div>
              </div>

              {/* Water requirement */}
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center shrink-0">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xxs uppercase font-bold text-zinc-400 tracking-wider">Riego General</span>
                  <span className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{plant.watering.general}</span>
                </div>
              </div>

              {/* Temperature requirement */}
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center shrink-0">
                  <Thermometer className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xxs uppercase font-bold text-zinc-400 tracking-wider">Temperatura</span>
                  <span className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{plant.temperature}</span>
                </div>
              </div>

              {/* Humidity requirement */}
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center shrink-0">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xxs uppercase font-bold text-zinc-400 tracking-wider">Humedad</span>
                  <span className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{plant.humidity}</span>
                </div>
              </div>
            </div>

            {/* Difficulty Bar */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-xxs uppercase font-bold text-zinc-400 tracking-wider">Nivel de Cuidado</span>
                <span className="text-sm font-light text-zinc-600 dark:text-zinc-400">Atención necesaria para la planta</span>
              </div>
              <span className={`text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-xl border ${getDifficultyColor(plant.difficulty)}`}>
                Dificultad: {plant.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-zinc-200/60 dark:bg-zinc-900 mb-12" />

        {/* 3. Detailed Data Cards (Care, Watering, Diseases) */}
        <div className="flex flex-col gap-8 mb-20">
          
          {/* Card 1: Cuidados y Características */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">Cuidados y Características</h2>
              <p className="text-zinc-500 text-sm font-light leading-relaxed">
                Recomendaciones generales para mantener tu planta vigorosa y una descripción de sus rasgos físicos principales.
              </p>
            </div>
            
            <div className="md:w-2/3 flex flex-col gap-6">
              <div className="bg-zinc-50/50 dark:bg-zinc-900/35 border border-zinc-100 dark:border-zinc-900/60 rounded-2xl p-6">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand" />
                  Guía de Mantenimiento
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
                  {plant.care}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base mb-3 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-brand" />
                  Rasgos Distintivos
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-light">
                  {plant.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start gap-2 bg-zinc-50/30 dark:bg-zinc-900/10 p-3 rounded-xl border border-zinc-100/50 dark:border-zinc-900/30">
                      <span className="text-brand font-bold text-sm shrink-0 select-none">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Plan de Riego Estacional */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">Plan de Riego Estacional</h2>
              <p className="text-zinc-500 text-sm font-light leading-relaxed">
                El agua es vida, pero el exceso de agua es el error más común. Sigue esta pauta adaptada a las estaciones de la Costa del Sol.
              </p>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Summer watering */}
              <div className="bg-amber-50/20 dark:bg-amber-950/10 border border-amber-200/20 dark:border-amber-900/20 rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  Primavera - Verano
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                  Durante los meses cálidos de mayor crecimiento y evaporación, la pauta aproximada es:
                </p>
                <div className="bg-white/80 dark:bg-zinc-900/60 border border-amber-200/10 dark:border-amber-900/10 rounded-xl p-4 font-bold text-sm text-zinc-800 dark:text-zinc-200">
                  {plant.watering.summer}
                </div>
              </div>

              {/* Winter watering */}
              <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-200/20 dark:border-blue-900/20 rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  Otoño - Invierno
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                  En los meses fríos de descanso vegetativo y alta humedad ambiente, la pauta es:
                </p>
                <div className="bg-white/80 dark:bg-zinc-900/60 border border-blue-200/10 dark:border-blue-900/10 rounded-xl p-4 font-bold text-sm text-zinc-800 dark:text-zinc-200">
                  {plant.watering.winter}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Plagas, Enfermedades y Prevención */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">Plagas y Enfermedades</h2>
              <p className="text-zinc-500 text-sm font-light leading-relaxed">
                Identifica a tiempo los síntomas comunes y mantén a raya a los parásitos para salvar la vida de tu planta.
              </p>
            </div>

            <div className="md:w-2/3 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-200/10 dark:border-rose-900/10 rounded-2xl p-6 sm:p-8 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">Alerta de Plagas</h3>
                <p className="text-zinc-650 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
                  {plant.diseases}
                </p>
                <div className="bg-white/40 dark:bg-zinc-900/30 border border-rose-200/5 dark:border-rose-900/5 p-4 rounded-xl text-xs text-zinc-500 mt-2 leading-relaxed italic">
                  *Tip de Garden Center Linda Vista: Un tratamiento preventivo con Aceite de Neem e Jabón Potásico diluidos en agua cada 15 días mantendrá alejados a la mayoría de insectos chupadores de forma 100% ecológica.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
