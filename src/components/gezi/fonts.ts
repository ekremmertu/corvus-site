import { Gloock, Manrope } from "next/font/google";

/** /gezi ve /trips kök layout'larının ortak yazı aileleri (display + gövde; üçüncü aile yok). */
export const display = Gloock({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-display", display: "swap" });
export const body = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-body", display: "swap" });
