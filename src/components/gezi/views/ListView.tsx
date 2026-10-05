import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { allSlugs, GEZI_UPDATED } from "@/lib/gezi";
import { getList, listSlug, lists, spotsOf, spotText, type CuratedList } from "@/lib/liste";
import { LIST_COPY, OG_LOCALE, ROUTES, t, type Locale } from "@/lib/gezi-i18n";
import SpotVisual from "@/components/gezi/SpotVisual";
import HeaderCta from "@/components/gezi/HeaderCta";
import LangSwitch from "@/components/gezi/LangSwitch";

const other = (l: Locale): Locale => (l === "tr" ? "en" : "tr");

export function listAlternates(list: CuratedList, locale: Locale) {
  const self = `${ROUTES[locale].list}/${listSlug(list, locale)}`;
  const alt = `${ROUTES[other(locale)].list}/${listSlug(list, other(locale))}`;
  return { self, alt, languages: { [locale]: self, [other(locale)]: alt } };
}

export function listMetadata(slug: string, locale: Locale): Metadata {
  const list = getList(slug, locale);
  if (!list) return {};
  const copy = LIST_COPY[locale][list.slug];
  const title = t(locale).listMetaTitle(copy.h1, list.year);
  const { self, languages } = listAlternates(list, locale);
  return {
    title,
    description: copy.lead,
    alternates: { canonical: self, languages },
    openGraph: { type: "article", locale: OG_LOCALE[locale], siteName: "TripWalkers", title, description: copy.lead, url: self },
  };
}

export default function ListView({ list, locale }: { list: CuratedList; locale: Locale }) {
  const d = t(locale);
  const r = ROUTES[locale];
  const copy = LIST_COPY[locale][list.slug];
  const spots = spotsOf(list);
  const [first, second, third, ...rest] = spots;
  const others = lists().filter((l) => l.slug !== list.slug);
  const countries = new Set(spots.map((s) => s.countryCode)).size;
  const { self, alt } = listAlternates(list, locale);
  const hasPlans = allSlugs(locale).length > 0;
  const sourceName = locale === "tr" ? list.source.name : list.sourceEn;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: copy.h1,
      description: copy.lead,
      url: `${SITE.url}${self}`,
      inLanguage: locale,
      numberOfItems: spots.length,
      dateModified: GEZI_UPDATED,
      itemListOrder: list.kind === "heritage" ? "https://schema.org/ItemListUnordered" : "https://schema.org/ItemListOrderAscending",
      itemListElement: spots.map((s) => ({ "@type": "ListItem", position: s.rank, name: spotText(s, locale).name, url: `${SITE.url}${r.place}/${s.slug}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: d.crumbRoot, item: `${SITE.url}${r.root}` },
        { "@type": "ListItem", position: 2, name: copy.h1, item: `${SITE.url}${self}` },
      ],
    },
  ];

  const card = (s: (typeof spots)[number], eager = false) => {
    const x = spotText(s, locale);
    return (
      <Link href={`${r.place}/${s.slug}`} className="gz-spot">
        <SpotVisual spot={s} locale={locale} eager={eager} />
        <span className="gz-spot__body">
          <span className="gz-spot__place gz-mono">{x.placeDot}</span>
          <span className="gz-spot__name gz-display">{x.name}</span>
          <span className="gz-spot__why">{x.why}</span>
        </span>
      </Link>
    );
  };

  return (
    <article className="gz-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="gz-head">
        <nav className="gz-crumbs gz-mono" aria-label={d.crumbs}>
          <Link href={r.root}>{d.crumbRoot}</Link>
          <span aria-hidden="true">/</span>
          <span>{d.crumbLists}</span>
          <LangSwitch locale={locale} href={alt} />
        </nav>
        <h1 className="gz-h1 gz-display">{copy.h1}</h1>
        <p className="gz-sub">
          {d.listSub(spots.length, countries)}
          {list.year ? <span className="gz-season">{d.listYear(list.year)}</span> : null}
        </p>
        <p className="gz-lead">{copy.lead}</p>
      </header>

      {first && second && third ? (
        <ol className="gz-podium" aria-label={list.kind === "heritage" ? d.podiumUnranked : d.podium}>
          {[first, second, third].map((s, i) => (
            <li key={s.slug} className={i === 0 ? "gz-podium__first" : undefined}>{card(s, i === 0)}</li>
          ))}
        </ol>
      ) : null}

      <ol className="gz-spots" start={4}>
        {rest.map((s) => <li key={s.slug}>{card(s)}</li>)}
      </ol>

      <p className="gz-source">
        {(list.kind === "heritage" ? d.heritageSource : d.listSource)(<a href={list.source.url} rel="nofollow noopener" target="_blank">{sourceName}</a>)}
      </p>

      <section className="gz-cta" aria-labelledby="uygulama">
        <div>
          <h2 id="uygulama" className="gz-display">{d.listCtaH}</h2>
          <p>{d.listCtaP}</p>
          <HeaderCta locale={locale} className="gz-btn" />
          <small>{d.ctaSmall}</small>
        </div>
        <img src="/gezi/maskot.webp" alt="" width={200} height={203} loading="lazy" decoding="async" />
      </section>

      <section className="gz-block" aria-labelledby="diger-listeler">
        <h2 id="diger-listeler" className="gz-block__title gz-display">{d.otherLists}</h2>
        <div className="gz-links">
          {others.map((l) => (
            <Link key={l.slug} className="gz-link" href={`${r.list}/${listSlug(l, locale)}`}>
              <span className="gz-mono">{LIST_COPY[locale][l.slug].tag} · {d.placesN(l.spots.length)}</span>
              <b>{LIST_COPY[locale][l.slug].h1}</b>
            </Link>
          ))}
          {hasPlans ? (
            <Link className="gz-link gz-link--season" href={r.root}>
              <span className="gz-mono">{d.plansShelf}</span>
              <b>{d.plansShelfTitle}</b>
            </Link>
          ) : null}
        </div>
      </section>
    </article>
  );
}
