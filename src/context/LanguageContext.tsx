"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navbar
    "nav.home": "Inicio",
    "nav.about": "Sobre Nosotros",
    "nav.gallery": "Galería",
    "nav.contact": "Contacto",
    "nav.contactBtn": "Contactar",
    "contact.banner": "Lun - Vie: 8:30-14:00, 16:00-20:00 | Sáb: 10:00-14:00",

    // Footer
    "footer.desc": "Tu vivero y centro de jardinería de confianza en San Pedro Alcántara, Marbella. Variedad de plantas de interior, exterior, alfarería y decoración para el hogar.",
    "footer.title.links": "Enlaces Rápidos",
    "footer.title.contact": "Contacto",
    "footer.title.hours": "Horario",
    "footer.rights": "Todos los derechos reservados.",

    // General terms
    "days.mon-fri": "Lunes a Viernes",
    "days.sat": "Sábados",
    "days.sun": "Domingos",
    "status.closed": "Cerrado",

    // Home Page
    "home.badge": "Vivero Familiar desde 1989",
    "home.slide1.title": "Bienvenido a Garden Center Linda Vista",
    "home.slide1.desc": "Tu vivero de confianza en la Costa del Sol desde 1989. Selección única de plantas, decoración y servicios de jardinería.",
    "home.slide2.title": "El vivero de referencia en Marbella",
    "home.slide2.desc": "Situados en San Pedro Alcántara, a escasos minutos de Puerto Banús. Descubre nuestra gran variedad de macetas y cerámicas.",
    "home.slide3.title": "Servicios de Jardinería Profesional",
    "home.slide3.desc": "Diseñamos, construimos y mantenemos el jardín de tus sueños con un equipo experto y maquinaria moderna.",
    "home.btn.info": "Solicitar Información",
    "home.btn.more": "Saber Más",
    
    "home.features.title1": "Biochar",
    "home.features.desc1": "Utilizamos y aconsejamos abonos y enmiendas orgánicas enriquecidas con carbón vegetal activo para mejorar la estructura del suelo.",
    "home.features.title2": "Microalgas",
    "home.features.desc2": "Incorporamos bioestimulantes biológicos avanzados de microalgas que aumentan las defensas naturales de las plantas y la sostenibilidad.",
    "home.features.title3": "Transporte Propio",
    "home.features.desc3": "Disponemos de vehículos equipados y personal cualificado para realizar la entrega de tus plantas y cerámicas a domicilio.",
    
    "home.about.badge": "Sobre Nosotros",
    "home.about.title": "Garden Center Linda Vista es un vivero fundado en 1989 en San Pedro Alcántara",
    "home.about.desc1": "Como empresa familiar ubicada en el corazón de la Costa del Sol, conocemos de primera mano las necesidades del cliente nacional y extranjero. Ofrecemos un servicio de atención agradable, comunicativo y experto para garantizar el éxito de tu jardín.",
    "home.about.desc2": "A solo 3 minutos de Puerto Banús y 10 minutos de Marbella, disponemos de la mayor selección de maceterías y cerámicas de la costa, así como ofertas especiales de temporada.",
    "home.about.link": "Conoce más sobre nuestra historia",
    
    "home.services.badge": "Nuestros Servicios",
    "home.services.title": "¿Qué ofrecemos en Linda Vista?",
    "home.services.desc": "Descubre las cuatro áreas principales que nos definen y los productos que tenemos disponibles para transformar tus espacios.",
    
    "home.services.s1.title": "Jardinería",
    "home.services.s1.desc": "Realizamos diseño, construcción y mantenimiento integral de jardines públicos y privados, optimizando el riego.",
    "home.services.s2.title": "Plantas",
    "home.services.s2.desc": "Gran variedad de plantas de interior, exterior, árboles ejemplares, arbustos y flores de temporada. Abastecimiento semanal.",
    "home.services.s3.title": "Decoración",
    "home.services.s3.desc": "La mayor selección de la costa de alfarería y macetas de todo tipo (cerámica, barro, resina) y complementos decorativos.",
    "home.services.s4.title": "Muebles",
    "home.services.s4.desc": "Mobiliario exclusivo de exterior y complementos confortables diseñados para resistir las condiciones del Mediterráneo.",
    
    "home.cta.title": "¿Necesitas asesoramiento profesional para tu jardín?",
    "home.cta.desc": "Llámanos directamente o ven a visitarnos en San Pedro Alcántara. Nuestro equipo de profesionales estará encantado de ayudarte.",
    "home.cta.btn.call": "Llamar: 952 78 52 06",
    "home.cta.btn.msg": "Enviar Mensaje",
    "home.cta.hours.title": "Horarios de Apertura",
    
    "home.reviews.badge": "Opiniones de Clientes",
    "home.reviews.title": "Lo que opinan de nosotros",
    "home.reviews.subtitle": "Cliente Satisfecho",
    
    // Reviews
    "review.1": "Gran variedad de plantas de interior y exterior, flores, hierbas y todo tipo de macetas y decoración de jardines. Buen servicio y muy amables.",
    "review.2": "Excelente selección y personal muy servicial y amable. Siempre salgo muy contenta de este vivero.",
    "review.3": "Excelente personal, de lo más útil e informativo. Te asesoran a la perfección en la elección de plantas.",
    "review.4": "Excelente calidad de productos en el centro de jardinería. Variedad inmejorable en toda la zona de Marbella.",
    "review.5": "Siempre es mi centro de jardinería 'ir'. El asesoramiento profesional es excelente y el trato impecable."
  },
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "nav.contactBtn": "Contact Us",
    "contact.banner": "Mon - Fri: 8:30-14:00, 16:00-20:00 | Sat: 10:00-14:00",

    // Footer
    "footer.desc": "Your trusted nursery and garden center in San Pedro Alcántara, Marbella. Wide variety of indoor and outdoor plants, pottery, and home decoration.",
    "footer.title.links": "Quick Links",
    "footer.title.contact": "Contact",
    "footer.title.hours": "Working Hours",
    "footer.rights": "All rights reserved.",

    // General terms
    "days.mon-fri": "Monday to Friday",
    "days.sat": "Saturdays",
    "days.sun": "Sundays",
    "status.closed": "Closed",

    // Home Page
    "home.badge": "Family Nursery since 1989",
    "home.slide1.title": "Welcome to Garden Center Linda Vista",
    "home.slide1.desc": "Your trusted nursery on the Costa del Sol since 1989. Unique selection of plants, decoration and gardening services.",
    "home.slide2.title": "The reference nursery in Marbella",
    "home.slide2.desc": "Located in San Pedro Alcántara, just minutes from Puerto Banús. Discover our large variety of pots and ceramics.",
    "home.slide3.title": "Professional Gardening Services",
    "home.slide3.desc": "We design, build and maintain the garden of your dreams with an expert team and modern machinery.",
    "home.btn.info": "Request Info",
    "home.btn.more": "Learn More",
    
    "home.features.title1": "Biochar",
    "home.features.desc1": "We use and advise organic fertilizers and amendments enriched with active charcoal to improve soil structure.",
    "home.features.title2": "Microalgae",
    "home.features.desc2": "We incorporate advanced organic microalgae biostimulants that boost natural plant defenses and sustainability.",
    "home.features.title3": "Own Transport",
    "home.features.desc3": "We have equipped vehicles and qualified staff to deliver your plants and pottery directly to your home.",
    
    "home.about.badge": "About Us",
    "home.about.title": "Garden Center Linda Vista is a nursery founded in 1989 in San Pedro Alcántara",
    "home.about.desc1": "As a family business in the heart of the Costa del Sol, we know the needs of local and international clients first-hand. We offer a friendly, communicative, and expert service to ensure your garden's success.",
    "home.about.desc2": "Just 3 minutes from Puerto Banús and 10 minutes from Marbella, we offer the largest selection of pottery and ceramics on the coast, along with special seasonal deals.",
    "home.about.link": "Learn more about our history",
    
    "home.services.badge": "Our Services",
    "home.services.title": "What do we offer at Linda Vista?",
    "home.services.desc": "Discover the four main areas that define us and the products we have available to transform your spaces.",
    
    "home.services.s1.title": "Gardening",
    "home.services.s1.desc": "We carry out comprehensive design, construction, and maintenance of public and private gardens, optimizing irrigation.",
    "home.services.s2.title": "Plants",
    "home.services.s2.desc": "Wide variety of indoor and outdoor plants, specimen trees, shrubs, and seasonal flowers. Weekly supply.",
    "home.services.s3.title": "Decoration",
    "home.services.s3.desc": "The largest selection of pottery and pots of all types (ceramic, clay, resin) and decorative accessories on the coast.",
    "home.services.s4.title": "Furniture",
    "home.services.s4.desc": "Exclusive outdoor furniture and comfortable accessories designed to withstand Mediterranean weather conditions.",
    
    "home.cta.title": "Need professional advice for your garden?",
    "home.cta.desc": "Call us directly or visit us in San Pedro Alcántara. Our team of professionals will be happy to help you.",
    "home.cta.btn.call": "Call: 952 78 52 06",
    "home.cta.btn.msg": "Send Message",
    "home.cta.hours.title": "Opening Hours",
    
    "home.reviews.badge": "Customer Reviews",
    "home.reviews.title": "What they say about us",
    "home.reviews.subtitle": "Satisfied Customer",
    
    // Reviews
    "review.1": "Great variety of indoor and outdoor plants, flowers, herbs and all kinds of pots and garden decoration. Good service and very friendly.",
    "review.2": "Excellent selection and very helpful and friendly staff. I always leave this nursery very happy.",
    "review.3": "Excellent staff, extremely helpful and informative. They advise you perfectly in the choice of plants.",
    "review.4": "Excellent quality products in the garden center. Unbeatable variety in the entire Marbella area.",
    "review.5": "Always my go-to garden center. Professional advice is excellent and service is impeccable."
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const savedLang = localStorage.getItem("gclv_lang") as Language;
    if (savedLang === "es" || savedLang === "en") {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "en" || browserLang === "es") {
        setLanguageState(browserLang as Language);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("gclv_lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
