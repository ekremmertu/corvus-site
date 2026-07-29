/**
 * Single source of truth for identity + SEO surface.
 * Domain: corvus-tech.co (GoDaddy). TODO(owner): confirm the mailbox exists.
 */
export const SITE = {
  name: "Corvus Tech",
  legalName: "Corvus Tech",
  url: "https://corvus-tech.co",
  email: "hello@corvus-tech.co",
  city: "Istanbul",
  country: "TR",
  founded: "2025",
  description: {
    en: "Product studio building iOS apps, web platforms, trading systems and AI agent infrastructure — designed, engineered and shipped in one place.",
    tr: "iOS uygulamaları, web platformları, trading sistemleri ve AI ajan altyapıları kuran ürün stüdyosu — tasarım, mühendislik ve yayın tek yerde.",
  },
} as const;
