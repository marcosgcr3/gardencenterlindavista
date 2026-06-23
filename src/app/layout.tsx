import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Garden Center Linda Vista | Vivero y Jardinería en San Pedro Alcántara, Marbella",
  description: "Vivero y floristería familiar en San Pedro Alcántara (Marbella) desde 1989. Gran selección de plantas de interior y exterior, alfarería, decoración y servicios de jardinería profesional.",
  keywords: "vivero san pedro alcantara, vivero marbella, garden center marbella, plantas marbella, jardineria san pedro, floristeria san pedro alcantara, macetas marbella, decoracion jardin costa del sol",
  robots: "index, follow",
  openGraph: {
    title: "Garden Center Linda Vista | Vivero y Jardinería en Marbella",
    description: "Vivero familiar fundado en 1989 en San Pedro Alcántara. Plantas, alfarería, decoración y jardinería profesional.",
    url: "http://gardencenterlindavista.com",
    siteName: "Garden Center Linda Vista",
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7abf17",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50/50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200">
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow flex flex-col w-full">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
