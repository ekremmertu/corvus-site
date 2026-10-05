import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { localCities } from "@/lib/gezi";
import { fmtNumber, OG_LOCALE, ROUTES, t, type Locale } from "@/lib/gezi-i18n";
import CityBrowser from "@/components/gezi/CityBrowser";
import ListShelf from "@/components/gezi/ListShelf";
import LangSwitch from "@/components/gezi/LangSwitch";

export function indexMetadata(locale: Locale): Metadata {
  const d = t(locale);
  const self = ROUTES[locale].root;
  return {
    title: { absolute: d.indexTitle },
    description: d.indexDesc,
    alternates: { canonical: self, languages: { tr: ROUTES.tr.root, en: ROUTES.en.root } },
    openGraph: { type: "website", locale: OG_LOCALE[locale], siteName: "TripWalkers", url: self },
  };
}

export default function IndexView({ locale }: { locale: Locale }) {
  const d = t(locale);
  const root = ROUTES[locale].root;
  const list = localCities(locale);
  const pages = list.reduce((n, c) => n + c.seasons.length, 0);
  const stops = list.reduce((n, c) => n + c.seasons.reduce((m, s) => m + s.stops, 0), 0);
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: d.collectionName,
    url: `${SITE.url}${root}`,
    inLanguage: locale,
    hasPart: list.flatMap((c) => c.seasons.map((s) => ({ "@type": "TouristTrip", name: `${d.planH1(c.city)} (${s.label})`, url: `${SITE.url}${root}/${s.slug}` }))),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="gz-hub">
        <div className="gz-wrap">
          <nav className="gz-crumbs gz-mono" aria-label={d.crumbs}>
            <span>{d.crumbRoot}</span>
            <LangSwitch locale={locale} href={ROUTES[locale === "tr" ? "en" : "tr"].root} />
          </nav>
          <h1 className="gz-hub__title gz-display">{d.indexH1(list.length)}</h1>
          <p className="gz-hub__lead">{d.indexLead}</p>
          {pages ? (
            <p className="gz-hub__meta gz-mono">
              <span>{d.indexPlans(pages)}</span>
              <span>{d.indexSeasons}</span>
              <span>{d.indexStops(fmtNumber(stops, locale))}</span>
            </p>
          ) : null}
        </div>
      </header>
      <section className="gz-wrap gz-hubsec" aria-labelledby="listeler">
        <h2 id="listeler" className="gz-block__title gz-display">{d.indexLists}</h2>
        <ListShelf locale={locale} />
      </section>
      {list.length ? <CityBrowser cities={list} locale={locale} /> : null}
    </>
  );
}
