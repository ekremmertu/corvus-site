import type { Locale } from "./gezi-i18n";

/** İstemci bileşenleri de kullanır (fs yok). EN bağlantısı ülke kodsuz: Apple ziyaretçiyi kendi mağazasına yönlendirir. */
export const APP_STORE_URL = "https://apps.apple.com/tr/app/tripwalkers/id6764424121";
export const APP_STORE_URL_EN = "https://apps.apple.com/app/tripwalkers/id6764424121";

/** Kampanya kodlu App Store bağlantısı — App Store Connect'te hangi sayfanın indirme getirdiği görünür. */
export function appStoreHref(locale: Locale, campaign: string): string {
  const base = locale === "tr" ? APP_STORE_URL : APP_STORE_URL_EN;
  return `${base}?ct=${encodeURIComponent(campaign)}&mt=8`;
}

/** Kampanya adı: TR "gezi-<yol>", EN "trips-<yol>" (dizin = "-index"). */
export function campaignOf(locale: Locale, rest: string): string {
  const prefix = locale === "tr" ? "gezi" : "trips";
  const clean = rest.replace(/^\/+|\/+$/g, "").replace(/\//g, "-");
  return clean ? `${prefix}-${clean}` : `${prefix}-index`;
}
