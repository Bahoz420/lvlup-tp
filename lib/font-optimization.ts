import type { NextFontWithVariable } from "next/dist/compiled/@next/font"
import { Inter, Roboto_Mono } from "next/font/google"

// Primäre Schriftart mit Untergruppen für bessere Performance
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
})

// Monospace-Schriftart für Code und technische Inhalte
export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  preload: true,
  fallback: ["monospace"],
})

// Hilfsfunktion zum Kombinieren von Schriftartvariablen
export function combineFontVariables(...fonts: NextFontWithVariable[]): string {
  return fonts.map((font) => font.variable).join(" ")
}
