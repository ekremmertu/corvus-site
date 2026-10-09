import Link from "next/link";
import { getCategory, type Locale, type Project } from "@/data/projects";
import type { Dict } from "@/i18n/dict";
import Phone from "@/components/Phone";

type Shot = { src: string; alt: string };

/** Öne çıkan app (TripWalkers) + ikili (Ameliea, SplitTable). Metin ve rakamlar veriden. */
export default function FeaturedCase({
  locale,
  d,
  hero,
  heroShots,
  duo,
}: {
  locale: Locale;
  d: Dict;
  hero: Project;
  heroShots: [Shot, Shot];
  duo: { project: Project; shot: Shot; tone: "gold" | "red" }[];
}) {
  const cat = getCategory(hero.category);
  return (
    <section className="case" aria-labelledby="case-title">
      <div className="wrap">
        <Link href={`/${locale}/work/${hero.slug}`} className="case-big grain reveal" data-view style={{ display: "block" }}>
          <div className="txt">
            <p className="eyebrow" style={{ margin: 0 }}>
              {d.home.featured} · {cat.name[locale]}
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
                  {c.name[locale]}
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
