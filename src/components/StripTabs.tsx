"use client";

import { Children, useId, useRef, useState, type ReactNode } from "react";

/** Şerit sekmeleri — panelleri sunucu üretir, burada yalnız hangisinin görüneceği seçilir. */
export default function StripTabs({ tabs, label, children }: { tabs: { key: string; label: string; count: number }[]; label: string; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = Children.toArray(children);
  const move = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  return (
    <>
      <div className="wrap strip-tabs" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-t${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-p${i}`}
            tabIndex={active === i ? 0 : -1}
            className={`tab${active === i ? " on" : ""}`}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") move(i + 1);
              if (e.key === "ArrowLeft") move(i - 1);
            }}
          >
            {t.label} <em>{t.count}</em>
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div key={i} role="tabpanel" id={`${id}-p${i}`} aria-labelledby={`${id}-t${i}`} hidden={active !== i}>
          {p}
        </div>
      ))}
    </>
  );
}
