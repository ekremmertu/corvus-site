import { readFileSync } from "node:fs";
import path from "node:path";
import { NUMBER_LOCALE, type Locale } from "./gezi-i18n";

/**
 * TripWalkers Rotaları — /gezi veri katmanı.
 * Kaynak JSON'lar `scripts/build-gezi-data.py` ile TripWalkers plan havuzundan üretilir.
 */

export type Category = "food" | "landmark" | "nature" | "culture" | "shopping";

export type Stop = {
  name: string;
  category: Category;
  start: string;
  end: string;
  cost: number;
  tips: string;
  bookingUrl?: string;
  bookingProvider?: string;
};

export type Day = {
  index: number;
  type: "cityCenter" | "dayTrip";
  theme: string;
  stops: Stop[];
  backups: Stop[];
};

export type Niche = {
  name: string;
  level?: string;
  why_hidden?: string;
  access_instructions?: string;
  local_contact?: string;
  season?: string;
  insider_tip?: string;
};

export type Transit = { name: string; why_chosen?: string; [k: string]: unknown };

export type Plan = {
  lang: Locale;
  slug: string;
  /** Öbür dildeki karşılığın slug'ı (EN çevirisi yoksa null). */
  altSlug: string | null;
  citySlug: string;
  destKey: string;
  city: string;
  region: string | null;
  country: string;
  isTurkey: boolean;
  coastal: boolean;
  season: "summer" | "other";
  seasonSlug: string;
  seasonLabel: string;
  currency: string;
  totalDays: number;
  quality: "v1" | "v2";
  budget: Partial<Record<"flights" | "hotel" | "food" | "attractions" | "transport" | "misc", number>>;
  notes: string[];
  niche: Niche | null;
  transit: Transit | null;
  days: Day[];
};

export type CitySeason = {
  season: "summer" | "other";
  slug: string;
  enSlug: string;
  hasEn: boolean;
  seasonLabelEn: string;
  firstThemeEn: string;
  seasonSlug: string;
  seasonLabel: string;
  stops: number;
  quality: "v1" | "v2";
  firstTheme: string;
};

export type City = {
  destKey: string;
  city: string;
  cityEn: string;
  countryEn: string;
  citySlug: string;
  region: string | null;
  country: string;
  isTurkey: boolean;
  coastal: boolean;
  rank?: number;
  seasons: CitySeason[];
};

const DATA_DIR = path.join(process.cwd(), "src", "data", "gezi");

let indexCache: City[] | null = null;

export function cities(): City[] {
  indexCache ??= JSON.parse(readFileSync(path.join(DATA_DIR, "index.json"), "utf8")) as City[];
  return indexCache;
}

/** Bir dilde gösterilecek şehir + mevsim kartı. EN'de yalnız çevirisi hazır mevsimler var (yarım İngilizce sayfa yayına çıkmaz). */
export type LocalSeason = { season: CitySeason["season"]; slug: string; label: string; stops: number; firstTheme: string };
export type LocalCity = {
  destKey: string; city: string; country: string; region: string | null; isTurkey: boolean; seasons: LocalSeason[];
};

export function localCities(locale: Locale): LocalCity[] {
  return cities()
    .map((c) => ({
      destKey: c.destKey,
      city: locale === "tr" ? c.city : c.cityEn,
      country: locale === "tr" ? c.country : c.countryEn,
      region: c.region,
      isTurkey: c.isTurkey,
      seasons: c.seasons
        .filter((s) => locale === "tr" || s.hasEn)
        .map((s) => ({
          season: s.season,
          slug: locale === "tr" ? s.slug : s.enSlug,
          label: locale === "tr" ? s.seasonLabel : s.seasonLabelEn,
          stops: s.stops,
          firstTheme: locale === "tr" ? s.firstTheme : s.firstThemeEn,
        })),
    }))
    .filter((c) => c.seasons.length > 0);
}

export function allSlugs(locale: Locale = "tr"): string[] {
  return localCities(locale).flatMap((c) => c.seasons.map((s) => s.slug));
}

export function getPlan(slug: string, locale: Locale = "tr"): Plan | null {
  if (!/^[a-z0-9-]+$/.test(slug) || !allSlugs(locale).includes(slug)) return null;
  const dir = locale === "tr" ? "plans" : "plans-en";
  return JSON.parse(readFileSync(path.join(DATA_DIR, dir, `${slug}.json`), "utf8")) as Plan;
}

const CURRENCY_SYMBOL: Record<string, string> = {
  TRY: "₺", EUR: "€", USD: "$", GBP: "£", JPY: "¥", CNY: "¥",
};

export function money(amount: number, currency: string, locale: Locale = "tr"): string {
  const rounded = amount >= 1000 ? Math.round(amount / 50) * 50 : Math.round(amount);
  const num = new Intl.NumberFormat(NUMBER_LOCALE[locale]).format(rounded);
  const sym = CURRENCY_SYMBOL[currency];
  if (!sym) return `${num} ${currency}`;
  // TL: plan metinleri de "TL" yazar → sayfada tek biçim (₺ ile karışmasın)
  return currency === "TRY" ? `${num} TL` : `${sym}${num}`;
}

export function toMinutes(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

export function planStats(plan: Plan) {
  const stops = plan.days.reduce((n, d) => n + d.stops.length, 0);
  const tripDays = plan.days.filter((d) => d.type === "dayTrip").map((d) => d.index);
  const spend = (["food", "attractions", "transport", "misc"] as const).reduce(
    (n, k) => n + (plan.budget[k] ?? 0),
    0,
  );
  const starts = plan.days.flatMap((d) => d.stops.map((s) => toMinutes(s.start))).filter((m): m is number => m !== null);
  const earliest = starts.length ? Math.min(...starts) : null;
  const bookings = plan.days.reduce((n, d) => n + d.stops.filter((s) => s.bookingUrl).length, 0);
  return { stops, tripDays, spend, perDay: spend / Math.max(plan.days.length, 1), earliest, bookings };
}

export function fmtMinutes(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export function placeLine(p: { city: string; region: string | null; country: string }): string {
  return [p.city, p.region, p.country].filter(Boolean).join(" · ");
}

export function otherSeason(plan: Plan): LocalSeason | undefined {
  return localCities(plan.lang).find((c) => c.destKey === plan.destKey)?.seasons.find((s) => s.season !== plan.season);
}

export function relatedCities(plan: Plan, limit = 6): LocalCity[] {
  const pool = localCities(plan.lang).filter((c) => c.destKey !== plan.destKey);
  const sameCountry = pool.filter((c) => c.country === plan.country);
  const sameGroup = pool.filter((c) => c.isTurkey === plan.isTurkey && c.country !== plan.country);
  const rest = pool.filter((c) => !sameCountry.includes(c) && !sameGroup.includes(c));
  return [...sameCountry, ...sameGroup, ...rest].slice(0, limit);
}

/** Planların bu siteye son aktarıldığı gün (build-gezi-data.py koşulduğunda güncellenir). */
export const GEZI_UPDATED = "2026-10-04";

export { APP_STORE_URL, APP_STORE_URL_EN, appStoreHref, campaignOf } from "./gezi-links";
