"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  getCategory,
  statusLabels,
  type CardProject,
  type Locale,
} from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import VT from "@/components/fx/VT";

const TILT_MAX = 5; // derece

export default function ProjectCard({
  project,
  locale,
  index,
  d,
}: {
  project: CardProject;
  locale: Locale;
  index?: number;
  d: Dict;
}) {
  const category = getCategory(project.category);
  const veil = project.veil;
  const ref = useRef<HTMLAnchorElement>(null);

  const delay = index !== undefined ? `${Math.min(index, 6) * 40}ms` : undefined;
  const shell =
    "group reveal relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--c-border)] bg-[color:var(--c-bg-elevated)]/70 p-6 sm:p-7";

  const topLine = (
    <span
      aria-hidden
      className="absolute inset-x-0 top-0 h-px opacity-60"
      style={{ background: `linear-gradient(90deg, transparent, ${category.accent}, transparent)` }}
    />
  );

  const stack = (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {project.stack.slice(0, 3).map((s) => (
        <span
          key={s}
          className="rounded-[var(--radius-pill)] border border-[color:var(--c-border)] px-3 py-1 text-[11px] text-dim"
        >
          {s}
        </span>
      ))}
    </div>
  );

  // ---------- Perdeli kart ----------
  // Gerçek isim ve özet HTML'e HİÇ yazılmaz — CSS blur kaynak kodda okunur,
  // gizlilik sağlamaz. Yerine anlamsız çubuklar konur.
  if (veil) {
    const label = veil === "confidential" ? d.work.veilConfidential : d.work.veilSoon;
    const note = veil === "confidential" ? d.work.veilNoteNda : d.work.veilNote;

    return (
      <div className={`${shell} veiled`} style={{ transitionDelay: delay }} aria-label={label}>
        {topLine}

        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow" style={{ color: category.accent }}>
            {category.name[locale]}
          </span>
          <span className="mono text-[11px] uppercase tracking-[0.14em] text-faint">
            {statusLabels[project.status][locale]}
          </span>
        </div>

        <div className="veil-ribbon mt-5" style={{ ["--veil-accent" as string]: category.accent }}>
          <span aria-hidden className="veil-dot" />
          {label}
        </div>

        <div aria-hidden className="veil-bars mt-5 flex-1">
          <span className="veil-bar veil-bar-title" />
          <span className="veil-bar" />
          <span className="veil-bar veil-bar-short" />
        </div>

        <p className="mono mt-5 text-[11px] uppercase tracking-[0.14em] text-faint">{note}</p>

        {stack}
      </div>
    );
  }

  // ---------- Normal kart ----------
  // 3D tilt + glare — yalnız hover'lı cihazlarda tetiklenir (touch'ta mousemove gelmez)
  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * TILT_MAX}deg) rotateY(${(px - 0.5) * TILT_MAX}deg) translateY(-4px)`;
    el.style.setProperty("--glare-x", `${px * 100}%`);
    el.style.setProperty("--glare-y", `${py * 100}%`);
  }
  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  return (
    <Link
      ref={ref}
      href={`/${locale}/work/${project.slug}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${shell} tilt-card transition-[border-color,box-shadow] duration-300 hover:border-[color:var(--c-border-strong)] hover:shadow-[var(--shadow-lg)]`}
      style={{ transitionDelay: delay }}
    >
      {topLine}
      {/* Glare — imleci takip eden parlama */}
      <span aria-hidden className="tilt-glare" />

      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow" style={{ color: category.accent }}>
          {category.name[locale]}
        </span>
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-faint">
          {statusLabels[project.status][locale]}
        </span>
      </div>

      <VT name={`proj-${project.slug}`}>
        <h3 className="display mt-5 text-[clamp(1.35rem,2vw,1.75rem)]">{project.name}</h3>
      </VT>
      <p className="lede mt-3 flex-1 text-[15px]">{project.summary?.[locale]}</p>

      {project.metrics && project.metrics.length > 0 && (
        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {project.metrics.map((m) => (
            <div key={m.label.en}>
              <dt className="eyebrow">{m.label[locale]}</dt>
              <dd className="mono mt-1 text-sm text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {project.appStoreSoon && (
          <span
            className="card-soon"
            style={{ ["--veil-accent" as string]: category.accent }}
          >
            <span aria-hidden className="veil-dot" />
            {d.work.appStoreSoon}
          </span>
        )}
        {project.stack.slice(0, 3).map((s) => (
          <span
            key={s}
            className="rounded-[var(--radius-pill)] border border-[color:var(--c-border)] px-3 py-1 text-[11px] text-dim"
          >
            {s}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 text-sm text-dim transition-colors group-hover:text-[color:var(--c-live)]">
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
