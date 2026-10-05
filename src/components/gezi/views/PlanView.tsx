import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import {
  appStoreHref, campaignOf, cities, fmtMinutes, GEZI_UPDATED, getPlan, money, otherSeason, planStats, relatedCities, type Plan,
} from "@/lib/gezi";
import { APP_STORE_URL, APP_STORE_URL_EN } from "@/lib/gezi-links";
import { fmtDate, OG_LOCALE, ROUTES, t, type Locale } from "@/lib/gezi-i18n";
import { spotsInCity, spotText } from "@/lib/liste";
import DayStrip from "@/components/gezi/DayStrip";
import DayNav from "@/components/gezi/DayNav";
import DaySection from "@/components/gezi/DaySection";
import LangSwitch from "@/components/gezi/LangSwitch";

const other = (l: Locale): Locale => (l === "tr" ? "en" : "tr");

/** TR + EN adresleri (karşılık yoksa yalnız kendi dili) — hreflang ve dil anahtarı buradan beslenir. */
export function planAlternates(plan: Plan) {
  const self = `${ROUTES[plan.lang].root}/${plan.slug}`;
  const alt = plan.altSlug ? `${ROUTES[other(plan.lang)].root}/${plan.altSlug}` : null;
  const languages: Record<string, string> = { [plan.lang]: self };
  if (alt) languages[other(plan.lang)] = alt;
  return { self, alt, languages };
}

export function planMetadata(slug: string, locale: Locale): Metadata {
  const plan = getPlan(slug, locale);
  if (!plan) return {};
  const d = t(locale);
  const s = planStats(plan);
  const title = d.planTitle(plan.city, plan.totalDays, plan.seasonLabel);
  const description = d.planDesc(plan.city, plan.totalDays, s.stops, plan.seasonLabel);
  const { self, languages } = planAlternates(plan);
  return {
    title,
    description,
    alternates: { canonical: self, languages },
    openGraph: { type: "article", locale: OG_LOCALE[locale], siteName: "TripWalkers", title, description, url: self },
    twitter: { card: "summary_large_image", title, description },
  };
}

function faqOf(plan: Plan) {
  const d = t(plan.lang);
  const s = planStats(plan);
  const next = otherSeason(plan);
  const m = money(s.perDay, plan.currency, plan.lang);
  const booked = plan.days.flatMap((day) => day.stops.filter((x) => x.bookingUrl).map((x) => d.faq.bookItem(x.name, day.index)));
  const items: { q: string; a: string }[] = [
    { q: d.faq.daysQ(plan.city), a: d.faq.daysA(plan.totalDays, s.tripDays) },
    { q: d.faq.costQ(plan.city), a: d.faq.costA(m) },
    { q: d.faq.startQ(plan.city), a: d.faq.startA(s.earliest !== null ? fmtMinutes(s.earliest) : null) },
  ];
  if (booked.length) items.push({ q: d.faq.bookQ(plan.city), a: d.faq.bookA(booked) });
  if (next) items.push({ q: d.faq.seasonQ, a: d.faq.seasonA(plan.seasonLabel, next.label) });
  return items;
}

function jsonLd(plan: Plan, faq: { q: string; a: string }[]) {
  const d = t(plan.lang);
  const root = `${SITE.url}${ROUTES[plan.lang].root}`;
  const url = `${root}/${plan.slug}`;
  const s = planStats(plan);
  const title = d.planTitle(plan.city, plan.totalDays, plan.seasonLabel);
  return [
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: title,
      description: d.planDesc(plan.city, plan.totalDays, s.stops, plan.seasonLabel),
      url,
      inLanguage: plan.lang,
      datePublished: GEZI_UPDATED,
      dateModified: GEZI_UPDATED,
      touristType: d.touristType,
      provider: { "@type": "Organization", name: "TripWalkers", url: SITE.url, parentOrganization: { "@type": "Organization", name: SITE.name } },
      itinerary: {
        "@type": "ItemList",
        numberOfItems: plan.days.length,
        itemListElement: plan.days.map((day) => ({
          "@type": "ListItem",
          position: day.index,
          item: {
            "@type": "ItemList",
            name: d.ldDay(day.index, day.theme),
            itemListElement: day.stops.map((x, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: { "@type": x.category === "food" ? "FoodEstablishment" : "TouristAttraction", name: x.name, description: x.tips || undefined },
            })),
          },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: "TripWalkers",
      operatingSystem: "iOS",
      applicationCategory: "TravelApplication",
      inLanguage: ["en", "tr"],
      url: plan.lang === "tr" ? APP_STORE_URL : APP_STORE_URL_EN,
      description: d.appDesc(plan.city, cities().length),
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: d.crumbRoot, item: root },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    },
  ];
}

export default function PlanView({ plan }: { plan: Plan }) {
  const locale = plan.lang;
  const d = t(locale);
  const root = ROUTES[locale].root;
  const s = planStats(plan);
  const faq = faqOf(plan);
  const next = otherSeason(plan);
  const related = relatedCities(plan);
  const listed = spotsInCity(plan.destKey).sort((a, b) => a.rank - b.rank);
  const { alt } = planAlternates(plan);
  const m = (n: number) => money(n, plan.currency, locale);
  const spendParts = [
    { key: "food", label: d.spendFood, color: "var(--ink)" },
    { key: "attractions", label: d.spendAttr, color: "var(--ink-3)" },
    { key: "transport", label: d.spendTransport, color: "var(--ink-2)" },
    { key: "misc", label: d.spendMisc, color: "var(--rule)" },
  ] as const;

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(plan, faq)) }} />

      <div className="gz-wrap">
        <header className="gz-head">
          <nav className="gz-crumbs gz-mono" aria-label={d.crumbs}>
            <Link href={root}>{d.crumbRoot}</Link>
            <span aria-hidden="true">/</span>
            <span>{plan.country}</span>
            <LangSwitch locale={locale} href={alt} />
          </nav>
          <div className="gz-head__grid">
            <div className="gz-head__title">
              <h1 className="gz-h1 gz-display">{d.planH1(plan.city)}</h1>
              <p className="gz-sub">
                {d.planSub(plan.totalDays)} · {[plan.region, plan.country].filter(Boolean).join(", ")}
                <span className="gz-season">{plan.seasonLabel}</span>
              </p>
              <dl className="gz-facts">
                <div className="gz-fact"><dt className="gz-mono">{d.factDays}</dt><dd>{plan.totalDays}</dd></div>
                <div className="gz-fact"><dt className="gz-mono">{d.factStops}</dt><dd>{s.stops}</dd></div>
                <div className="gz-fact"><dt className="gz-mono">{d.factPerDay}</dt><dd>≈ {m(s.perDay)}</dd></div>
                <div className="gz-fact"><dt className="gz-mono">{d.factFirst}</dt><dd>{s.earliest !== null ? fmtMinutes(s.earliest) : "—"}</dd></div>
              </dl>
              <p className="gz-byline gz-mono">
                {d.byline} <time dateTime={GEZI_UPDATED}>{fmtDate(GEZI_UPDATED, locale)}</time>
              </p>
            </div>
          </div>
          <DayStrip plan={plan} />
        </header>

        <section className="gz-answer" aria-label={d.answerTitle}>
          <h2 className="gz-answer__title">{d.answerTitle}</h2>
          <p className="gz-answer__text">{d.answerLead(plan.city, plan.totalDays, plan.seasonLabel, s.stops)}</p>
          <ol className="gz-answer__days">
            {plan.days.slice(0, 3).map((day) => (
              <li key={day.index}><b>{d.dayN(day.index)}</b> {day.theme}</li>
            ))}
          </ol>
          <p className="gz-answer__text">{d.answerRest(s.tripDays, m(s.perDay))}</p>
        </section>

        <div className="gz-body">
          <aside>
            <DayNav locale={locale} days={plan.days.map((day) => ({ index: day.index, theme: day.theme }))} />
          </aside>
          <div>
            {plan.days.map((day) => <DaySection key={day.index} day={day} currency={plan.currency} locale={locale} />)}

            {plan.niche ? (
              <section className="gz-block gz-niche" aria-labelledby="gizli-kose">
                <h2 id="gizli-kose" className="gz-block__title gz-display"><span className="gz-pre">{d.nichePre}</span> {plan.niche.name}</h2>
                {plan.niche.why_hidden ? <p className="gz-niche__lead">{plan.niche.why_hidden}</p> : null}
                <dl>
                  {plan.niche.access_instructions ? <div><dt>{d.nicheHow}</dt><dd>{plan.niche.access_instructions}</dd></div> : null}
                  {plan.niche.insider_tip ? <div><dt>{d.nicheTip}</dt><dd>{plan.niche.insider_tip}</dd></div> : null}
                  {plan.niche.season ? <div><dt>{d.nicheWhen}</dt><dd>{plan.niche.season}</dd></div> : null}
                  {plan.niche.local_contact ? <div><dt>{d.nicheContact}</dt><dd>{plan.niche.local_contact}</dd></div> : null}
                </dl>
              </section>
            ) : null}

            {plan.transit ? (
              <section className="gz-block" aria-labelledby="ulasim">
                <h2 id="ulasim" className="gz-block__title gz-display"><span className="gz-pre">{d.transitPre}</span> {d.transitTitle(plan.transit.name)}</h2>
                {plan.transit.why_chosen ? <div className="gz-transit"><p>{plan.transit.why_chosen}</p></div> : null}
              </section>
            ) : null}

            {plan.notes.length ? (
              <section className="gz-block" aria-labelledby="gitmeden">
                <h2 id="gitmeden" className="gz-block__title gz-display"><span className="gz-pre">{d.notesPre}</span> {d.notesTitle(plan.city, plan.notes.length)}</h2>
                <ol className="gz-notes">{plan.notes.map((n) => <li key={n}>{n}</li>)}</ol>
              </section>
            ) : null}

            {s.spend > 0 ? (
              <section className="gz-block" aria-labelledby="harcama">
                <h2 id="harcama" className="gz-block__title gz-display"><span className="gz-pre">{d.spendPre}</span> {d.spendTitle(plan.totalDays, m(s.spend))}</h2>
                <div className="gz-spend__bar" role="img" aria-label={spendParts.map((p) => `${p.label} ${m(plan.budget[p.key] ?? 0)}`).join(", ")}>
                  {spendParts.filter((p) => (plan.budget[p.key] ?? 0) > 0).map((p) => (
                    <i key={p.key} style={{ flex: plan.budget[p.key], background: p.color }} title={`${p.label}: ${m(plan.budget[p.key] ?? 0)}`} />
                  ))}
                </div>
                <ul className="gz-spend__list">
                  {spendParts.map((p) => (
                    <li key={p.key}>
                      <span><i style={{ background: p.color }} aria-hidden="true" />{p.label}</span>
                      <b>{m(plan.budget[p.key] ?? 0)}</b>
                    </li>
                  ))}
                </ul>
                <p className="gz-spend__note">{d.spendNote}</p>
              </section>
            ) : null}
          </div>
        </div>

        {listed.length ? (
          <section className="gz-block" aria-labelledby="listelerde">
            <h2 id="listelerde" className="gz-block__title gz-display"><span className="gz-pre">{d.listedPre}</span> {d.listedTitle(listed.length)}</h2>
            <div className="gz-links">
              {listed.map((x) => {
                const t2 = spotText(x, locale);
                return (
                  <Link key={x.slug} className="gz-link" href={`${ROUTES[locale].place}/${x.slug}`}>
                    <span className="gz-mono">{t2.ranked ? `${t2.listCopy.tag} · ${d.rankN(x.rank)}` : t2.listCopy.tag}</span>
                    <b>{t2.name}</b>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="gz-cta" aria-labelledby="uygulama">
          <div>
            <h2 id="uygulama" className="gz-display">{d.planCtaH}</h2>
            <p>{d.planCtaP}</p>
            <a className="gz-btn" href={appStoreHref(locale, campaignOf(locale, plan.slug))} rel="noopener">{d.cta}</a>
            <small>{d.ctaSmall}</small>
          </div>
          <img src="/gezi/maskot.webp" alt="" width={200} height={203} loading="lazy" decoding="async" />
        </section>

        {next || related.length ? (
          <section className="gz-block" aria-labelledby="diger">
            <h2 id="diger" className="gz-block__title gz-display">{d.nextTitle}</h2>
            <div className="gz-links">
              {next ? (
                <Link className="gz-link gz-link--season" href={`${root}/${next.slug}`}>
                  <span className="gz-mono">{d.sameCity(next.label)}</span>
                  <b>{plan.city}</b>
                </Link>
              ) : null}
              {related.map((c) => {
                const target = c.seasons.find((x) => x.season === plan.season) ?? c.seasons[0];
                if (!target) return null;
                return (
                  <Link key={c.destKey} className="gz-link" href={`${root}/${target.slug}`}>
                    <span className="gz-mono">{c.country} · {target.label}</span>
                    <b>{c.city}</b>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="gz-block" aria-labelledby="sss">
          <h2 id="sss" className="gz-block__title gz-display">{d.faqTitle}</h2>
          <div className="gz-faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
