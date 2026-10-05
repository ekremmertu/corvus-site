import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { GEZI_UPDATED } from "@/lib/gezi";
import { getList, getSpot, listSlug, mapsUrl, spotsOf, spotText, type Spot } from "@/lib/liste";
import { LIST_COPY, OG_LOCALE, ROUTES, t, type Locale } from "@/lib/gezi-i18n";
import SpotVisual from "@/components/gezi/SpotVisual";
import HeaderCta from "@/components/gezi/HeaderCta";
import LangSwitch from "@/components/gezi/LangSwitch";

const SCHEMA_TYPE: Record<Spot["kind"], string> = { bar: "BarOrPub", restaurant: "Restaurant", heritage: "TouristAttraction" };
const other = (l: Locale): Locale => (l === "tr" ? "en" : "tr");

function titleOf(s: Spot, locale: Locale) {
  const d = t(locale);
  const x = spotText(s, locale);
  if (s.kind === "heritage") return d.spotTitleHeritage(x.name, x.place);
  const list = getList(s.listSlug);
  const ref = locale === "tr" ? x.listCopy.h1 : list?.sourceEn ?? x.listCopy.h1;
  return d.spotTitleRanked(s.name, x.city, ref, s.rank);
}

export function spotMetadata(slug: string, locale: Locale): Metadata {
  const s = getSpot(slug);
  if (!s) return {};
  const x = spotText(s, locale);
  const title = titleOf(s, locale);
  const description = `${x.why} ${x.tip}`.slice(0, 158);
  const self = `${ROUTES[locale].place}/${s.slug}`;
  return {
    title: { absolute: `${title} · TripWalkers` },
    description,
    alternates: { canonical: self, languages: { [locale]: self, [other(locale)]: `${ROUTES[other(locale)].place}/${s.slug}` } },
    openGraph: {
      type: "article", locale: OG_LOCALE[locale], siteName: "TripWalkers", title, description, url: self,
      images: s.photo ? [{ url: `${s.photo.src}-1200.webp`, alt: x.caption }] : undefined,
    },
  };
}

export default function SpotView({ spot: s, locale }: { spot: Spot; locale: Locale }) {
  const d = t(locale);
  const r = ROUTES[locale];
  const list = getList(s.listSlug);
  if (!list) return null;
  const x = spotText(s, locale);
  const copy = LIST_COPY[locale][list.slug];
  const all = spotsOf(list);
  const prev = all.find((y) => y.rank === s.rank - 1);
  const next = all.find((y) => y.rank === s.rank + 1);
  const sameCountry = all.filter((y) => y.countryCode === s.countryCode && y.slug !== s.slug).slice(0, 4);
  const url = `${SITE.url}${r.place}/${s.slug}`;
  const listHref = `${r.list}/${listSlug(list, locale)}`;
  const sourceName = locale === "tr" ? list.source.name : list.sourceEn;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": SCHEMA_TYPE[s.kind],
      name: x.name,
      alternateName: x.name !== s.name ? s.name : undefined,
      description: x.why,
      url,
      address: { "@type": "PostalAddress", streetAddress: s.address, addressLocality: s.city, addressCountry: s.countryCode },
      geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng },
      image: s.photo ? `${SITE.url}${s.photo.src}-1200.webp` : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: titleOf(s, locale),
      url,
      inLanguage: locale,
      dateModified: GEZI_UPDATED,
      publisher: { "@type": "Organization", name: "TripWalkers", url: SITE.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: d.crumbRoot, item: `${SITE.url}${r.root}` },
        { "@type": "ListItem", position: 2, name: copy.h1, item: `${SITE.url}${listHref}` },
        { "@type": "ListItem", position: 3, name: x.name, item: url },
      ],
    },
  ];

  return (
    <article className="gz-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="gz-head gz-head--spot">
        <nav className="gz-crumbs gz-mono" aria-label={d.crumbs}>
          <Link href={r.root}>{d.crumbRoot}</Link>
          <span aria-hidden="true">/</span>
          <Link href={listHref}>{copy.h1}</Link>
          <LangSwitch locale={locale} href={`${ROUTES[other(locale)].place}/${s.slug}`} />
        </nav>
        <h1 className="gz-h1 gz-display">{x.name}</h1>
        <p className="gz-sub">
          {x.place}
          <span className="gz-season">{x.ranked ? `${copy.tag} · ${d.rankN(s.rank)}` : copy.tag}</span>
        </p>
      </header>

      <SpotVisual spot={s} locale={locale} size="hero" eager />

      <div className="gz-spotbody">
        <section className="gz-answer" aria-labelledby="neden">
          <h2 id="neden" className="gz-answer__title">{d.why}</h2>
          <p className="gz-answer__text">{x.why}</p>
        </section>

        <dl className="gz-spotfacts">
          <div>
            <dt>{d.signature[s.kind]}</dt>
            <dd>{x.signature}</dd>
          </div>
          <div>
            <dt>{d.tip}</dt>
            <dd>{x.tip}</dd>
          </div>
          <div>
            <dt>{d.address}</dt>
            <dd>
              {s.address}
              <a className="gz-book" href={mapsUrl(s)} rel="noopener" target="_blank">{d.openMaps} <span aria-hidden="true">↗</span></a>
            </dd>
          </div>
        </dl>

        {x.planSlug && x.planCity ? (
          <Link className="gz-planlink" href={`${r.root}/${x.planSlug}`}>
            <span className="gz-mono">{d.planLinkQ(x.planCity)}</span>
            <b className="gz-display">{d.planLinkT(x.planCity)}</b>
          </Link>
        ) : null}

        <nav className="gz-pager" aria-label={d.pagerAria}>
          {prev ? (
            <Link href={`${r.place}/${prev.slug}`} className="gz-pager__item">
              <span className="gz-mono">{x.ranked ? d.prevRank(prev.rank) : d.prevItem}</span>
              <b>{spotText(prev, locale).name}</b>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`${r.place}/${next.slug}`} className="gz-pager__item gz-pager__item--next">
              <span className="gz-mono">{x.ranked ? d.nextRank(next.rank) : d.nextItem}</span>
              <b>{spotText(next, locale).name}</b>
            </Link>
          ) : <span />}
        </nav>
      </div>

      <section className="gz-cta" aria-labelledby="uygulama">
        <div>
          <h2 id="uygulama" className="gz-display">{d.spotCtaH}</h2>
          <p>{d.spotCtaP}</p>
          <HeaderCta locale={locale} className="gz-btn" />
          <small>{d.ctaSmall}</small>
        </div>
        <img src="/gezi/maskot.webp" alt="" width={200} height={203} loading="lazy" decoding="async" />
      </section>

      {sameCountry.length ? (
        <section className="gz-block" aria-labelledby="ayni-ulke">
          <h2 id="ayni-ulke" className="gz-block__title gz-display">{d.sameCountry(x.country)}</h2>
          <div className="gz-links">
            {sameCountry.map((y) => (
              <Link key={y.slug} className="gz-link" href={`${r.place}/${y.slug}`}>
                <span className="gz-mono">{x.ranked ? `${d.rankN(y.rank)} · ${spotText(y, locale).city}` : spotText(y, locale).city}</span>
                <b>{spotText(y, locale).name}</b>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="gz-source">
        {(x.ranked ? d.spotSource : d.heritageSpotSource)(<a href={list.source.url} rel="nofollow noopener" target="_blank">{sourceName}</a>)}
      </p>
    </article>
  );
}
