"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CORVUS_ASCII } from "./corvusAscii";

/**
 * Açılış — ASCII kuzgun (v2 lüks tema, 09.10.2026).
 * 1) Kuzgun satır satır, her satır önce karışık karakterlerle gelip yerine oturur (~0,64 sn)
 * 2) Kuzgun tüyü ışıltısı soldan sağa geçer
 * 3) CORVUS harfleri tek tek belirir
 * 4) Kuzgun küçülerek menüdeki logo işaretine uçar, sahne açılır (html.pre-hero kalkar)
 * Eski sürümdeki "error: PORTFOLIO NOT LOADED" terminal metni bilinçli olarak atıldı.
 *
 * Oynama kuralları eski sürümle aynı (CEO 2026-08-23): yalnız ana sayfanın
 * kendisi yüklendiğinde; çapalı adreste, site içi gezinmede ve aynı belgede
 * ikinci kez oynamaz. ?intro=1 hepsini ve hareket azaltmayı geçersiz kılar.
 * Atla: tık / ESC / Enter / Boşluk / "Geç".
 */
const CHARS = "@#%&*+=<>/\\{}10";
const REVEAL_MS = 640;
const TOTAL_MS = 2050;

type W = Window & { __cvIntroPlayed?: boolean };

export default function Intro({ skipLabel }: { skipLabel: string }) {
  const [done, setDone] = useState(false);
  const [out, setOut] = useState(false);
  const asciiRef = useRef<HTMLPreElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const mark = markRef.current;
    const target = document.querySelector<HTMLElement>("[data-brand-mark]");
    if (mark && target) {
      const a = mark.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const scale = (b.width / a.width) * 2.4;
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      mark.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    }
    setOut(true);
    setTimeout(() => document.documentElement.classList.remove("pre-hero"), 220);
    setTimeout(() => {
      document.body.style.overflow = "";
      setDone(true);
    }, 950);
  }, []);

  useEffect(() => {
    const w = window as W;
    let forced = false;
    try {
      forced = new URLSearchParams(window.location.search).get("intro") === "1";
    } catch {
      /* normal akış */
    }
    let fresh = false;
    try {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const loaded = new URL(nav?.name ?? window.location.href);
      fresh = !loaded.hash && loaded.pathname === window.location.pathname && !window.location.hash && !w.__cvIntroPlayed;
    } catch {
      fresh = true;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!forced && (reduced || !fresh)) {
      finished.current = true;
      setDone(true);
      return;
    }
    w.__cvIntroPlayed = true;
    document.documentElement.classList.add("pre-hero");
    document.body.style.overflow = "hidden";

    const pre = asciiRef.current;
    const rows = CORVUS_ASCII.map(() => "");
    const per = REVEAL_MS / CORVUS_ASCII.length;
    const T = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

    CORVUS_ASCII.forEach((line, i) =>
      T(() => {
        let k = 0;
        const scramble = () => {
          k++;
          rows[i] = line.replace(/\S/g, (c) => (k > 3 ? c : CHARS[(Math.random() * CHARS.length) | 0]));
          if (pre) pre.textContent = rows.join("\n");
          if (k <= 3) T(scramble, 40);
        };
        scramble();
      }, i * per)
    );
    T(() => pre?.classList.add("sweep"), 720);
    T(() => wordRef.current?.classList.add("on"), 820);
    T(finish, TOTAL_MS);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      timers.current.forEach(clearTimeout);
    };
  }, [finish]);

  if (done) return null;

  return (
    <div className={`intro${out ? " is-out" : ""}`} aria-hidden onClick={finish}>
      <noscript>
        <style>{`.intro{display:none!important}`}</style>
      </noscript>
      <div className="intro-mark" ref={markRef}>
        <pre className="intro-ascii" ref={asciiRef} />
        <div className="intro-word" ref={wordRef}>
          {"CORVUS".split("").map((ch, i) => (
            <span key={i} style={{ transitionDelay: `${i * 55}ms` }}>
              {ch}
            </span>
          ))}
        </div>
      </div>
      <button type="button" className="intro-skip" onClick={finish}>
        {skipLabel}
      </button>
    </div>
  );
}
