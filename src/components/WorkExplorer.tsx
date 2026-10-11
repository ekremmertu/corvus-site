"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, type CardProject, type CategorySlug, type Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import ProjectCard from "@/components/ProjectCard";
import SectionLink from "@/components/SectionLink";
import FixStar from "@/components/fx/FixStar";

type Filter = CategorySlug | "all";

/**
 * Vitrin üç katlı (hakem 12.10.2026): ürün sahnesi olan kartlar üstte, görselsizler kısa kart ızgarasında,
 * kilitli kartlar tek "Yolda" şeridinde — boş kilit kutuları ve görselsiz uzun gövdeler vitrini sulandırıyordu.
 */
/**
 * Satır satır yerleşimi dener; 3 sütunda boşluk bırakmayan geniş kart seçimini döndürür.
 * Sıra: ilk kart geniş + web kartları → ilk kart geniş + herhangi kart → ilk kart normal (aynı iki havuz).
 */
function pickWide(staged: CardProject[]): Set<string> {
  const n = staged.length;
  const rest = staged.map((_, i) => i).slice(1).reverse();
  const webs = rest.filter((i) => staged[i].stage?.kind === "web");
  const combos = (from: number[], k: number): number[][] =>
    k === 0 ? [[]] : from.flatMap((x, i) => combos(from.slice(i + 1), k - 1).map((c) => [x, ...c]));
  const fits = (w: Set<number>) => {
    let col = 0;
    for (let i = 0; i < n; i++) {
      const span = w.has(i) ? 2 : 1;
      if (col + span > 3) return false;
      col = (col + span) % 3;
    }
    return col === 0;
  };
  for (const firstWide of [true, false]) {
    const k = (3 - ((n + (firstWide ? 1 : 0)) % 3)) % 3;
    for (const pool of [webs, rest]) {
      const hit = combos(pool, k)
        .map((c) => new Set(firstWide ? [0, ...c] : c))
        .find(fits);
      if (hit) return new Set([...hit].map((i) => staged[i].slug));
    }
  }
  return new Set();
}

export default function WorkExplorer({ locale, d, cards }: { locale: Locale; d: Dict; cards: CardProject[] }) {
  // Sunucu her zaman "Tümü"nü çizer (kartlar HTML'de olsun — hakem 13/20); ?d= filtresi yüklendikten sonra uygulanır.
  const [filter, setFilter] = useState<Filter>("all");
  const [openPlain, setOpenPlain] = useState(false);
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("d");
    if (raw && categories.some((c) => c.slug === raw)) setFilter(raw as CategorySlug);
  }, []);

  // Her kart yalnız kendi kategorisinde: sekme sayıları "Tümü" ile toplanır.
  const own = useMemo(() => cards.filter((p) => !p.dup), [cards]);
  const list = useMemo(() => (filter === "all" ? own : own.filter((p) => p.category === filter)), [filter, own]);
  const staged = list.filter((p) => !p.veil && p.stage);
  const plain = list.filter((p) => !p.veil && !p.stage);
  const veiled = list.filter((p) => p.veil);
  const soon = veiled.filter((p) => p.veil === "soon").length;
  const nda = veiled.length - soon;
  // İlk kart 2 sütun; 3 sütunlu ızgarada son satır yarım kalmasın diye gereken kadar kart da 2 sütuna yayılır.
  const wide = pickWide(staged);

  const options: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: d.work.all, count: own.length },
    ...categories.map((c) => ({ key: c.slug as Filter, label: c.name[locale], count: own.filter((p) => p.category === c.slug).length })),
  ];

  return (
    <div className="wrap">
      <div className="tabs" role="tablist" aria-label={d.work.title}>
        {options.map((o) => (
          <button key={o.key} type="button" role="tab" aria-selected={o.key === filter} className="tab" onClick={() => setFilter(o.key)}>
            {o.label}
            <span className="c">{o.count}</span>
          </button>
        ))}
        <FixStar n={15} />
        <FixStar n={14} />
      </div>
      <div role="tabpanel">
        {staged.length > 0 && (
          <div className="grid-work">
            {staged.map((p, i) => (
              <ProjectCard key={`${p.category}-${p.slug}`} project={p} locale={locale} d={d} mark={i === 0} big={wide.has(p.slug) ? "wide" : undefined} eager={i < 2} />
            ))}
          </div>
        )}
        {plain.length > 0 && (
          <>
            {staged.length > 0 && <h2 className="work-sub">{d.work.more}</h2>}
            <div className={`grid-work grid-plain${openPlain ? " open" : ""}`}>
              {plain.map((p) => (
                <ProjectCard key={`${p.category}-${p.slug}`} project={p} locale={locale} d={d} />
              ))}
            </div>
            {plain.length > 3 && !openPlain && (
              <button type="button" className="plain-more" onClick={() => setOpenPlain(true)}>
                {d.work.showAll} ({plain.length})
              </button>
            )}
          </>
        )}
        {veiled.length > 0 && (
          <section className="way-strip" aria-label={d.work.onTheWay}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            </svg>
            <div>
              <h2>{d.work.onTheWay}</h2>
              <p>{[soon > 0 && (soon === 1 ? d.work.waySoon1 : d.work.waySoonN).replace("{n}", String(soon)), nda > 0 && (nda === 1 ? d.work.wayNda1 : d.work.wayNdaN).replace("{n}", String(nda))].filter(Boolean).join(" · ")}</p>
            </div>
            <ul>
              {categories
                .map((c) => ({ c, n: veiled.filter((p) => p.category === c.slug).length }))
                .filter((x) => x.n > 0)
                .map(({ c, n }) => (
                  <li key={c.slug}>
                    {c.name[locale]}
                    <b>{n}</b>
                  </li>
                ))}
            </ul>
          </section>
        )}
        {list.length === 0 && <p className="lede">{d.work.empty}</p>}
      </div>
      <section className="work-end">
        <h2>{d.work.endTitle}</h2>
        <p>{d.work.endSub}</p>
        <SectionLink locale={locale} id="contact" className="work-end-cta">
          {d.work.endCta} →
        </SectionLink>
      </section>
    </div>
  );
}
