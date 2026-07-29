"use client";

import { useEffect, useRef } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/_\\|[]{}=+*#";

/**
 * Terminal tarzı text-decode: harfler rastgele karakterlerden çözülerek
 * yerine oturur. reduced-motion'da animasyonsuz.
 */
export default function Scramble({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = text;
      return;
    }

    let frame = 0;
    let raf = 0;
    const total = 26; // ~430ms @60fps
    const start = () => {
      const tick = () => {
        frame++;
        const settled = Math.floor((frame / total) * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " " || i < settled) out += ch;
          else out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
        }
        el.textContent = out;
        if (settled < text.length) raf = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(tick);
    };

    const t = setTimeout(start, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  // SSR/no-JS: gerçek metin her zaman markup'ta
  return (
    <span ref={ref} className={className} style={style}>
      {text}
    </span>
  );
}
