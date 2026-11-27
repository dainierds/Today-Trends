import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Today Trends · Monitor de Series y Películas en Streaming",
  description:
    "Tendencias, más vistas y mejor valoradas de Netflix, Amazon Prime Video, Max, Disney+, Paramount+, Peacock y Apple TV+. Listo para Web y Fire TV.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#0b0b0f] text-white selection:bg-[#e50914] selection:text-white">
        {children}
      </body>
    </html>
  );
}
