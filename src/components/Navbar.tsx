"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Sobre Nosotros", href: "/sobre-nosotros" },
    { name: "Plantas", href: "/plantas" },
    { name: "Galería", href: "/galeria" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="w-full flex flex-col z-50">
      {/* Top Banner Contact bar (Hidden on mobile) */}
      <div className="bg-zinc-900 text-zinc-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-zinc-800 transition-all duration-300 md:block hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-brand transition-colors">
              <Phone className="w-3.5 h-3.5 text-brand" />
              <a href="tel:952785206">952 78 52 06</a>
            </span>
            <span className="flex items-center gap-1.5 hover:text-brand transition-colors">
              <Mail className="w-3.5 h-3.5 text-brand" />
              <a href="mailto:ventas@gardencenterlindavista.com">ventas@gardencenterlindavista.com</a>
            </span>
            <span className="flex items-center gap-1.5 hover:text-brand transition-colors">
              <MapPin className="w-3.5 h-3.5 text-brand" />
              <a href="https://maps.google.com/?q=Calle+Araucaria+10,+San+Pedro+Alcántara" target="_blank" rel="noopener noreferrer">
                Calle Araucaria 10, San Pedro Alcántara
              </a>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand" />
            <span>Lun - Vie: 8:30-14:00, 16:00-20:00 | Sáb: 10:00-14:00</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "fixed top-0 left-0 bg-white/95 dark:bg-zinc-950/95 shadow-md backdrop-blur-md py-3"
            : "relative bg-white dark:bg-zinc-950 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-12 w-36 sm:h-14 sm:w-44 transition-transform duration-300 group-hover:scale-102">
              <Image
                src="/logo-garden.png"
                alt="Garden Center Linda Vista Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6 items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-sm font-medium tracking-wide transition-colors py-1.5 ${
                      isActive
                        ? "text-brand"
                        : "text-zinc-600 hover:text-brand dark:text-zinc-300 dark:hover:text-brand"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-full animate-fade-in" />
                    )}
                  </Link>
                );
              })}
            </div>
            <Link
              href="/contacto"
              className="bg-brand hover:bg-brand-dark text-white font-medium text-sm px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand/20 active:scale-95"
            >
              Contactar
            </Link>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-700 hover:text-brand dark:text-zinc-300 dark:hover:text-brand p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden fixed inset-x-0 top-[60px] bg-white dark:bg-zinc-950 shadow-xl border-t border-zinc-100 dark:border-zinc-800 py-4 px-6 flex flex-col gap-4 animate-slide-up z-50">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-semibold transition-colors py-2 px-3 rounded-lg ${
                    isActive
                      ? "text-brand bg-brand/10"
                      : "text-zinc-700 hover:text-brand dark:text-zinc-300 dark:hover:text-brand hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/contacto"
              onClick={() => setIsOpen(false)}
              className="bg-brand hover:bg-brand-dark text-white font-medium text-center py-3 rounded-xl transition-colors mt-2"
            >
              Contactar
            </Link>
          </div>
        )}
      </nav>
      {/* Spacer to push content down when navbar is fixed */}
      {scrolled && <div className="h-[72px] md:h-[110px]" />}
    </header>
  );
}
