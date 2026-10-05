"use client";

import { useEffect, useRef, useState } from "react";
import { t, type Locale } from "@/lib/gezi-i18n";

type Item = { index: number; theme: string };

/** Yapışkan gün gezgini: mobilde yatay şerit, masaüstünde sağ kolonda liste. Okunan günü işaretler. */
export default function DayNav({ days, locale }: { days: Item[]; locale: Locale }) {
  const d = t(locale);
  const [active, setActive] = useState(days[0]?.index ?? 1);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const sections = days
      .map((d) => document.getElementById(`gun-${d.index}`))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.id;
        if (id) setActive(Number(id.replace("gun-", "")));
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [days]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-day="${active}"]`);
    const bar = listRef.current?.parentElement;
    if (!el || !bar || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="gz-daynav" aria-label={d.daysNav}>
      <ol ref={listRef}>
        {days.map((x) => (
          <li key={x.index}>
            <a href={`#gun-${x.index}`} data-day={x.index} aria-current={active === x.index ? "true" : undefined}>
              {d.dayN(x.index)}
              <span>{x.theme}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
