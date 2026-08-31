import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * GEO (Generative Engine Optimization) — yapay zekâ arama motorları.
 *
 * Neden botlar ADIYLA yazılı: `User-agent: *` altındaki izin ÖRTÜK izindir.
 * Bazı AI tarayıcıları kendi adlarına yazılmış bir kural aramadan içeriği
 * alıntılamamayı tercih eder. Adıyla izin = açık davet.
 *
 * Buradaki botların hepsi okuma amaçlıdır; hiçbiri siteye yazma yapamaz.
 */
const AI_CRAWLERS = [
  "GPTBot",           // OpenAI — model eğitimi + arama dizini
  "OAI-SearchBot",    // ChatGPT arama sonuçları
  "ChatGPT-User",     // kullanıcı bir soru sorduğunda canlı getirme
  "ClaudeBot",        // Anthropic
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",  // Google AI Overviews / Gemini
  "Applebot-Extended",
  "CCBot",            // Common Crawl — çoğu açık modelin kaynağı
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
