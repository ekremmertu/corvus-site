"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], summary, [data-magnetic]";
const MAGNET_MAX = 7; // px — butonun imlece doğru kayabileceği azami mesafe

/**
 * Disiplin renginde özel imleç: nokta anında, halka gecikmeli takip eder.
 * [data-magnetic] öğeler imlece doğru hafifçe çekilir.
 * Sadece pointer:fine + hover:hover cihazlarda; reduced-motion'da kapalı.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("custom-cursor");

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let raf = 0;
    let magnetEl: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;

      const target = (e.target as HTMLElement | null)?.closest?.(
        INTERACTIVE
      ) as HTMLElement | null;

      // Hover durumu → halka büyür
      ring.classList.toggle("is-hover", Boolean(target));

      // Magnetik çekim
      const magnet = target?.closest?.("[data-magnetic]") as HTMLElement | null;
      if (magnet !== magnetEl) {
        if (magnetEl) magnetEl.style.transform = "";
        magnetEl = magnet;
      }
      if (magnetEl) {
        const r = magnetEl.getBoundingClientRect();
        const dx = ((x - (r.left + r.width / 2)) / (r.width / 2)) * MAGNET_MAX;
        const dy = ((y - (r.top + r.height / 2)) / (r.height / 2)) * MAGNET_MAX;
        magnetEl.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    };

    const loop = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(loop);
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
      if (magnetEl) magnetEl.style.transform = "";
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
}
