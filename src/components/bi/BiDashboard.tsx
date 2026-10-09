import { DASH_CARD, DASH_HERO } from "./dashSvg";

/** Panel yazılarının İngilizcesi — yalnız metin düğümleri çevrilir, çizim koordinatlarına dokunulmaz. */
const EN: Record<string, string> = {
  "ÖRNEK VERİ": "SAMPLE DATA",
  "Ürün A-1042": "Product A-1042",
  "Ürün B-2210": "Product B-2210",
  "Ürün C-0874": "Product C-0874",
  "Ürün D-3315": "Product D-3315",
  "İç Anadolu": "Central",
  Akdeniz: "South",
  Ege: "West",
  Karadeniz: "North",
  Marmara: "Metro",
  "1 gün gecikme": "1 day late",
  "2+ gün": "2+ days",
  "12 hafta": "12 weeks",
  "18 gün": "18 days",
  "BÖLGE × HAFTA · HEDEFE ULAŞMA": "REGION × WEEK · TARGET HIT",
  Bayram: "Holiday",
  "Canlı · 09:41": "Live · 09:41",
  "EN ÇOK SAPAN ÜRÜNLER": "TOP DEVIATING PRODUCTS",
  "Genel bakış": "Overview",
  Gerçek: "Actual",
  "HAFTALIK SEVKİYAT · KOLİ": "WEEKLY SHIPMENTS · CASES",
  Kampanya: "Promo",
  Operasyon: "Operations",
  Plan: "Plan",
  "Revize oranı": "Revision rate",
  "SİPARİŞ HACMİ": "ORDER VOLUME",
  Sevkiyat: "Shipments",
  "Son 26 hafta": "Last 26 weeks",
  "Stok devir": "Stock turn",
  Stok: "Inventory",
  "Tüm bölgeler": "All regions",
  TAHMİN: "FORECAST",
  "Tahmin · %80": "Forecast · 80%",
  Tahmin: "Forecast",
  "TESLİM PERFORMANSI": "DELIVERY PERFORMANCE",
  Zamanında: "On time",
};

/** Türkçe sayı biçimi → İngilizce: "%8,2" → "8.2%", "12.629" → "12,629", "11b" → "11k". */
function enNum(t: string) {
  return t
    .replace(/(\d)\.(\d{3})/g, "$1,$2")
    .replace(/%(\d+),(\d+)/g, "$1.$2%")
    .replace(/%(\d+)/g, "$1%")
    .replace(/(\d)b\b/g, "$1k")
    .replace(/plana göre/g, "vs plan")
    .replace(/haftalık toplam/g, "-week total")
    .replace(/hedef/g, "target")
    .replace(/teslimat/g, "deliveries")
    .replace(/(\d+) -week/g, "$1-week")
    .replace(/ gün\b/g, " days")
    .replace(/^H(\d+)$/, "W$1");
}

function toEn(svg: string) {
  return svg.replace(/>([^<>]+)</g, (m, t: string) => {
    const k = t.trim();
    if (!k) return m;
    return ">" + t.replace(k, EN[k] ?? enNum(k)) + "<";
  });
}

const HERO_EN = toEn(DASH_HERO);
const CARD_EN = toEn(DASH_CARD);

/** Kurumsal panel görseli (dekor, kurgu "Örnek veri"). Ekran okuyucuya tek cümleyle anlatılır. */
export default function BiDashboard({ variant = "hero", label, locale = "tr" }: { variant?: "hero" | "card"; label: string; locale?: "tr" | "en" }) {
  const html = variant === "hero" ? (locale === "en" ? HERO_EN : DASH_HERO) : locale === "en" ? CARD_EN : DASH_CARD;
  return <div className="bi" role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: html }} />;
}
