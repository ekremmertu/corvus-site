"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], summary";

/**
 * Tek renkli imleç (mix-blend: difference) — nokta anında, halka gecikmeli.
 * Bağlantı üstünde halka büyür; [data-view] (telefon, vaka kartı) üstünde
 * dolu daireye dönüşüp "GÖR" yazar. Yalnız fare + hover cihazlarda;
 * dokunmatikte ve hareket azaltmada hiç çalışmaz.
 */
export default function CustomCursor({ label }: { label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;
    if (!fine || reduced || !root || !dot || !ring || !text) return;

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      const t = e.target as HTMLElement | null;
      root.classList.toggle("is-view", Boolean(t?.closest?.("[data-view]")));
      root.classList.toggle("is-hover", Boolean(t?.closest?.(INTERACTIVE)));
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      text.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    const hide = () => (root.style.opacity = "0");
    const show = () => (root.style.opacity = "1");

    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);
    raf = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
      <div ref={textRef} className="cursor-label">
        {label}
      </div>
    </div>
  );
}
