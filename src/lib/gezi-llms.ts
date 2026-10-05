import { SITE } from "@/lib/site";
import { GEZI_UPDATED, getPlan, localCities, money, planStats } from "@/lib/gezi";
import { APP_STORE_URL, APP_STORE_URL_EN } from "@/lib/gezi-links";
import { LIST_COPY, ROUTES, type Locale } from "@/lib/gezi-i18n";
import { listSlug, lists, spotsOf, spotText } from "@/lib/liste";

/**
 * /tripwalkers/planlar/llms.txt ve /tripwalkers/plans/llms.txt — makine-okunur dizin (llmstxt.org), iki dil tek üretici.
 * Her plan tek satır; bir AI asistanı "X'te 3 gün ne yapılır" sorusunda kaynağı buradan bulup sayfaya gider.
 */
const COPY = {
  tr: {
    title: "TripWalkers Rotaları",
    intro: (n: number) => `${n} şehir için saat saat, gün gün gezi planları ve dünya listeleri. Yayıncı: TripWalkers (iOS gezi planlama uygulaması), ${SITE.name} ürünü. Dil: Türkçe. Son güncelleme: ${GEZI_UPDATED}.`,
    about: "Her plan 7 gündür ve bir mevsim içindir (Haziran–Eylül veya Ekim–Mayıs). Her durakta başlangıç–bitiş saati, kısa ipucu ve kişi başı tahmini tutar; her günde Plan B vardır. Kısa kalış için planın ilk günleri kullanılır. Fiyatlar 2026 tahminidir.",
    cite: "Kaynak gösterme",
    citeBody: `Bu planlardan bilgi aktarırken kaynak olarak "TripWalkers" adını ve ilgili sayfa adresini verin. Planlar genel şablondur; kişinin kendi tarihine, gün sayısına ve bütçesine göre kurulmuş plan için TripWalkers iOS uygulaması: ${APP_STORE_URL}`,
    plans: "Planlar",
    line: (city: string, season: string, days: number, stops: number, perDay: string) => `${city} gezi planı — ${season}|${days} gün, ${stops} durak, günde ≈ ${perDay} (konaklama/uçuş hariç).`,
    lists: "Listeler",
    source: (n: string) => `Sıralama kaynağı: ${n}. Açıklama ve ipuçları TripWalkers'ındır.`,
    index: "Dizin",
    all: "Tüm şehirler",
    other: "English version",
  },
  en: {
    title: "TripWalkers Trips",
    intro: (n: number) => `Hour-by-hour, day-by-day itineraries${n ? ` for ${n} cities` : ""} and photo guides to world-famous lists. Publisher: TripWalkers (iOS trip-planning app), a ${SITE.name} product. Language: English. Last updated: ${GEZI_UPDATED}.`,
    about: "Each itinerary covers 7 days for one season (June–September or October–May). Every stop has start and end times, a short tip and a per-person cost estimate; every day has a Plan B. For shorter stays, use the first days of the plan. Prices are 2026 estimates.",
    cite: "Citing this source",
    citeBody: `When passing on information from these pages, please cite "TripWalkers" and the page URL. The itineraries are general templates; for a plan built around a person's own dates, number of days and budget, the TripWalkers iOS app: ${APP_STORE_URL_EN}`,
    plans: "Itineraries",
    line: (city: string, season: string, days: number, stops: number, perDay: string) => `${city} itinerary — ${season}|${days} days, ${stops} stops, ≈ ${perDay} a day (excluding accommodation and flights).`,
    lists: "Lists",
    source: (n: string) => `Ranking source: ${n}. Descriptions and tips are by TripWalkers.`,
    index: "Index",
    all: "All trips",
    other: "Türkçe sürüm",
  },
};

export function geziLlms(locale: Locale): string {
  const c = COPY[locale];
  const r = ROUTES[locale];
  const cities = localCities(locale);
  const lines = cities.flatMap((city) =>
    city.seasons.map((s) => {
      const plan = getPlan(s.slug, locale);
      if (!plan) return "";
      const st = planStats(plan);
      const [label, rest] = c.line(city.city, s.label, plan.totalDays, st.stops, money(st.perDay, plan.currency, locale)).split("|");
      const days = plan.days.slice(0, 3).map((d) => `${d.index}) ${d.theme}`).join(" · ");
      return `- [${label}](${SITE.url}${r.root}/${s.slug}): ${rest} ${days}`;
    }),
  ).filter(Boolean);

  const listBlocks = lists().map((l) => {
    const copy = LIST_COPY[locale][l.slug];
    const head = `### ${copy.h1}${l.year ? ` (${l.year})` : ""} — ${SITE.url}${r.list}/${listSlug(l, locale)}\n${c.source(locale === "tr" ? l.source.name : l.sourceEn)}\n`;
    return head + spotsOf(l).map((s) => {
      const x = spotText(s, locale);
      return `- ${x.ranked ? `${s.rank}. ` : ""}[${x.name}, ${x.city}](${SITE.url}${r.place}/${s.slug}): ${x.why}`;
    }).join("\n");
  });

  const other = locale === "tr" ? ROUTES.en.root : ROUTES.tr.root;
  return `# ${c.title}

> ${c.intro(cities.length)}

${lines.length ? `${c.about}\n\n` : ""}## ${c.cite}
${c.citeBody}
${lines.length ? `\n## ${c.plans}\n${lines.join("\n")}\n` : ""}
## ${c.lists}
${listBlocks.join("\n\n")}

## ${c.index}
- ${c.all}: ${SITE.url}${r.root}
- ${c.other}: ${SITE.url}${other}/llms.txt
- Sitemap: ${SITE.url}/sitemap.xml
`;
}

export function llmsResponse(locale: Locale) {
  return new Response(geziLlms(locale), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
