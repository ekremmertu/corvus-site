import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale, locales } from "@/i18n/dict";
import {
  getCategory,
  projects,
  statusLabels,
  type Locale,
} from "@/data/projects";
import ProjectSceneSync from "@/components/ProjectSceneSync";
import VT from "@/components/fx/VT";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    projects.map((p) => ({ lang, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.summary[locale],
    alternates: {
      canonical: `/${locale}/work/${slug}`,
      languages: { en: `/en/work/${slug}`, tr: `/tr/work/${slug}` },
    },
    openGraph: {
      title: `${project.name} · Corvus Tech`,
      description: project.summary[locale],
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const category = getCategory(project.category);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="relative">
      <ProjectSceneSync categoryIndex={category.index} />

      <header className="mx-auto w-full max-w-[1240px] px-5 pb-16 pt-[calc(var(--nav-h)+72px)] sm:px-8">
        <Link
          href={`/${lang}/work`}
          className="mono text-[11px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-[color:var(--c-live)]"
        >
          ← {d.work.backToWork}
        </Link>

        <p className="eyebrow mt-8" style={{ color: category.accent }}>
          {category.name[lang]}
        </p>
        <VT name={`proj-${project.slug}`}>
          <h1 className="display mt-4" style={{ fontSize: "var(--type-display)" }}>
            {project.name}
          </h1>
        </VT>
        <p className="lede mt-6 max-w-[52ch] text-[17px]">{project.summary[lang]}</p>

        <dl className="mt-12 grid gap-8 border-t border-[color:var(--c-border)] pt-8 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <dt className="eyebrow">{d.work.status}</dt>
            <dd className="mt-2 text-sm">{statusLabels[project.status][lang]}</dd>
          </div>
          <div>
            <dt className="eyebrow">{d.work.year}</dt>
            <dd className="mono mt-2 text-sm">{project.year}</dd>
          </div>
          <div>
            <dt className="eyebrow">{d.work.discipline}</dt>
            <dd className="mt-2 text-sm">{category.name[lang]}</dd>
          </div>
          {project.client && (
            <div>
              <dt className="eyebrow">{d.work.client}</dt>
              <dd className="mt-2 text-sm">{project.client[lang]}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="mx-auto w-full max-w-[1240px] px-5 pb-24 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="eyebrow">{d.work.overview}</h2>
            <p className="mt-5 text-[17px] leading-[1.75] text-[color:var(--c-text)]">
              {project.description[lang]}
            </p>

            <h2 className="eyebrow mt-14">{d.work.highlights}</h2>
            <ul className="mt-5 space-y-4">
              {project.highlights[lang].map((h) => (
                <li key={h} className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: category.accent }}
                  />
                  <span className="text-[15px] leading-relaxed text-dim">{h}</span>
                </li>
              ))}
            </ul>

            {project.client && (
              <p className="mono mt-12 rounded-[var(--radius-lg)] border border-[color:var(--c-border)] bg-[color:var(--c-bg-elevated)] p-5 text-[12px] leading-relaxed text-faint">
                {d.work.confidential}
              </p>
            )}
          </div>

          <aside className="space-y-10">
            {project.metrics && project.metrics.length > 0 && (
              <div className="rounded-[var(--radius-xl)] border border-[color:var(--c-border)] bg-[color:var(--c-bg-elevated)]/70 p-6">
                <dl className="space-y-5">
                  {project.metrics.map((m) => (
                    <div key={m.label.en}>
                      <dt className="eyebrow">{m.label[lang]}</dt>
                      <dd
                        className="display mt-1.5 text-2xl"
                        style={{ color: category.accent }}
                      >
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div>
              <h2 className="eyebrow">{d.work.stack}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-[var(--radius-pill)] border border-[color:var(--c-border)] px-3 py-1.5 text-[12px] text-dim"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <nav className="border-t border-[color:var(--c-border)]" aria-label={d.work.nextProject}>
        <Link
          href={`/${lang}/work/${next.slug}`}
          className="group mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4 px-5 py-14 sm:px-8"
        >
          <div>
            <p className="eyebrow">{d.work.nextProject}</p>
            <p className="display mt-3 text-[clamp(1.75rem,4vw,3rem)] transition-colors group-hover:text-[color:var(--c-live)]">
              {next.name}
            </p>
          </div>
          <span
            aria-hidden
            className="text-3xl text-dim transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[color:var(--c-live)]"
          >
            →
          </span>
        </Link>
      </nav>
    </article>
  );
}
