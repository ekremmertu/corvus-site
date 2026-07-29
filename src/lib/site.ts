/**
 * Single source of truth for identity + SEO surface.
 * TODO(owner): confirm domain and public contact address before launch.
 */
export const SITE = {
  name: "Corvus Tech",
  legalName: "Corvus Tech",
  url: "https://corvustech.co",
  email: "hello@corvustech.co",
  city: "Istanbul",
  country: "TR",
  founded: "2025",
  description: {
    en: "Product studio building iOS apps, web platforms, trading systems and AI agent infrastructure — designed, engineered and shipped in one place.",
    tr: "iOS uygulamaları, web platformları, trading sistemleri ve AI ajan altyapıları kuran ürün stüdyosu — tasarım, mühendislik ve yayın tek yerde.",
  },
} as const;
