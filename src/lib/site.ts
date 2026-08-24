/**
 * Single source of truth for identity + SEO surface.
 * Domain: corvus-tech.co (GoDaddy). Contact mailbox confirmed by owner 2026-08-24.
 */
export const SITE = {
  name: "Corvus Tech",
  legalName: "Corvus Tech",
  url: "https://corvus-tech.co",
  // Kurumsal kutu (CEO 2026-08-24). Ekranda görünür + JSON-LD'de yayınlanır.
  email: "corvustech.co@outlook.com",
  linkedin: "https://tr.linkedin.com/in/corvus-tech-a32741352",
  linkedinLabel: "linkedin.com/in/corvus-tech",
  city: "Istanbul",
  country: "TR",
  founded: "2025",
  description: {
    en: "Product studio building iOS apps, web platforms, trading systems and AI agent infrastructure — designed, engineered and shipped in one place.",
    tr: "iOS uygulamaları, web platformları, trading sistemleri ve AI ajan altyapıları kuran ürün stüdyosu — tasarım, mühendislik ve yayın tek yerde.",
  },
} as const;
