"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, type CardProject, type CategorySlug, type Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import ProjectCard from "@/components/ProjectCard";

type Filter = CategorySlug | "all";

export default function WorkExplorer({ locale, d, cards }: { locale: Locale; d: Dict; cards: CardProject[] }) {
  const raw = useSearchParams().get("d");
  const initial: Filter = raw && categories.some((c) => c.slug === raw) ? (raw as CategorySlug) : "all";
  const [filter, setFilter] = useState<Filter>(initial);

  const list = useMemo(() => (filter === "all" ? cards.filter((p) => !p.dup) : cards.filter((p) => p.category === filter)), [filter, cards]);

  const options: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: d.work.all, count: cards.filter((p) => !p.dup).length },
    ...categories.map((c) => ({ key: c.slug as Filter, label: c.name[locale], count: cards.filter((p) => p.category === c.slug).length })),
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
      </div>
      <div className="grid-work" role="tabpanel">
        {list.map((p, i) => (
          <ProjectCard
            key={`${p.category}-${p.slug}`}
            project={p}
            locale={locale}
            d={d}
            mark={i === 0 || (Boolean(p.veil) && list.findIndex((x) => x.veil) === i)}
          />
        ))}
      </div>
      {list.length === 0 && <p className="lede">{d.work.empty}</p>}
    </div>
  );
}
