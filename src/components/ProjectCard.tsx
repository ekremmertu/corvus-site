import Link from "next/link";
import {
  getCategory,
  statusLabels,
  type Locale,
  type Project,
} from "@/data/projects";

export default function ProjectCard({
  project,
  locale,
  index,
}: {
  project: Project;
  locale: Locale;
  index?: number;
}) {
  const category = getCategory(project.category);

  return (
    <Link
      href={`/${locale}/work/${project.slug}`}
      className="group reveal relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--c-border)] bg-[color:var(--c-bg-elevated)]/70 p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[color:var(--c-border-strong)] hover:shadow-[var(--shadow-lg)] sm:p-7"
      style={{ transitionDelay: index !== undefined ? `${Math.min(index, 6) * 40}ms` : undefined }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${category.accent}, transparent)` }}
      />

      <div className="flex items-center justify-between gap-3">
        <span
          className="eyebrow"
          style={{ color: category.accent }}
        >
          {category.name[locale]}
        </span>
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-faint">
          {statusLabels[project.status][locale]}
        </span>
      </div>

      <h3 className="display mt-5 text-[clamp(1.35rem,2vw,1.75rem)]">
        {project.name}
      </h3>
      <p className="lede mt-3 flex-1 text-[15px]">{project.summary[locale]}</p>

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
