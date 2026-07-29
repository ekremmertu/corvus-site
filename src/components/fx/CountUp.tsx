"use client";

import { useEffect, useRef } from "react";

/**
 * Görünür olunca 0'dan hedefe sayar. Sayısal olmayan ekler ("15/20", "~23%")
 * korunur: yalnızca ilk sayı animasyonlanır. reduced-motion'da direkt final.
 */
export default function CountUp({
  value,
  className,
  style,
  duration = 1100,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/\d+/);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!match || reduced || !("IntersectionObserver" in window)) {
      el.textContent = value;
      return;
    }

    const target = parseInt(match[0], 10);
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + match[0].length);
    el.textContent = `${prefix}0${suffix}`;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {value}
    </span>
  );
}
