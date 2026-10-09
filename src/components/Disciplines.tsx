import Link from "next/link";
import { categories, type CategorySlug, type Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import Phone from "@/components/Phone";
import BrowserFrame from "@/components/BrowserFrame";
import FixStar from "@/components/fx/FixStar";

/**
 * Açık zeminde 5 disiplin, görselli vitrin (CEO 09.10.2026, Yön C):
 * iOS geniş + Kurumsal dar · Web & AI yarım · Fintech tam genişlik. Metin taksonomiden.
 */
const ORDER: CategorySlug[] = ["ios", "enterprise", "web", "ai", "fintech"];
const STAR: Partial<Record<CategorySlug, number>> = { ios: 2, ai: 3, enterprise: 9 };
const CLS: Record<CategorySlug, string> = { ios: "disc-ios", enterprise: "disc-ent", web: "disc-web", ai: "disc-ai", fintech: "disc-fin" };

function Visual({ slug }: { slug: CategorySlug }) {
  switch (slug) {
    case "ios":
      return (
        <div className="dv">
          <Phone src="/shots/cover-st.jpg" alt="" />
          <Phone src="/shots/cover-tw.jpg" alt="" />
          <Phone src="/shots/cover-cv.jpg" alt="" />
        </div>
      );
    case "web":
      return (
        <BrowserFrame url="ameliea.co" className="dv">
          <img src="/shots/web-am.jpg" alt="" width={1200} height={750} loading="lazy" decoding="async" />
        </BrowserFrame>
      );
    case "ai":
      return (
        <BrowserFrame url="growth engine" className="dv">
          <img src="/shots/panel-growth.jpg" alt="" width={1200} height={750} loading="lazy" decoding="async" />
        </BrowserFrame>
      );
    case "fintech":
      return (
        <div className="dv">
          <svg viewBox="0 0 1180 160" preserveAspectRatio="none">
            <path d="M0 130 C120 120 160 60 260 80 S420 140 520 90 S700 20 800 50 S980 110 1180 30 L1180 160 L0 160Z" fill="rgba(61,220,132,.12)" />
            <path d="M0 130 C120 120 160 60 260 80 S420 140 520 90 S700 20 800 50 S980 110 1180 30" fill="none" stroke="#3ddc84" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      );
    case "enterprise":
      return (
        <svg className="dv" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
      );
  }
}

export default function Disciplines({ locale, d, counts }: { locale: Locale; d: Dict; counts: Record<CategorySlug, number> }) {
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
          {ORDER.map((slug, i) => {
            const c = categories.find((x) => x.slug === slug)!;
            return (
              <Link key={slug} href={`/${locale}/work?d=${slug}`} className={`disc-card ${CLS[slug]} reveal`} style={{ transitionDelay: `${(i % 2) * 0.08}s` }}>
                <h3>
                  {c.name[locale]}
                  {STAR[slug] && <FixStar n={STAR[slug]!} />}
                </h3>
                <span className="cnt">
                  {counts[slug] ?? 0} {d.home.projects}
                </span>
                <p>{c.headline[locale]}</p>
                <span className="go">{c.kicker[locale]} →</span>
                <Visual slug={slug} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
