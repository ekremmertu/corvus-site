import Link from "next/link";
import { categories, type CategorySlug, type Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";

/** Açık zeminde 5 disiplin: üstte 3, altta 2 geniş kart. Metin taksonomiden. */
export default function Disciplines({
  locale,
  d,
  counts,
}: {
  locale: Locale;
  d: Dict;
  counts: Record<CategorySlug, number>;
}) {
  const order: CategorySlug[] = ["ios", "web", "ai", "fintech", "enterprise"];
  return (
    <section id="disciplines" className="light" aria-labelledby="disc-title" style={{ textAlign: "center" }}>
      <div className="wrap">
        <h2 id="disc-title" className="h-section reveal" style={{ margin: 0 }}>
          {d.home.discTitle1} <span className="serif">{d.home.discTitle2}</span>
        </h2>
        <p className="lede reveal" style={{ maxWidth: 620, margin: "22px auto 0" }}>
          {d.home.discSub}
        </p>
        <div className="disc">
          {order.map((slug, i) => {
            const c = categories.find((x) => x.slug === slug)!;
            return (
              <Link
                key={slug}
                href={`/${locale}/work?d=${slug}`}
                className={`disc-card reveal${i > 2 ? " wide" : ""}`}
                style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
              >
                <span className={`orb orb-${slug}`} aria-hidden />
                <span className="n" aria-hidden>
                  0{i + 1}
                </span>
                <h3>{c.name[locale]}</h3>
                <p>{c.headline[locale]}</p>
                <span className="meta">
                  <span>{c.kicker[locale]}</span>
                  <span>
                    {counts[slug] ?? 0} {d.home.projects} →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
