"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { categories, type CategorySlug, type Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import { useScene } from "@/components/scene/SceneProvider";
import Scramble from "@/components/fx/Scramble";

export default function Hero({
  locale,
  d,
  counts,
}: {
  locale: Locale;
  d: Dict;
  counts: Record<CategorySlug, number>;
}) {
  const { active, setActive, next, prev } = useScene();
  const dragX = useRef<number | null>(null);
  const category = categories[active];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  function onPointerDown(e: React.PointerEvent) {
    dragX.current = e.clientX;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (dragX.current === null) return;
    const delta = e.clientX - dragX.current;
    if (Math.abs(delta) > 56) (delta < 0 ? next : prev)();
    dragX.current = null;
  }

  const count = counts[category.slug] ?? 0;

  return (
    <section
      className="relative grid min-h-[86svh] grid-rows-[auto_1fr_auto] gap-6 pb-14 pt-[calc(var(--nav-h)+18px)] touch-pan-y lg:min-h-[100svh]"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      aria-labelledby="hero-title"
    >
      {/* ── Top: positioning (left column, the scene owns the right) ── */}
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="lg:max-w-[54%]">
          <p className="eyebrow reveal is-visible">{d.hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="display mt-4 max-w-[15ch]"
            style={{ fontSize: "var(--type-display)" }}
          >
            <Scramble text={d.hero.title1} />{" "}
            <span className="display-italic" style={{ color: "var(--c-live)" }}>
              <Scramble text={d.hero.title2} delay={260} />
            </span>
          </h1>
          <p className="lede mt-5 max-w-[46ch] text-[15px] sm:text-base">
            {d.hero.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={`/${locale}/work`} className="btn btn-primary">
              {d.hero.ctaPrimary}
            </Link>
            <a href="#contact" className="btn btn-secondary">
              {d.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>

      {/* ── Middle: the 3D scene breathes here ─────────────── */}
      <div className="pointer-events-none min-h-[2vh] lg:min-h-[12vh]" />

      {/* ── Bottom: discipline carousel control ────────────── */}
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col items-center gap-5 lg:ml-auto lg:w-[46%] lg:max-w-[520px]">
          <div className="flex w-full max-w-[560px] items-center justify-between gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label={locale === "tr" ? "Önceki disiplin" : "Previous discipline"}
              className="glass grid h-11 w-11 shrink-0 place-items-center rounded-full text-dim transition-colors hover:text-[var(--c-live)]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="min-w-0 flex-1 text-center" aria-live="polite">
              <p
                key={category.slug}
                className="display text-[clamp(1.25rem,3.4vw,2rem)] uppercase"
              >
                {category.name[locale]}
              </p>
              <p className="eyebrow mt-2">{category.kicker[locale]}</p>
            </div>

            <button
              type="button"
              onClick={next}
              aria-label={locale === "tr" ? "Sonraki disiplin" : "Next discipline"}
              className="glass grid h-11 w-11 shrink-0 place-items-center rounded-full text-dim transition-colors hover:text-[var(--c-live)]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {categories.map((c, i) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-label={c.name[locale]}
                aria-current={i === active}
                className="group grid h-6 place-items-center px-1"
              >
                <span
                  className="block h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 28 : 8,
                    background: i === active ? c.accent : "rgba(255,255,255,0.24)",
                  }}
                />
              </button>
            ))}
          </div>

          <p className="eyebrow text-center text-balance">
            <span>{count} {d.categories.projectsIn}</span>
            <span className="hidden sm:inline"> · {d.hero.hint}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
