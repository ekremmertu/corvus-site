import { readFileSync } from "node:fs";
import path from "node:path";
import { LIST_COPY, type Locale } from "./gezi-i18n";

/** TripWalkers seçki listeleri — veri `scripts/build-liste-data.py` ile app'in CuratedSpots.json'undan üretilir. */

export type Photo = {
  title: string;
  caption: string;
  artist: string;
  license: string;
  licenseUrl: string;
  pageUrl: string;
  src: string;
  ratio: number;
  captionEn: string;
};

export type Spot = {
  slug: string;
  listId: string;
  nameTr: string;
  nameEn: string;
  listSlug: string;
  kind: "bar" | "restaurant" | "heritage";
  rank: number;
  name: string;
  city: string;
  cityTr: string;
  country: string;
  countryCode: string;
  address: string;
  lat: number;
  lng: number;
  geoDriftKm: number | null;
  geoChecked: boolean;
  geoFixed: boolean;
  why: string;
  signature: string;
  tip: string;
  countryEn: string;
  whyEn: string;
  signatureEn: string;
  tipEn: string;
  photo: Photo | null;
  map: string;
  cityPlan: { destKey: string; city: string; cityEn: string; slug: string; enSlug: string | null } | null;
};

export type CuratedList = {
  id: string;
  slug: string;
  slugEn: string;
  kind: Spot["kind"];
  title: string;
  titleEn: string;
  year: number | null;
  source: { name: string; url: string };
  sourceEn: string;
  spots: string[];
};

type Data = { lists: CuratedList[]; spots: Spot[] };

let cache: Data | null = null;
function data(): Data {
  cache ??= JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "liste", "index.json"), "utf8")) as Data;
  return cache;
}

export const lists = () => data().lists;
export const allSpots = () => data().spots;
export const getList = (slug: string, locale: Locale = "tr") =>
  data().lists.find((l) => (locale === "tr" ? l.slug : l.slugEn) === slug) ?? null;
export const listSlug = (l: CuratedList, locale: Locale) => (locale === "tr" ? l.slug : l.slugEn);
export const getSpot = (slug: string) => data().spots.find((s) => s.slug === slug) ?? null;
export const spotsOf = (list: CuratedList) => list.spots.map((s) => getSpot(s)).filter((s): s is Spot => s !== null);
export const spotsInCity = (destKey: string) => data().spots.filter((s) => s.cityPlan?.destKey === destKey);

/** Bir mekânın seçilen dildeki metinleri — sayfalar Spot alanlarını doğrudan değil bunu okur. */
export function spotText(s: Spot, locale: Locale) {
  const en = locale === "en";
  const city = en ? s.city : s.cityTr;
  const country = en ? s.countryEn : s.country;
  return {
    name: en ? s.nameEn : s.nameTr,
    /** UNESCO bir sıralama yapmaz → mirasta "N. sıra" gösterilmez. */
    ranked: s.kind !== "heritage",
    city,
    country,
    place: city === country ? city : `${city}, ${country}`,
    placeDot: city === country ? city : `${city} · ${country}`,
    why: en ? s.whyEn : s.why,
    signature: en ? s.signatureEn : s.signature,
    tip: en ? s.tipEn : s.tip,
    caption: s.photo ? (en ? s.photo.captionEn : s.photo.caption) : "",
    listCopy: LIST_COPY[locale][s.listSlug],
    planSlug: s.cityPlan ? (en ? s.cityPlan.enSlug : s.cityPlan.slug) : null,
    planCity: s.cityPlan ? (en ? s.cityPlan.cityEn : s.cityPlan.city) : null,
  };
}

export function mapsUrl(s: Spot): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(s.name)}&ll=${s.lat},${s.lng}`;
}
