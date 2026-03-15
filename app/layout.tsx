import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast/ToastContext";
import { GlobalLoader } from "@/components/ui/GlobalLoader/GlobalLoader";
import { BrowserWarning } from "@/components/ui/BrowserWarning/BrowserWarning";
import "./globals.css";

/**
 * Inter - fuente sans-serif moderna y legible (Requisito 15.1, 15.10)
 * Cargada via next/font para optimización automática (sin FOUT/FOIT)
 * La variable CSS --font-inter se usa en typography.css como --font-family-sans
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WhatsApp Manager - Panel de Control",
  description: "Gestiona tus sesiones de WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <a href="#main-content" className="skip-to-content">
          Saltar al contenido principal
        </a>
        <BrowserWarning />
        <GlobalLoader />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
