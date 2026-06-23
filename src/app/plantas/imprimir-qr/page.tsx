"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Printer, Info, Sparkles } from "lucide-react";
import { plants } from "@/data/plants";

export default function ImprimirQrPage() {
  const [origin, setOrigin] = useState("https://gardencenterlindavista.solarrv.tech");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950/20 py-8 print:bg-white print:py-0">
      {/* Container for controls (Hidden during print) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8 print:hidden flex flex-col gap-6">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
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
              <li className="text-zinc-800 dark:text-zinc-300 font-semibold" aria-current="page">
                Imprimir QR
              </li>
            </ol>
          </nav>
        </div>

        {/* Action Header Card */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-brand font-bold text-xs uppercase tracking-widest bg-brand/10 text-brand px-3.5 py-1.5 rounded-full w-fit flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Panel de Impresión
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Generador de Planilla de Etiquetas QR
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
              Esta página organiza automáticamente las 20 plantas del catálogo en etiquetas individuales recortables. Haz clic en "Imprimir Etiquetas" y selecciona tu impresora o guarda como PDF.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-md shadow-brand/10 hover:shadow-lg active:scale-97 cursor-pointer w-full md:w-auto"
          >
            <Printer className="w-5 h-5" />
            Imprimir Etiquetas
          </button>
        </div>

        {/* Tip banner */}
        <div className="bg-blue-50/40 dark:bg-blue-950/10 border border-blue-150/40 dark:border-blue-900/30 rounded-2xl p-5 flex items-start gap-3 text-zinc-650 dark:text-zinc-400 text-xs leading-relaxed font-light">
          <Info className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">Consejo de Impresión:</span> En los ajustes de la ventana de impresión de tu navegador, asegúrate de activar la casilla de <strong>"Gráficos de fondo"</strong> (Background graphics) y configurar los márgenes como <strong>"Ninguno"</strong> o <strong>"Predeterminado"</strong> para que las etiquetas se organicen de forma compacta en hojas de papel A4.
          </div>
        </div>
      </div>

      {/* Grid containing all 20 plant labels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full print:px-0 print:mx-0 print:max-w-none">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 print:grid-cols-4 print:gap-4 print:p-0">
          {plants.map((plant) => (
            <div
              key={plant.slug}
              className="bg-white dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-xs print:shadow-none print:border-zinc-300 print:rounded-2xl print:page-break-inside-avoid print:bg-white min-h-[260px]"
            >
              {/* Branding text */}
              <div className="flex flex-col gap-0.5 mb-3 leading-none">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold font-sans">Garden Center</span>
                <span className="text-xs uppercase tracking-widest text-brand font-extrabold font-sans">Linda Vista</span>
              </div>

              {/* QR Code image (rendered dynamically from the API matching the current domain) */}
              <div className="bg-white p-2 rounded-xl border border-zinc-100 shrink-0 mb-3 shadow-xxs print:shadow-none print:border-zinc-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${origin}/plantas/${plant.slug}`)}`}
                  alt={`QR ${plant.name}`}
                  width={110}
                  height={110}
                  className="w-24 h-24 sm:w-28 sm:h-28 print:w-24 print:h-24 object-contain"
                />
              </div>

              {/* Plant names */}
              <div className="flex flex-col gap-0.5 max-w-[130px] sm:max-w-none">
                <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                  {plant.name.split(" (")[0]}
                </h3>
                <span className="text-[10px] italic text-brand font-medium truncate font-sans">
                  {plant.scientificName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
