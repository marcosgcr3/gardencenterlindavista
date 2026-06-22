import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function Contacto() {
  const contactCards = [
    {
      icon: <MapPin className="w-6 h-6 text-brand" />,
      title: "Dirección",
      details: [
        "Calle Araucaria 10",
        "29670 San Pedro Alcántara",
        "Marbella, Málaga, España",
      ],
      link: "https://maps.google.com/?q=Calle+Araucaria+10,+San+Pedro+Alcántara",
      linkText: "Ver en Google Maps",
    },
    {
      icon: <Phone className="w-6 h-6 text-brand" />,
      title: "Teléfono",
      details: ["952 78 52 06"],
      link: "tel:952785206",
      linkText: "Llamar ahora",
    },
    {
      icon: <Mail className="w-6 h-6 text-brand" />,
      title: "Email de Contacto",
      details: [
        "ventas@gardencenterlindavista.com",
        "administracion@gardencenterlindavista.com",
      ],
      link: "mailto:ventas@gardencenterlindavista.com",
      linkText: "Enviar email",
    },
    {
      icon: <Clock className="w-6 h-6 text-brand" />,
      title: "Horario comercial",
      details: [
        "Lunes - Viernes: 08:30-14:00 / 16:00-20:00",
        "Sábados: 10:00 - 14:00",
        "Domingos: Cerrado",
      ],
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Header Banner */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <Image
          src="/hero1.jpg"
          alt="CONTACTO"
          fill
          className="object-cover"
          priority
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 flex flex-col gap-4 animate-slide-up">
          <span className="text-brand font-bold text-sm uppercase tracking-widest">
            Estamos para ayudarte
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Contacto
          </h1>
          <p className="text-zinc-200 text-lg max-w-xl font-light">
            ¿Tienes alguna consulta o necesitas presupuesto? Escríbenos o ven a visitarnos en San Pedro Alcántara.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Form & Details Grid */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Cards and hours details */}
            <div className="lg:col-span-6 flex flex-col gap-8 w-full">
              <div className="flex flex-col gap-2">
                <span className="text-brand font-semibold text-sm uppercase tracking-wider">
                  Información
                </span>
                <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Nuestros Datos de Contacto
                </h2>
                <p className="text-zinc-500 mt-2 leading-relaxed">
                  Estaremos encantados de atenderte por cualquiera de estas vías. Si deseas visitarnos, disponemos de zona de carga de plantas para tu comodidad.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                {contactCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                      {card.icon}
                    </div>
                    <div className="flex flex-col gap-1.5 flex-grow">
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base">{card.title}</h3>
                      <div className="flex flex-col text-sm text-zinc-500 dark:text-zinc-400 gap-0.5 leading-6">
                        {card.details.map((detail, index) => (
                          <span key={index}>{detail}</span>
                        ))}
                      </div>
                    </div>
                    {card.link && (
                      <a
                        href={card.link}
                        target={card.link.startsWith("http") ? "_blank" : undefined}
                        rel={card.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-xs text-brand hover:text-brand-dark font-bold tracking-wide uppercase mt-1 border-t border-zinc-200/55 dark:border-zinc-800 pt-3"
                      >
                        {card.linkText}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form side */}
            <div className="lg:col-span-6 w-full">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* 3. Embedded Google Maps Iframe */}
      <section className="w-full h-[500px] relative bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-900">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1907.5323942711286!2d-4.99649123988893!3d36.479921369558205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd73298a5bf33e2b%3A0x7c93bac2ca9622c6!2sGarden%20Center%20Linda%20Vista%20S.L.!5e0!3m2!1ses!2ses!4v1621503010199!5m2!1ses!2ses"
          className="absolute inset-0 w-full h-full border-0 filter grayscale dark:invert-[0.9] dark:hue-rotate-180"
          allowFullScreen
          loading="lazy"
          title="Ubicación de Garden Center Linda Vista en Google Maps"
        />
      </section>
    </div>
  );
}
