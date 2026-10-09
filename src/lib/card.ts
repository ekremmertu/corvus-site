import { SITE } from "@/lib/site";

/**
 * Kartvizit kimliği — basılı kartın QR'ı /[lang]/kart sayfasına gelir.
 * Telefon numarası repoda DURMAZ: build sırasında `CARD_PHONE` ortam
 * değişkeninden okunur (Vercel env + lokal `.env.local`). Boşsa telefon
 * satırı ve WhatsApp/Ara düğmeleri hiç gösterilmez.
 */
const phone = (process.env.CARD_PHONE ?? "").trim();

export const CARD = {
  firstName: "Ekrem Mert",
  lastName: "UĞUR",
  fullName: "Ekrem Mert UĞUR",
  title: "Co-Founder",
  org: SITE.name,
  phone,
  phoneDigits: phone.replace(/\D/g, ""),
  email: SITE.email,
  site: SITE.url,
  linkedin: SITE.linkedin,
  city: "İstanbul, Türkiye",
} as const;

export function buildVCard(): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${CARD.lastName};${CARD.firstName};;;`,
    `FN:${CARD.fullName}`,
    `ORG:${CARD.org}`,
    `TITLE:${CARD.title}`,
    CARD.phone ? `TEL;TYPE=CELL,VOICE:${CARD.phone}` : null,
    `EMAIL;TYPE=WORK:${CARD.email}`,
    `URL:${CARD.site}`,
    `URL;TYPE=LinkedIn:${CARD.linkedin}`,
    `ADR;TYPE=WORK:;;;${SITE.city};;;${SITE.country}`,
    "END:VCARD",
  ].filter((l): l is string => l !== null);
  // vCard satır sonu standardı CRLF
  return lines.join("\r\n") + "\r\n";
}
