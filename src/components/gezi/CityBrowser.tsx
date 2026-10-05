"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LocalCity } from "@/lib/gezi";
import { appStoreHref, campaignOf } from "@/lib/gezi-links";
import { ROUTES, t, type Locale } from "@/lib/gezi-i18n";

type Scope = "all" | "tr" | "world";

const fold = (s: string) =>
  s.toLocaleLowerCase("tr").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");

/** Filtre + arama istemcide; tüm şehir kartları HTML'de zaten var (JS'siz de tam liste görünür). */
export default function CityBrowser({ cities, locale }: { cities: LocalCity[]; locale: Locale }) {
  const d = t(locale);
  const root = ROUTES[locale].root;
  const [scope, setScope] = useState<Scope>("all");
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const needle = fold(q.trim());
    return cities.filter((c) => {
      if (scope === "tr" && !c.isTurkey) return false;
      if (scope === "world" && c.isTurkey) return false;
      if (!needle) return true;
      return fold(`${c.city} ${c.region ?? ""} ${c.country}`).includes(needle);
    });
  }, [cities, scope, q]);

  const trCount = cities.filter((c) => c.isTurkey).length;
  // Örnek şehirler yalnız bu dilde gerçekten olanlardan (boş sonuca götüren örnek olmasın)
  const preferred = ["rome", "kas", "tokyo"].map((k) => cities.find((c) => c.destKey === k)).filter((c) => c !== undefined);
  const examples = [...preferred, ...cities].filter((c, i, a) => a.indexOf(c) === i).slice(0, 3).map((c) => c.city).join(", ");
  const tabs: { id: Scope; label: string }[] = [
    { id: "all", label: `${d.tabAll} · ${cities.length}` },
    { id: "tr", label: `${d.tabTr} · ${trCount}` },
    { id: "world", label: `${d.tabWorld} · ${cities.length - trCount}` },
  ];

  return (
    <>
      <div className="gz-filter">
        <div className="gz-wrap gz-filter__in">
          {trCount && trCount < cities.length ? (
            <div className="gz-seg" role="group" aria-label={d.tabsAria}>
              {tabs.map((tab) => (
                <button key={tab.id} type="button" aria-pressed={scope === tab.id} onClick={() => setScope(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}
          <label className="sr-only" htmlFor="gz-ara">{d.searchLabel}</label>
          <input
            id="gz-ara"
            className="gz-search"
            type="search"
            placeholder={d.searchPh(examples)}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="gz-wrap">
        <p className="sr-only" aria-live="polite">{d.shown(shown.length)}</p>
        {shown.length ? (
          <ul className="gz-grid">
            {shown.map((c) => (
              <li key={c.destKey} className="gz-city">
                <p className="gz-city__place gz-mono">{[c.region, c.country].filter(Boolean).join(" · ")}</p>
                <h2>{c.city}</h2>
                <p className="gz-city__theme">{c.seasons[0]?.firstTheme}</p>
                <div className="gz-city__seasons">
                  {c.seasons.map((s) => (
                    <Link key={s.slug} href={`${root}/${s.slug}`} aria-label={d.cardAria(c.city, s.label)}>
                      {s.label} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="gz-empty">
            <p>{d.emptyQ(q)}</p>
            <p>{d.emptyBody}</p>
            <a className="gz-btn" href={appStoreHref(locale, campaignOf(locale, "arama"))} rel="noopener">{d.cta}</a>
          </div>
        )}
      </div>
    </>
  );
}
