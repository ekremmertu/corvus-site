import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale, locales } from "@/i18n/dict";
import {
  getCategory,
  openProjects,
  projects,
  statusLabels,
  veilOf,
  type Locale,
} from "@/data/projects";
import { SITE } from "@/lib/site";
import ProjectSceneSync from "@/components/ProjectSceneSync";
import VT from "@/components/fx/VT";

// Perdeli projelerin sayfasi HIC uretilmez -> dogrudan adres yazan da 404 gorur.
// Blur sadece gorsel; icerik HTML'e girmesin diye sayfanin kendisi yok.
export function generateStaticParams() {
  return locales.flatMap((lang) =>
    openProjects().map((p) => ({ lang, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const project = projects.find((p) => p.slug === slug);
  if (!project || veilOf(project)) return {};

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

/**
 * GEO — ürün sayfası yapısal verisi.
 *
 * "TripWalkers nedir?" / "CVtoapply ne işe yarar?" soruları artık yapay zekâ
 * asistanlarına soruluyor. Bu blok motorun cevabı sayfa metninden TAHMİN etmek
 * yerine makineden OKUMASINI sağlar: ne olduğu, kimin yaptığı, hangi platformda
 * çalıştığı, App Store bağlantısı.
 *
 * App Store'da olan ürün SoftwareApplication, olmayan CreativeWork olur —
 * "mobil uygulama" demek gerçek olmadığında yanlış beyandır.
 *
 * ⛔ `aggregateRating` BİLEREK YOK: ürünlerin gerçek oy sayısı çok düşük ya da
 *    sıfır. Uydurma puan hem Google yapısal veri politikası ihlali hem marka
 *    dürüstlük freni ihlalidir. Gerçek oylar birikince eklenir.
 */
function urunJsonLd(project: (typeof projects)[number], locale: Locale) {
  const uygulamaMi = Boolean(project.appStoreUrl);
  return {
    "@context": "https://schema.org",
    "@type": uygulamaMi ? "SoftwareApplication" : "CreativeWork",
    name: project.name,
    description: project.description[locale],
    abstract: project.summary[locale],
    url: `${SITE.url}/${locale}/work/${project.slug}`,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    ...(uygulamaMi
      ? {
          applicationCategory: "MobileApplication",
          operatingSystem: "iOS",
          installUrl: project.appStoreUrl,
          sameAs: [project.appStoreUrl],
        }
      : {}),
    keywords: project.stack.join(", "),
    ...(project.year ? { dateCreated: project.year } : {}),
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  const open = openProjects();
  const index = open.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = open[index];
  const category = getCategory(project.category);
  const next = open[(index + 1) % open.length];

  return (
    <article className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(urunJsonLd(project, lang)) }}
      />
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

        {(project.appStoreUrl || project.liveUrl || project.appStoreSoon) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.appStoreUrl && (
              <a
                href={project.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                data-magnetic
              >
                {d.work.appStore}
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-live"
                data-magnetic
              >
                {d.work.visitSite}
              </a>
            )}
            {project.appStoreSoon && !project.appStoreUrl && (
              <span className="btn btn-soon">
                <span aria-hidden className="soon-dot" />
                {d.work.appStoreSoon}
              </span>
            )}
          </div>
        )}

        {project.screenshots ? (
          <figure className="shots mt-8">
            <ul className={`shots-row${project.screenshotsSeamless ? " shots-seamless" : ""}`}>
              {Array.from({ length: project.screenshots }, (_, i) => (
                <li key={i}>
                  <img
                    src={`/appstore/${project.slug}/${i + 1}.jpg`}
                    alt=""
                    width={640}
                    height={1385}
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
            <figcaption className="mono mt-3 text-[11px] uppercase tracking-[0.14em] text-faint">
              {d.work.screenshots}
            </figcaption>
          </figure>
        ) : null}

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
