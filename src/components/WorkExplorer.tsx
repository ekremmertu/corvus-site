"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  categories,
  type CardProject,
  type CategorySlug,
  type Locale,
} from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import { useScene } from "@/components/scene/SceneProvider";
import ProjectCard from "@/components/ProjectCard";

type Filter = CategorySlug | "all";

export default function WorkExplorer({
  locale,
  d,
  cards,
}: {
  locale: Locale;
  d: Dict;
  cards: CardProject[];
}) {
  const raw = useSearchParams().get("d");
  const initial: Filter =
    raw && categories.some((c) => c.slug === raw) ? (raw as CategorySlug) : "all";
  const [filter, setFilter] = useState<Filter>(initial);
  const { setActive, exitRef, stageRef } = useScene();

  // On the work page the cards own the frame — the scene fully clears out,
  // the discipline halo alone signals which filter is active.
  useEffect(() => {
    stageRef.current = 0;
    exitRef.current = 1;
    return () => {
      exitRef.current = 0;
    };
  }, [exitRef, stageRef]);

  useEffect(() => {
    if (filter === "all") return;
    const index = categories.findIndex((c) => c.slug === filter);
    if (index >= 0) setActive(index);
  }, [filter, setActive]);

  const list = useMemo(
    () => (filter === "all" ? cards.filter((p) => !p.dup) : cards.filter((p) => p.category === filter)),
    [filter]
  );

  const options: { key: Filter; label: string; accent?: string }[] = [
    { key: "all", label: d.work.all },
    ...categories.map((c) => ({
      key: c.slug as Filter,
      label: c.name[locale],
      accent: c.accent,
    })),
  ];

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 pb-28 sm:px-8">
      <div
        className="flex flex-wrap gap-2 border-b border-[color:var(--c-border)] pb-8"
        role="tablist"
        aria-label={d.work.title}
      >
        {options.map((o) => {
          const on = o.key === filter;
          return (
            <button
              key={o.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setFilter(o.key)}
              className="rounded-[var(--radius-pill)] border px-4 py-2 text-sm transition-colors duration-200"
              style={{
                borderColor: on ? o.accent ?? "var(--c-live)" : "var(--c-border)",
                background: on ? o.accent ?? "var(--c-live)" : "transparent",
                color: on ? "#05060a" : "var(--c-text-dim)",
              }}
            >
              {o.label}
              <span className="mono ml-2 text-[11px] opacity-70">
                {o.key === "all"
                  ? cards.filter((p) => !p.dup).length
                  : cards.filter((p) => p.category === o.key).length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <ProjectCard key={`${p.category}-${p.slug}`} project={p} locale={locale} index={i} d={d} />
        ))}
      </div>
      {list.length === 0 && <p className="lede mt-10">{d.work.empty}</p>}
    </div>
  );
}
