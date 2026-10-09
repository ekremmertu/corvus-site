import Link from "next/link";
import CatName from "@/components/CatName";
import { getCategory, type Locale, type Project } from "@/data/projects";
import type { Dict } from "@/i18n/dict";
import FixStar from "@/components/fx/FixStar";
import Phone from "@/components/Phone";
import BrowserFrame from "@/components/BrowserFrame";
import BiDashboard from "@/components/bi/BiDashboard";

type Shot = { src: string; alt: string };

/**
 * Öne çıkanlar (CEO 09.10.2026, Yön B): App (TripWalkers) · SaaS (CVtoapply, tarayıcıda) ·
 * Kurumsal (NDA — müşteri adı yok, yalnız sayı + örnek panel) · ikili (Ameliea, SplitTable).
 */
export default function FeaturedCase({
  locale,
  d,
  hero,
  heroShots,
  duo,
  saas,
  entCount,
}: {
  locale: Locale;
  d: Dict;
  hero: Project;
  heroShots: [Shot, Shot];
  duo: { project: Project; shot: Shot; tone: "gold" | "red" }[];
  saas: { project: Project; shot: Shot; url: string };
  entCount: number;
}) {
  const cat = getCategory(hero.category);
  return (
    <section className="case" aria-labelledby="case-title">
      <div className="wrap">
        <Link href={`/${locale}/work/${hero.slug}`} className="case-big grain reveal" data-view style={{ display: "block" }}>
          <div className="txt">
            <p className="eyebrow" style={{ margin: 0 }}>
              {d.home.featured} · <CatName name={cat.name[locale]} />
              <FixStar n={1} />
            </p>
            <h3 id="case-title">{hero.name}</h3>
            <p>{hero.description[locale]}</p>
          </div>
          {hero.metrics && (
            <dl className="facts">
              {hero.metrics.map((m) => (
                <div key={m.label.en}>
                  <dt className="sr-only">{m.label[locale]}</dt>
                  <dd style={{ margin: 0 }}>
                    <strong>{m.value}</strong>
                    <small>{m.label[locale]}</small>
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <div className="case-phones">
            <Phone className="back" src={heroShots[0].src} alt={heroShots[0].alt} />
            <Phone className="front iph-lg" src={heroShots[1].src} alt={heroShots[1].alt} />
          </div>
        </Link>

        <Link href={`/${locale}/work/${saas.project.slug}`} className="case-big case-saas grain reveal" data-view style={{ display: "block" }}>
          <div className="txt">
            <p className="eyebrow" style={{ margin: 0 }}>
              {d.home.featuredSaas} · <CatName name={getCategory(saas.project.category).name[locale]} />
            </p>
            <h3>{saas.project.name}</h3>
            <p>{saas.project.summary[locale]}</p>
          </div>
          <dl className="facts">
            <div>
              <dt className="sr-only">{d.home.status}</dt>
              <dd style={{ margin: 0 }}>
                <strong>{d.home.liveLabel}</strong>
                <small>{d.home.status}</small>
              </dd>
            </div>
            <div>
              <dt className="sr-only">{d.home.platform}</dt>
              <dd style={{ margin: 0 }}>
                <strong>Web + iOS</strong>
                <small>{d.home.platform}</small>
              </dd>
            </div>
          </dl>
          <BrowserFrame url={saas.url} className="case-brw">
            <img src={saas.shot.src} alt={saas.shot.alt} width={1200} height={750} loading="lazy" decoding="async" />
          </BrowserFrame>
        </Link>

        <Link href={`/${locale}/work?d=enterprise`} className="case-big case-ent grain reveal" style={{ display: "block" }}>
          <div className="txt">
            <p className="eyebrow" style={{ margin: 0 }}>
              {d.home.entEyebrow}
            </p>
            <h3>
              {d.home.entTitle1}
              <br />
              {d.home.entTitle2}
            </h3>
            <p>{d.home.entText}</p>
          </div>
          <dl className="facts">
            <div>
              <dt className="sr-only">{d.home.entProjects}</dt>
              <dd style={{ margin: 0 }}>
                <strong>{entCount}</strong>
                <small>{d.home.entProjects}</small>
              </dd>
            </div>
            <div>
              <dt className="sr-only">{d.home.entPrivacy}</dt>
              <dd style={{ margin: 0 }}>
                <strong>NDA</strong>
                <small>{d.home.entPrivacy}</small>
              </dd>
            </div>
          </dl>
          <BrowserFrame url={locale === "tr" ? "Operasyon Paneli" : "Operations dashboard"} className="case-brw">
            <BiDashboard variant="card" label={d.home.dashLabel} />
          </BrowserFrame>
        </Link>

        <div className="duo">
          {duo.map(({ project, shot, tone }, i) => {
            const c = getCategory(project.category);
            return (
              <Link
                key={project.slug}
                href={`/${locale}/work/${project.slug}`}
                className={`duo-card duo-${tone} grain reveal`}
                style={{ transitionDelay: `${i * 0.1}s` }}
                data-view
              >
                <p className="eyebrow" style={{ margin: 0 }}>
                  <CatName name={c.name[locale]} />
                  {project.slug === "amelie-co" && <FixStar n={6} />}
                </p>
                <h3>{project.name}</h3>
                <p>{project.summary[locale]}</p>
                <Phone src={shot.src} alt={shot.alt} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
