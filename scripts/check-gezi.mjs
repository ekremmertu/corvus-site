#!/usr/bin/env node
/**
 * Rotalar bekçisi — çalışan sunucudaki TÜM /tripwalkers/planlar + /tripwalkers/plans sayfalarını site haritasından gezer.
 * Denetler: 200 dönüyor mu · <html lang> adresle uyuşuyor mu · canonical kendisi mi · hreflang eşi karşılıklı mı ·
 * EN sayfada Türkçe arayüz sözü / TR sayfada İngilizce arayüz sözü kalmış mı · "undefined/NaN/[object" basılmış mı.
 * Koşum: npm run build && npx next start -p 3123  →  node scripts/check-gezi.mjs [http://localhost:3123]
 * Çıkış kodu: sorun varsa 1 (CI'da da kullanılabilir).
 */
const BASE = process.argv[2] ?? "http://localhost:3123";
const SITE = "https://corvus-tech.co";

// Arayüz sözleri (veri metni değil): bileşen sözlükten okumayı unutursa burada yakalanır.
const TR_UI = [/\bKısa cevap\b/, /\bSık sorulanlar\b/, /\bGün gezisi\b/, /\bdurak\b/, /\bİlk durak\b/, /App Store'dan indir/, /\bÜcretsiz\b/, /\bHaritada aç\b/, /\bGizli köşe\b/, /\bSıradaki rota\b/, /\bRotalar\b/, /\bListeler\b/, /\bİpucu\b/, /\bNeden ünlü\b/, /\d+\. sıra\b/, /\d+\. gün\b/];
const EN_UI = [/\bShort answer\b/, /\bDay trip\b/, /\bFirst stop\b/, /Download on the App Store/, /\bOpen in Maps\b/, /\bHidden gem\b/, /\bper person\b/, /\bWhy it's famous\b/];
const BROKEN = [/>undefined</, /\bNaN\b/, /\[object Object\]/, />null</];

const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => /\/tripwalkers\/(planlar|plans)(\/|$)/.test(u));
const problems = [];
const alternates = new Map();

async function check(url) {
  const path = url.replace(SITE, "");
  const res = await fetch(BASE + path);
  if (res.status !== 200) return problems.push(`${path}: HTTP ${res.status}`);
  const html = await res.text();
  const want = path.startsWith("/tripwalkers/plans") ? "en" : "tr";
  const lang = /<html lang="([a-z]+)"/.exec(html)?.[1];
  if (lang !== want) problems.push(`${path}: html lang=${lang}, beklenen ${want}`);
  const canon = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (canon !== url) problems.push(`${path}: canonical ${canon}`);
  const alts = Object.fromEntries([...html.matchAll(/<link rel="alternate" hrefLang="([a-z-]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
  alternates.set(url, alts);
  const body = text(html);
  for (const re of want === "en" ? TR_UI : EN_UI) if (re.test(body)) problems.push(`${path}: ${want === "en" ? "Türkçe" : "İngilizce"} arayüz sözü kaldı → ${re}`);
  for (const re of BROKEN) if (re.test(html.replace(/<script[\s\S]*?<\/script>/g, ""))) problems.push(`${path}: bozuk değer basılmış → ${re}`);
}

const queue = [...urls];
await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await check(queue.shift()); }));

// hreflang karşılıklılığı: A, B'yi eş gösteriyorsa B de A'yı göstermeli
for (const [url, alts] of alternates) {
  for (const [, href] of Object.entries(alts)) {
    if (href === url) continue;
    const back = alternates.get(href);
    if (!back) problems.push(`${url.replace(SITE, "")}: eşi ${href.replace(SITE, "")} site haritasında yok`);
    else if (!Object.values(back).includes(url)) problems.push(`${href.replace(SITE, "")}: ${url.replace(SITE, "")} sayfasını eş göstermiyor`);
  }
}

const tr = urls.filter((u) => u.includes("/tripwalkers/planlar")).length;
console.log(`${urls.length} sayfa gezildi (TR ${tr} · EN ${urls.length - tr}) · sorun ${problems.length}`);
for (const p of problems.slice(0, 60)) console.log("  ✗ " + p);
process.exit(problems.length ? 1 : 0);
