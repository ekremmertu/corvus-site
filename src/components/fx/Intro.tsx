"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/taxonomy";
import { CORVUS_ASCII } from "./corvusAscii";

/**
 * Terminal açılışı — sistem güncellemesi metaforu.
 * Her sayfa yüklemesinde oynar; atlamak için Skip / ESC / Enter / Space / tıklama.
 * Sistem satırları bilinçli olarak İngilizce (terminaller İngilizcedir);
 * yalnızca içerik satırı lokalize edilir.
 */
type Line = { t: string; cps: number; after: number; inv?: boolean };

const SCRIPT: Record<Locale, Line[]> = {
  en: [
    { t: "/* corvus.systems", cps: 46, after: 160 },
    { t: "", cps: 999, after: 60 },
    { t: "    ...error: PORTFOLIO NOT LOADED", cps: 150, after: 90 },
    { t: "    A problem has been detected", cps: 150, after: 80 },
    { t: "    : 34 products / 1 screen", cps: 150, after: 240 },
    { t: "", cps: 999, after: 60 },
    { t: "Set System Mode to: SHIPPING", cps: 170, after: 100 },
    { t: "    *** Too many handoffs ***", cps: 190, after: 180 },
    { t: "", cps: 999, after: 60 },
    { t: "Enough text ** see it", cps: 62, after: 460, inv: true },
  ],
  tr: [
    { t: "/* corvus.systems", cps: 46, after: 160 },
    { t: "", cps: 999, after: 60 },
    { t: "    ...error: PORTFOLIO NOT LOADED", cps: 150, after: 90 },
    { t: "    A problem has been detected", cps: 150, after: 80 },
    { t: "    : 34 ürün / 1 ekran", cps: 150, after: 240 },
    { t: "", cps: 999, after: 60 },
    { t: "Set System Mode to: SHIPPING", cps: 170, after: 100 },
    { t: "    *** Çok fazla aracı ***", cps: 190, after: 180 },
    { t: "", cps: 999, after: 60 },
    { t: "Enough text ** gör onu", cps: 62, after: 460, inv: true },
  ],
};

const MARK_REVEAL_MS = 620; // ASCII kuzgunun satır satır belirme süresi
const HOLD_MS = 420; // logo ekranda kalma
const FADE_MS = 380;

export default function Intro({ locale }: { locale: Locale }) {
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [current, setCurrent] = useState<Line | null>(null);
  const [markStep, setMarkStep] = useState(-1); // -1: gizli, 0..n: görünen satır sayısı
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const skipped = useRef(false);

  const finish = useCallback(() => {
    if (skipped.current) return;
    skipped.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setFading(true);
    setTimeout(() => setDone(true), FADE_MS);
  }, []);

  useEffect(() => {
    // Açılış YALNIZCA ana sayfanın kendisi yüklendiğinde oynar (CEO 2026-08-23).
    // Oynamaması gereken üç durum:
    //   1. Adreste çapa var (/tr#process) — kullanıcı bir bölüme atlıyor
    //   2. Belge başka bir sayfada açıldı, ana sayfaya site içinden gelindi
    //   3. Aynı belgede daha önce bir kez oynadı (ileri/geri, site içi gezinme)
    // ?intro=1 üçünü de, hareket azaltmayı da geçersiz kılar.
    let forced = false;
    try {
      forced = new URLSearchParams(window.location.search).get("intro") === "1";
    } catch {
      /* URL okunamıyorsa normal akış */
    }

    let isFreshHomeLoad = false;
    try {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      // nav.name = tarayıcının GERÇEKTEN yüklediği belge adresi.
      // Site içi (soft) gezinmede değişmez — ayrımı bu sağlıyor.
      const loaded = new URL(nav?.name ?? window.location.href);
      isFreshHomeLoad =
        !loaded.hash &&
        loaded.pathname === window.location.pathname &&
        !window.location.hash &&
        !(window as unknown as { __cvIntroPlayed?: boolean }).__cvIntroPlayed;
    } catch {
      isFreshHomeLoad = true;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!forced && (reduced || !isFreshHomeLoad)) {
      skipped.current = true;
      setDone(true);
      return;
    }
    (window as unknown as { __cvIntroPlayed?: boolean }).__cvIntroPlayed = true;

    document.body.style.overflow = "hidden";

    const script = SCRIPT[locale] ?? SCRIPT.en;
    const wait = (ms: number) =>
      new Promise<void>((r) => {
        timers.current.push(setTimeout(r, ms));
      });

    let cancelled = false;
    (async () => {
      for (const line of script) {
        for (let i = 0; i <= line.t.length; i++) {
          if (cancelled || skipped.current) return;
          setCurrent({ ...line, t: line.t.slice(0, i) });
          if (i < line.t.length) await wait(1000 / line.cps);
        }
        if (cancelled || skipped.current) return;
        setLines((prev) => [...prev, line]);
        setCurrent(null);
        await wait(line.after);
      }
      if (cancelled || skipped.current) return;

      // Terminal metni gider, ASCII kuzgun satır satır belirir
      setLines([]);
      const step = MARK_REVEAL_MS / CORVUS_ASCII.length;
      for (let i = 0; i <= CORVUS_ASCII.length; i++) {
        if (cancelled || skipped.current) return;
        setMarkStep(i);
        await wait(step);
      }
      await wait(HOLD_MS);
      if (!cancelled) finish();
    })();

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [locale, finish]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, finish]);

  if (done) return null;

  const showMark = markStep >= 0;

  return (
    <div
      className={`intro${fading ? " intro--out" : ""}`}
      role="presentation"
      aria-hidden
      onClick={finish}
    >
      {!showMark && (
        <pre className="intro__term">
          {lines.map((l, i) =>
            l.inv ? (
              <span key={i}>
                <mark className="intro__inv">{l.t}</mark>
                {"\n"}
              </span>
            ) : (
              <span key={i}>{l.t + "\n"}</span>
            ),
          )}
          {current &&
            (current.inv ? (
              <mark className="intro__inv">{current.t}</mark>
            ) : (
              <span>{current.t}</span>
            ))}
          <span className="intro__cur" />
        </pre>
      )}

      {showMark && (
        <div className="intro__mark">
          <pre className="intro__ascii">
            {CORVUS_ASCII.slice(0, markStep).join("\n")}
          </pre>
          <span className="intro__word">
            Corvus<i>.</i>
          </span>
        </div>
      )}

      <button type="button" className="intro__skip" onClick={finish}>
        {locale === "tr" ? "geç" : "skip"}
      </button>
    </div>
  );
}
