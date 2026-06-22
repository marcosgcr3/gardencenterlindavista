"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Send, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    captchaInput: "",
  });

  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, sum: 0 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const generateCaptcha = useCallback(() => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ num1, num2, sum: num1 + num2 });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateCaptcha();
    }, 0);
    return () => clearTimeout(timer);
  }, [generateCaptcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Simple validations
    if (!formData.name.trim()) {
      setStatus("error");
      setErrorMessage("Por favor, introduce tu nombre.");
      return;
    }
    if (!formData.email.trim()) {
      setStatus("error");
      setErrorMessage("Por favor, introduce tu email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Por favor, introduce un email válido.");
      return;
    }
    if (!formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Por favor, escribe tu mensaje.");
      return;
    }
    if (parseInt(formData.captchaInput) !== captcha.sum) {
      setStatus("error");
      setErrorMessage("El resultado de la suma de seguridad es incorrecto.");
      return;
    }

    // Success State loading simulation
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "", captchaInput: "" });
      generateCaptcha();
    }, 1500);
  };

  return (
    <div className="w-full glassmorphism dark:bg-zinc-900/60 rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-100 dark:border-zinc-800">
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
        Envíanos un Mensaje
      </h3>

      {status === "success" ? (
        <div className="flex flex-col items-center justify-center text-center py-8 gap-4 animate-fade-in">
          <CheckCircle2 className="w-16 h-16 text-brand" />
          <h4 className="text-xl font-bold text-zinc-900 dark:text-white">¡Mensaje Enviado!</h4>
          <p className="text-zinc-500 text-sm max-w-sm leading-6">
            Muchas gracias por contactar con Garden Center Linda Vista. Responderemos a tu solicitud lo antes posible.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-2.5 rounded-full transition-colors active:scale-95 text-sm"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Status/Error alert */}
          {status === "error" && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm animate-slide-up">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              disabled={status === "loading"}
              className="w-full bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-200 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
            />
          </div>

          {/* Email input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: juan.perez@example.com"
              disabled={status === "loading"}
              className="w-full bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-200 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
            />
          </div>

          {/* Message input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Mensaje o Consulta
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Escribe aquí tu consulta..."
              disabled={status === "loading"}
              className="w-full bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-200 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all resize-none"
            />
          </div>

          {/* Captcha Verification */}
          <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200/55 dark:border-zinc-800 p-4 rounded-xl">
            <label htmlFor="captchaInput" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm flex items-center justify-between">
              <span>Suma de Seguridad (Captcha)</span>
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-zinc-400 hover:text-brand transition-colors p-1"
                title="Generar nueva suma"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </label>
            <div className="flex items-center gap-4 mt-1.5">
              <span className="bg-brand/10 text-brand font-bold px-4 py-2.5 rounded-lg border border-brand/20 select-none text-base tracking-wider shrink-0">
                {captcha.num1} + {captcha.num2} =
              </span>
              <input
                type="number"
                id="captchaInput"
                name="captchaInput"
                value={formData.captchaInput}
                onChange={handleChange}
                placeholder="Resultado"
                disabled={status === "loading"}
                className="w-full bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-200 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {status === "loading" ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Enviando mensaje...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Mensaje
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
