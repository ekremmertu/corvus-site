/**
 * TripWalkers Rotaları — iki dil (TR /gezi · EN /trips) için tek sözlük + adres kuralı.
 * İstemci bileşenleri de kullanır: burada fs/sunucu kodu yok.
 * Yeni metin = buraya iki dilde eklenir; bileşende sabit yazı yazılmaz.
 */

export type Locale = "tr" | "en";
export const LOCALES: Locale[] = ["tr", "en"];

export const ROUTES = {
  tr: { root: "/tripwalkers/planlar", list: "/tripwalkers/planlar/liste", place: "/tripwalkers/planlar/mekan" },
  en: { root: "/tripwalkers/plans", list: "/tripwalkers/plans/lists", place: "/tripwalkers/plans/places" },
} as const;

export const HTML_LANG: Record<Locale, string> = { tr: "tr", en: "en" };
export const OG_LOCALE: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };
export const NUMBER_LOCALE: Record<Locale, string> = { tr: "tr-TR", en: "en-US" };
export const DATE_LOCALE: Record<Locale, string> = { tr: "tr-TR", en: "en-GB" };

export function fmtDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(DATE_LOCALE[locale], { day: "numeric", month: "long", year: "numeric" });
}

export function fmtNumber(n: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale]).format(n);
}

/** İngilizce belirsiz tanımlık: "an Istanbul", "a Rome" (ünlüyle başlayan ad; "Uni-/Euro-" istisna). */
function an(word: string): string {
  const w = word.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return /^[aeio]|^u(?!ni|ro)/.test(w) ? "an" : "a";
}

/** "6 ve 7" / "6 and 7" */
function joinAnd(items: (string | number)[], locale: Locale): string {
  const and = locale === "tr" ? " ve " : " and ";
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")}${and}${items.at(-1)}`;
}

const tr = {
  skip: "İçeriğe geç",
  brandAria: "TripWalkers Rotaları — tüm şehirler",
  brandTag: "Rotalar",
  footLead: "Planlar TripWalkers plan havuzundan gelir. Fiyatlar 2026 tahminidir; açılış saatlerini gitmeden kontrol et.",
  footNav: "Alt bağlantılar",
  allTrips: "Tüm rotalar",
  studio: "TripWalkers, bir Corvus Tech ürünüdür",
  cta: "App Store'dan indir",
  ctaFoot: "TripWalkers · App Store",
  ctaSmall: "iPhone için · Türkçe ve İngilizce · indirmesi ücretsiz",
  crumbs: "Konum",
  crumbRoot: "Rotalar",
  crumbLists: "Listeler",
  otherLang: { label: "English", hint: "Bu sayfanın İngilizcesi" },
  siteTitle: "TripWalkers Rotaları — saat saat gezi planları",

  // dizin
  indexTitle: "Gezi Planları: 100 Şehir İçin Saat Saat Rotalar · TripWalkers",
  indexDesc:
    "Kapadokya'dan Tokyo'ya 100 şehir için saat saat, gün gün gezi planları. Her durakta ne yapacağın, kaça mal olacağı ve Plan B. Yaz ve Ekim–Mayıs için ayrı.",
  indexH1: (n: number) => `Planlaması bitmiş ${n} şehir.`,
  indexLead: "TripWalkers rotaları saat saat: nereye, kaçta, kaça. Şehri seç, mevsimini seç, yürümeye başla.",
  indexPlans: (n: number) => `${n} plan`,
  indexSeasons: "Yaz + Ekim–Mayıs",
  indexStops: (n: string) => `${n} durak`,
  indexLists: "Listeler: dünyanın en iyileri",
  collectionName: "TripWalkers Rotaları",

  // şehir gezgini
  tabAll: "Hepsi",
  tabTr: "Türkiye",
  tabWorld: "Dünya",
  tabsAria: "Bölge",
  searchLabel: "Şehir ara",
  searchPh: (ex: string) => `Şehir ara: ${ex}…`,
  shown: (n: number) => `${n} şehir gösteriliyor`,
  emptyQ: (q: string) => `“${q}” için henüz rota yok.`,
  emptyBody: "TripWalkers uygulaması istediğin her şehre plan kurar.",
  cardAria: (city: string, season: string) => `${city} gezi planı, ${season}`,

  // plan
  planTitle: (city: string, days: number, season: string) => `${city} Gezi Planı — ${days} Günlük Rota (${season})`,
  planDesc: (city: string, days: number, stops: number, season: string) =>
    `${city} için saat saat ${days} günlük gezi planı: ${stops} durak, her gün için yemek, gezi ve Plan B. ${season} dönemine göre kuruldu; kısa kalacaksan ilk günlerden başla.`,
  planH1: (city: string) => `${city} gezi planı`,
  planSub: (days: number) => `${days} gün, saat saat`,
  factDays: "Gün",
  factStops: "Durak",
  factPerDay: "Günde",
  factFirst: "İlk durak",
  byline: "Hazırlayan: TripWalkers · Güncelleme:",
  answerTitle: "Kısa cevap",
  answerLead: (city: string, days: number, season: string, stops: number) =>
    `TripWalkers'ın ${city} gezi planı ${days} gün sürüyor ve ${season} döneminde ${stops} durağı saat saat sıralıyor. İlk üç gün:`,
  answerRest: (tripDays: number[], perDay: string) =>
    `Daha kısa kalacaksan ilk günlerden başla; TripWalkers da kısa gezilerde bu planın ilk günlerini kullanır.${
      tripDays.length ? ` ${joinAnd(tripDays, "tr")}. gün şehir dışına gün gezisi var.` : ""
    } Yemek, giriş ücretleri ve şehir içi ulaşım günde yaklaşık ${perDay} tutuyor (konaklama ve uçuş hariç).`,
  dayN: (n: number) => `${n}. gün`,
  dayTrip: "Gün gezisi",
  daysOf: (city: string) => `${city} planının günleri`,
  daysNav: "Günler",
  stopsN: (n: number) => `${n} durak`,
  gap: (label: string) => `${label} ara · yol, mola, serbest`,
  gapAria: (label: string) => `${label} ara`,
  hours: "sa",
  minutes: "dk",
  free: "Ücretsiz",
  perPerson: (m: string) => `≈ ${m} / kişi`,
  tickets: (p: string) => `Bilet: ${p}`,
  planB: (n: number) => `Plan B — kalabalık ya da kapalıysa (${n})`,
  nichePre: "Gizli köşe:",
  nicheHow: "Nasıl gidilir",
  nicheTip: "Yerlinin ipucu",
  nicheWhen: "Ne zaman",
  nicheContact: "İletişim",
  transitPre: "Ulaşım:",
  transitTitle: (name: string) => `cebinde ${name} olsun`,
  notesPre: "Gitmeden bil:",
  notesTitle: (city: string, n: number) => `${city} gezisini kolaylaştıracak ${n} şey`,
  spendPre: "Harcama:",
  spendTitle: (days: number, m: string) => `${days} günde kişi başı ≈ ${m}`,
  spendFood: "Yemek",
  spendAttr: "Giriş ve turlar",
  spendTransport: "Şehir içi ulaşım",
  spendMisc: "Diğer",
  spendNote: "Konaklama ve uçuş hariç. 2026 fiyat tahmini; kişi başı.",
  listedPre: "Dünya listelerinde:",
  listedTitle: (n: number) => `bu şehirden ${n} yer`,
  rankN: (n: number) => `${n}. sıra`,
  planCtaH: "Planlamayı biz yaptık. Sen sadece tarihleri söyle.",
  planCtaP: "TripWalkers bu rotayı senin gün sayına, bütçene ve hızına göre yeniden kurar; haritada gösterir, gün gün yanında taşır.",
  nextTitle: "Sıradaki rota",
  sameCity: (season: string) => `Aynı şehir · ${season}`,
  faqTitle: "Sık sorulanlar",
  touristType: "Bireysel gezgin",
  ldDay: (n: number, theme: string) => `${n}. gün: ${theme}`,
  appDesc: (city: string, n: number) =>
    `${city} dahil ${n} şehir için hazır gezi planı; planı kişinin tarihine, gün sayısına ve bütçesine göre yeniden kurar.`,
  faq: {
    daysQ: (city: string) => `${city} gezisi için kaç gün yeterli?`,
    daysA: (days: number, tripDays: number[]) =>
      `Bu rota ${days} gün olarak kuruldu. 3 gün kalacaksan ilk 3 günü yap; TripWalkers da kısa gezilerde planın ilk günlerini kullanır.${
        tripDays.length ? ` Gün gezisi ${joinAnd(tripDays, "tr")}. günde; kısa kalışta atlanabilir.` : ""
      }`,
    costQ: (city: string) => `${city} gezisinde günlük ne kadar harcanır?`,
    costA: (m: string) =>
      `Bu planda yemek, giriş ücretleri ve şehir içi ulaşım kişi başı günde yaklaşık ${m} tutuyor. Konaklama ve uçuş dahil değil. Rakamlar 2026 tahminidir.`,
    startQ: (city: string) => `${city} gezisinde güne kaçta başlamak gerekir?`,
    startA: (t: string | null) =>
      t
        ? `İlk durak saat ${t}. Çoğu gün sabah ilk saatlerde başlar ki kalabalıktan önce varasın; akşamlar yemekle kapanır.`
        : "Günler sabah başlar, akşam yemekle kapanır.",
    bookQ: (city: string) => `${city} gezisinde önceden bilet alınması gereken yerler hangileri?`,
    bookA: (items: string[]) => `Bu planda önceden bilete bakman önerilen yerler: ${items.join(", ")}.`,
    bookItem: (name: string, day: number) => `${name} (${day}. gün)`,
    seasonQ: "Bu plan hangi mevsim için?",
    seasonA: (season: string, other: string) =>
      `Bu sayfa ${season} için. ${other} için ayrı bir plan var: açık saatler, deniz ve hava durumu ona göre değişiyor.`,
  },

  // listeler + mekânlar
  listMetaTitle: (h1: string, year: number | null) => `${h1}${year ? ` (${year})` : ""} — fotoğraflı rehber`,
  listSub: (n: number, c: number) => `${n} yer · ${c} ülke`,
  listYear: (y: number) => `${y} listesi`,
  podium: "İlk üç",
  podiumUnranked: "Öne çıkanlar",
  prevItem: "← Önceki",
  nextItem: "Sonraki →",
  heritageSource: (link: React.ReactNode) => (
    <>
      Kaynak: {link}. Bu bir sıralama değil; 50 yerlik seçki ve sıra TripWalkers ekibinindir. Fotoğraflar Wikimedia Commons&apos;tan, açık lisansla; fotoğrafı olmayan yerlerde konum haritası (Natural Earth) kullanılır.
    </>
  ),
  heritageSpotSource: (link: React.ReactNode) => (
    <>
      Kaynak: {link}. Seçki TripWalkers ekibinindir; UNESCO bir sıralama yapmaz. Açılış saatleri ve fiyatlar değişebilir; gitmeden kontrol et.
    </>
  ),
  listSource: (link: React.ReactNode) => (
    <>
      Sıralama kaynağı: {link}. TripWalkers bu kuruluşla bağlantılı değildir; açıklamalar ve ipuçları TripWalkers ekibinindir. Fotoğraflar Wikimedia Commons&apos;tan, açık lisansla; fotoğrafı olmayan yerlerde konum haritası (Natural Earth) kullanılır.
    </>
  ),
  listCtaH: "Bu listeyi rotana ekle.",
  listCtaP: "TripWalkers gideceğin şehirdeki listedeki yerleri planına yerleştirir; saatini, sırasını ve yolunu senin yerine düşünür.",
  otherLists: "Diğer listeler",
  placesN: (n: number) => `${n} yer`,
  plansShelf: "Gezi planları · 100 şehir",
  plansShelfTitle: "Saat saat rotalar",
  spotTitleHeritage: (name: string, place: string) => `${name} — ${place}: gezi rehberi ve ipuçları`,
  spotTitleRanked: (name: string, city: string, h1: string, rank: number) => `${name}, ${city} — ${h1} listesinde ${rank}. sıra`,
  why: "Neden ünlü",
  signature: { bar: "Ne içilir", restaurant: "Ne yenir", heritage: "Kaçırma" },
  tip: "İpucu",
  address: "Adres",
  openMaps: "Haritada aç",
  planLinkQ: (city: string) => `${city} gezisine mi gidiyorsun?`,
  planLinkT: (city: string) => `${city} için 7 günlük saat saat plan →`,
  pagerAria: "Listede gezin",
  prevRank: (n: number) => `← ${n}. sıra`,
  nextRank: (n: number) => `${n}. sıra →`,
  spotCtaH: "Bu yeri rotana yerleştirelim.",
  spotCtaP: "TripWalkers gideceğin günlere göre planı kurar; bu yeri doğru saate ve doğru güne yerleştirir.",
  sameCountry: (c: string) => `Listede aynı ülkeden: ${c}`,
  spotSource: (link: React.ReactNode) => (
    <>
      Sıralama kaynağı: {link}. TripWalkers bu kuruluşla bağlantılı değildir. Açılış saatleri ve fiyatlar değişebilir; gitmeden kontrol et.
    </>
  ),
  mapAlt: (name: string, place: string) => `${name} konumu: ${place}`,
  photoBy: "Fotoğraf:",
  mapCaption: "Konum haritası · Harita verisi: Natural Earth",

  // 404
  nfTitle: "Bu rota yok.",
  nfSub: "Adres yanlış yazılmış ya da bu şehir henüz eklenmemiş olabilir.",
  nfAll: "Tüm şehirlere bak",
  nfPopular: "Çok bakılan rotalar",

  // OG
  ogTagline: "gezi planı, saat saat",
  ogDays: (n: number) => `${n} gün`,
  ogStops: (n: number) => `${n} durak`,
  ogPerDay: (m: string) => `günde ≈ ${m}`,
  ogAlt: "TripWalkers gezi planı",
};

export type Dict = typeof tr;

const en: Dict = {
  skip: "Skip to content",
  brandAria: "TripWalkers Trips — all cities",
  brandTag: "Trips",
  footLead: "Itineraries come from the TripWalkers plan library. Prices are 2026 estimates; check opening hours before you go.",
  footNav: "Footer links",
  allTrips: "All trips",
  studio: "TripWalkers is a Corvus Tech product",
  cta: "Download on the App Store",
  ctaFoot: "TripWalkers · App Store",
  ctaSmall: "For iPhone · English and Turkish · Free to download",
  crumbs: "Breadcrumb",
  crumbRoot: "Trips",
  crumbLists: "Lists",
  otherLang: { label: "Türkçe", hint: "This page in Turkish" },
  siteTitle: "TripWalkers Trips — hour-by-hour itineraries",

  indexTitle: "Travel Itineraries: Hour-by-Hour Trip Plans · TripWalkers",
  indexDesc:
    "Hour-by-hour, day-by-day itineraries for cities from Cappadocia to Tokyo — plus photo guides to the world's 50 best bars, 50 best restaurants and 50 iconic UNESCO sites.",
  indexH1: (n: number) => (n ? `${n} cities, planned to the hour.` : "The world's best places, in one guide."),
  indexLead: "TripWalkers itineraries hour by hour: where to go, when, and what it costs. Pick a city, pick a season, start walking.",
  indexPlans: (n: number) => `${n} itineraries`,
  indexSeasons: "Summer + October–May",
  indexStops: (n: string) => `${n} stops`,
  indexLists: "The world's best, in three lists",
  collectionName: "TripWalkers Trips",

  tabAll: "All",
  tabTr: "Türkiye",
  tabWorld: "World",
  tabsAria: "Region",
  searchLabel: "Search cities",
  searchPh: (ex: string) => `Search: ${ex}…`,
  shown: (n: number) => `${n} ${n === 1 ? "city" : "cities"} shown`,
  emptyQ: (q: string) => `No itinerary for “${q}” yet.`,
  emptyBody: "The TripWalkers app builds a plan for any city you like.",
  cardAria: (city: string, season: string) => `${city} itinerary, ${season}`,

  planTitle: (city: string, days: number, season: string) => `${city} Itinerary — ${days}-Day Plan, Hour by Hour (${season})`,
  planDesc: (city: string, days: number, stops: number, season: string) =>
    `An hour-by-hour ${days}-day ${city} itinerary: ${stops} stops, with food, sights and a Plan B for every day. Built for ${season}; on a shorter trip, start with the first days.`,
  planH1: (city: string) => `${city} itinerary`,
  planSub: (days: number) => `${days} days, hour by hour`,
  factDays: "Days",
  factStops: "Stops",
  factPerDay: "Per day",
  factFirst: "First stop",
  byline: "By TripWalkers · Updated:",
  answerTitle: "Short answer",
  answerLead: (city: string, days: number, season: string, stops: number) =>
    `The TripWalkers ${city} itinerary runs ${days} days and lays out ${stops} stops, hour by hour, for ${season}. The first three days:`,
  answerRest: (tripDays: number[], perDay: string) =>
    `Staying less? Start with the first days — TripWalkers uses the opening days of this plan for shorter trips too.${
      tripDays.length
        ? ` ${tripDays.length > 1 ? `Days ${joinAnd(tripDays, "en")} are day trips` : `Day ${tripDays[0]} is a day trip`} out of the city.`
        : ""
    } Food, entry fees and local transport come to about ${perDay} a day (excluding accommodation and flights).`,
  dayN: (n: number) => `Day ${n}`,
  dayTrip: "Day trip",
  daysOf: (city: string) => `Days of the ${city} itinerary`,
  daysNav: "Days",
  stopsN: (n: number) => `${n} ${n === 1 ? "stop" : "stops"}`,
  gap: (label: string) => `${label} · travel, break, free time`,
  gapAria: (label: string) => `${label} gap`,
  hours: "h",
  minutes: "min",
  free: "Free",
  perPerson: (m: string) => `≈ ${m} per person`,
  tickets: (p: string) => `Tickets: ${p}`,
  planB: (n: number) => `Plan B — if it's crowded or closed (${n})`,
  nichePre: "Hidden gem:",
  nicheHow: "How to get in",
  nicheTip: "Local tip",
  nicheWhen: "When",
  nicheContact: "Contact",
  transitPre: "Getting around:",
  transitTitle: (name: string) => `get ${an(name)} ${name}`,
  notesPre: "Good to know:",
  notesTitle: (city: string, n: number) => `${n} things that make ${an(city)} ${city} trip easier`,
  spendPre: "Spending:",
  spendTitle: (days: number, m: string) => `≈ ${m} per person for ${days} days`,
  spendFood: "Food",
  spendAttr: "Entry and tours",
  spendTransport: "Local transport",
  spendMisc: "Other",
  spendNote: "Excludes accommodation and flights. 2026 price estimate, per person.",
  listedPre: "On world lists:",
  listedTitle: (n: number) => `${n} ${n === 1 ? "place" : "places"} in this city`,
  rankN: (n: number) => `No. ${n}`,
  planCtaH: "We did the planning. You just pick the dates.",
  planCtaP: "TripWalkers rebuilds this route around your number of days, budget and pace — on a map, day by day, in your pocket.",
  nextTitle: "Your next trip",
  sameCity: (season: string) => `Same city · ${season}`,
  faqTitle: "Frequently asked questions",
  touristType: "Independent traveller",
  ldDay: (n: number, theme: string) => `Day ${n}: ${theme}`,
  appDesc: (city: string, n: number) =>
    `Ready-made itineraries for ${n} cities including ${city}; the app rebuilds each plan around your dates, number of days and budget.`,
  faq: {
    daysQ: (city: string) => `How many days do you need in ${city}?`,
    daysA: (days: number, tripDays: number[]) =>
      `This itinerary is built for ${days} days. With 3 days, do the first 3 — TripWalkers uses the opening days of the plan for shorter trips too.${
        tripDays.length ? ` The day trip is on day ${joinAnd(tripDays, "en")}; skip it on a short stay.` : ""
      }`,
    costQ: (city: string) => `How much does a day in ${city} cost?`,
    costA: (m: string) =>
      `In this plan, food, entry fees and local transport come to about ${m} per person per day. Accommodation and flights are not included. Figures are 2026 estimates.`,
    startQ: (city: string) => `What time should you start the day in ${city}?`,
    startA: (t: string | null) =>
      t
        ? `The first stop is at ${t}. Most days start early so you arrive before the crowds, and evenings end with dinner.`
        : "Days start in the morning and end with dinner.",
    bookQ: (city: string) => `Which places in ${city} should you book in advance?`,
    bookA: (items: string[]) => `In this plan, it's worth booking ahead for: ${items.join(", ")}.`,
    bookItem: (name: string, day: number) => `${name} (day ${day})`,
    seasonQ: "Which season is this itinerary for?",
    seasonA: (season: string, other: string) =>
      `This page covers ${season}. There is a separate plan for ${other}: opening hours, the sea and the weather change the route.`,
  },

  listMetaTitle: (h1: string, year: number | null) => `${h1}${year ? ` (${year})` : ""} — a photo guide`,
  listSub: (n: number, c: number) => `${n} places · ${c} countries`,
  listYear: (y: number) => `${y} list`,
  podium: "Top three",
  podiumUnranked: "Highlights",
  prevItem: "← Previous",
  nextItem: "Next →",
  heritageSource: (link: React.ReactNode) => (
    <>
      Source: {link}. This is not a ranking; the selection of 50 sites and their order are by the TripWalkers team. Photos from Wikimedia Commons under open licences; places without a photo show a location map (Natural Earth).
    </>
  ),
  heritageSpotSource: (link: React.ReactNode) => (
    <>
      Source: {link}. The selection is by the TripWalkers team; UNESCO does not rank its sites. Opening hours and prices can change; check before you go.
    </>
  ),
  listSource: (link: React.ReactNode) => (
    <>
      Ranking source: {link}. TripWalkers is not affiliated with this organisation; descriptions and tips are by the TripWalkers team. Photos from Wikimedia Commons under open licences; places without a photo show a location map (Natural Earth).
    </>
  ),
  listCtaH: "Add this list to your trip.",
  listCtaP: "TripWalkers fits the places on this list into your plan for the city you're visiting — and works out the time, the order and the route for you.",
  otherLists: "Other lists",
  placesN: (n: number) => `${n} places`,
  plansShelf: "Itineraries",
  plansShelfTitle: "Hour-by-hour trips",
  spotTitleHeritage: (name: string, place: string) => `${name} — ${place}: travel guide and tips`,
  spotTitleRanked: (name: string, city: string, h1: string, rank: number) => `${name}, ${city} — No. ${rank} on ${h1}`,
  why: "Why it's famous",
  signature: { bar: "What to drink", restaurant: "What to eat", heritage: "Don't miss" },
  tip: "Tip",
  address: "Address",
  openMaps: "Open in Maps",
  planLinkQ: (city: string) => `Heading to ${city}?`,
  planLinkT: (city: string) => `A 7-day, hour-by-hour ${city} itinerary →`,
  pagerAria: "Browse the list",
  prevRank: (n: number) => `← No. ${n}`,
  nextRank: (n: number) => `No. ${n} →`,
  spotCtaH: "Let's fit this place into your trip.",
  spotCtaP: "TripWalkers builds the plan around your dates and puts this place on the right day, at the right time.",
  sameCountry: (c: string) => `Also on the list from ${c}`,
  spotSource: (link: React.ReactNode) => (
    <>
      Ranking source: {link}. TripWalkers is not affiliated with this organisation. Opening hours and prices can change; check before you go.
    </>
  ),
  mapAlt: (name: string, place: string) => `Location of ${name}: ${place}`,
  photoBy: "Photo:",
  mapCaption: "Location map · Map data: Natural Earth",

  nfTitle: "This trip doesn't exist.",
  nfSub: "The address may be mistyped, or this city isn't here yet.",
  nfAll: "See all trips",
  nfPopular: "Popular trips",

  ogTagline: "itinerary, hour by hour",
  ogDays: (n: number) => `${n} days`,
  ogStops: (n: number) => `${n} stops`,
  ogPerDay: (m: string) => `≈ ${m} a day`,
  ogAlt: "TripWalkers itinerary",
};

export const DICT: Record<Locale, Dict> = { tr, en };
export const t = (locale: Locale) => DICT[locale];

export const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  tr: { food: "Yemek", landmark: "Simge yapı", nature: "Doğa", culture: "Kültür", shopping: "Çarşı" },
  en: { food: "Food", landmark: "Landmark", nature: "Nature", culture: "Culture", shopping: "Shopping" },
};

/** Liste sayfası başlığı + kısa tanım; anahtar = TR liste slug'ı. */
export const LIST_COPY: Record<Locale, Record<string, { h1: string; lead: string; tag: string }>> = {
  tr: {
    "dunyanin-en-iyi-50-bari": {
      h1: "Dünyanın en iyi 50 barı",
      lead: "2025 listesinin 50 barı: her biri için neden ünlü olduğu, ne içmen gerektiği ve kapıdan nasıl gireceğin.",
      tag: "Kokteyl",
    },
    "dunyanin-en-iyi-50-restorani": {
      h1: "Dünyanın en iyi 50 restoranı",
      lead: "2025 listesinin 50 restoranı: mutfağın hikâyesi, hangi menüyü seçeceğin ve rezervasyonun püf noktası.",
      tag: "Mutfak",
    },
    "unesco-ikonik-miraslar": {
      h1: "Ölmeden önce görülecek 50 UNESCO mirası",
      lead: "Machu Picchu'dan Kapadokya'ya 50 dünya mirası: neden ünlü, en iyi nasıl görülür, ne zaman gidilmez.",
      tag: "Dünya mirası",
    },
  },
  en: {
    "dunyanin-en-iyi-50-bari": {
      h1: "The world's 50 best bars",
      lead: "All 50 bars on the 2025 list: why each one is famous, what to order and how to get through the door.",
      tag: "Cocktails",
    },
    "dunyanin-en-iyi-50-restorani": {
      h1: "The world's 50 best restaurants",
      lead: "All 50 restaurants on the 2025 list: the story behind each kitchen, which menu to choose and the trick to getting a table.",
      tag: "Dining",
    },
    "unesco-ikonik-miraslar": {
      h1: "50 UNESCO World Heritage Sites to see before you die",
      lead: "From Machu Picchu to Cappadocia, 50 World Heritage Sites: why they're famous, how best to see them and when not to go.",
      tag: "World Heritage",
    },
  },
};
