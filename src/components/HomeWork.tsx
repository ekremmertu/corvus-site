"use client";

import Link from "next/link";
import { categories, projectsByCategory, type Locale } from "@/data/projects";
import type { Dict } from "@/i18n/dict";
import { useScene } from "@/components/scene/SceneProvider";
import ProjectCard from "@/components/ProjectCard";

export default function HomeWork({ locale, d }: { locale: Locale; d: Dict }) {
  const { active, setActive } = useScene();
  const category = categories[active];
  const list = projectsByCategory(category.slug);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative bg-[color:var(--c-bg)]/86 backdrop-blur-[2px]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{d.categories.title}</p>
            <h2 id="work-title" className="display mt-4" style={{ fontSize: "var(--type-h1)" }}>
              {d.work.title}
            </h2>
            <p className="lede mt-4 text-[15px]">{d.work.sub}</p>
          </div>
          <Link href={`/${locale}/work`} className="btn btn-secondary">
            {d.categories.viewAll}
          </Link>
        </div>

        {/* Discipline switcher — stays in sync with the 3D scene */}
        <div
          className="mt-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label={d.categories.title}
        >
          {categories.map((c, i) => {
            const on = i === active;
            return (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className="rounded-[var(--radius-pill)] border px-4 py-2 text-sm transition-colors duration-200"
                style={{
                  borderColor: on ? c.accent : "var(--c-border)",
                  color: on ? "#05060a" : "var(--c-text-dim)",
                  background: on ? c.accent : "transparent",
                }}
              >
                {c.name[locale]}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.length === 0 && <p className="lede">{d.work.empty}</p>}
          {list.map((p, i) => (
            <ProjectCard key={p.slug} project={p} locale={locale} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
