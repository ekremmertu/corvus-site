"use client";

import { useEffect, useRef, useState } from "react";
import { categories, type Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import { useScene } from "@/components/scene/SceneProvider";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Share of the pinned scroll spent easing in / out of the stage. */
const ENTER = 0.14;
const EXIT = 0.1;

export default function DisciplineStage({ locale, d }: { locale: Locale; d: Dict }) {
  const { active, stageRef, stopRef, exitRef } = useScene();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [stop, setStop] = useState(0);
  const category = categories[active];
  const stops = category.stops;

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) {
        // Mobile / reduced-motion layout: no pinned stage, no scene choreography.
        stageRef.current = 0;
        exitRef.current = 0;
        return;
      }
      const rect = el.getBoundingClientRect();
      const total = Math.max(el.offsetHeight - window.innerHeight, 1);
      const p = clamp(-rect.top / total, 0, 1);

      stageRef.current = smooth(clamp(p / ENTER, 0, 1));
      exitRef.current = clamp((p - (1 - EXIT)) / EXIT, 0, 1);

      const span = 1 - ENTER - EXIT;
      const raw = clamp((p - ENTER) / span, 0, 0.9999) * stops.length;
      stopRef.current = raw;

      const index = Math.min(stops.length - 1, Math.floor(raw));
      setStop((prev) => (prev === index ? prev : index));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stageRef, stopRef, exitRef, stops.length, active]);

  const current = stops[stop] ?? stops[0];

  return (
    <section id="disciplines" aria-labelledby="discipline-title">
      {/* ── Desktop: one pinned scene, four content stops ─────────── */}
      <div ref={wrapRef} className="relative hidden h-[340vh] lg:block">
        <div className="sticky top-0 grid h-[100svh] items-center">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 gap-16 px-8">
            <div>
              <p className="eyebrow">
                {String(category.index + 1).padStart(2, "0")} — {category.name[locale]}
              </p>
              <h2
                id="discipline-title"
                className="display mt-4 max-w-[14ch]"
                style={{ fontSize: "var(--type-h1)" }}
              >
                {category.headline[locale]}
              </h2>
              <p className="lede mt-5 text-[15px]">{category.manifesto[locale]}</p>

              <div className="mt-10 border-l border-[color:var(--c-border)] pl-6">
                <div key={`${category.slug}-${stop}`} className="animate-[fadeUp_.5s_ease]">
                  <p className="eyebrow" style={{ color: "var(--c-live)" }}>
                    {String(stop + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")}
                  </p>
                  <h3 className="display mt-3" style={{ fontSize: "var(--type-h2)" }}>
                    {current.title[locale]}
                  </h3>
                  <p className="lede mt-3 max-w-[46ch] text-[15px]">
                    {current.body[locale]}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex gap-2" aria-hidden>
                {stops.map((s, i) => (
                  <span
                    key={s.title.en}
                    className="h-[3px] flex-1 rounded-full transition-all duration-500"
                    style={{
                      background:
                        i <= stop ? "var(--c-live)" : "rgba(255,255,255,0.14)",
                      opacity: i <= stop ? 1 : 0.6,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right column is deliberately empty — the 3D object owns it. */}
            <div aria-hidden />
          </div>
        </div>
      </div>

      {/* ── Mobile: the same content, honestly flat ────────────────── */}
      <div className="mx-auto w-full max-w-[1240px] px-5 py-20 lg:hidden">
        <p className="eyebrow">
          {String(category.index + 1).padStart(2, "0")} — {category.name[locale]}
        </p>
        <h2 className="display mt-4" style={{ fontSize: "var(--type-h1)" }}>
          {category.headline[locale]}
        </h2>
        <p className="lede mt-4 text-[15px]">{category.manifesto[locale]}</p>
        <ol className="mt-10 space-y-8">
          {stops.map((s, i) => (
            <li key={s.title.en} className="reveal border-l border-[color:var(--c-border)] pl-5">
              <p className="eyebrow" style={{ color: "var(--c-live)" }}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display mt-2 text-xl">{s.title[locale]}</h3>
              <p className="lede mt-2 text-[15px]">{s.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>

      <span className="sr-only">{d.categories.sub}</span>
    </section>
  );
}
