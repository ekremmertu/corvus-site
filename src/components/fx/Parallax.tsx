"use client";

import { useEffect, useRef } from "react";

/** Fareyle çok hafif derinlik — yalnız ince işaretçili cihazda, hareket azaltmada kapalı. */
export default function Parallax({
  children,
  className,
  depth = 14,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.transform = `translate3d(${x * -depth}px, ${y * -depth * 0.6}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [depth]);
  return (
    <div ref={ref} className={className} style={{ transition: "transform .6s cubic-bezier(.16,1,.3,1)" }}>
      {children}
    </div>
  );
}
