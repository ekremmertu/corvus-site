import Link from "next/link";
import type { Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import BrowserFrame from "@/components/BrowserFrame";
import StripTabs from "@/components/StripTabs";

export type StripItem = { slug: string; name: string; sub: string; src: string; alt: string };
export type WebItem = StripItem & { url: string };

/**
 * "Ekranlar kendini anlatır" — üç sekme (CEO 09.10.2026, Yön A):
 * Uygulamalar = App Store vitrin posterleri · Web & SaaS = canlı sitelerin tarayıcı görüntüsü ·
 * Kurumsal = kilitli kartlar (NDA; proje adı/metni HTML'e yazılmaz).
 */
export default function ScreenStrip({
  locale,
  d,
  items,
  web,
  counts,
}: {
  locale: Locale;
  d: Dict;
  items: StripItem[];
  web: WebItem[];
  counts: { app: number; web: number; ent: number };
}) {
  return (
    <section className="strip" aria-labelledby="strip-title">
      <div className="wrap strip-head reveal">
        <h2 id="strip-title" className="h-section" style={{ margin: 0 }}>
          {d.home.stripTitle1}
          <br />
          <span className="serif sheen" style={{ fontSize: "1.12em" }}>
            {d.home.stripTitle2}
          </span>
        </h2>
        <Link href={`/${locale}/work`} className="link-arrow">
          {d.home.allWork}
        </Link>
      </div>
      <StripTabs
        label={d.home.stripTitle1}
        tabs={[
          { key: "app", label: d.home.tabApp, count: counts.app },
          { key: "web", label: d.home.tabWeb, count: counts.web },
          { key: "ent", label: d.home.tabEnt, count: counts.ent },
        ]}
      >
        <div className="film" tabIndex={0} role="list" aria-label={d.home.tabApp}>
          {items.map((it) => (
            <Link key={it.slug + it.src} href={`/${locale}/work/${it.slug}`} className="film-item" role="listitem" data-view>
              <span className="poster">
                <img src={it.src} alt={it.alt} width={600} height={1300} loading="lazy" decoding="async" />
              </span>
              <div className="film-cap">
                {it.name}
                <small>{it.sub}</small>
              </div>
            </Link>
          ))}
        </div>
        <div className="film film-wide" tabIndex={0} role="list" aria-label={d.home.tabWeb}>
          {web.map((it) => (
            <Link key={it.slug} href={`/${locale}/work/${it.slug}`} className="film-item" role="listitem" data-view>
              <BrowserFrame url={it.url}>
                <img src={it.src} alt={it.alt} width={1200} height={750} loading="lazy" decoding="async" />
              </BrowserFrame>
              <div className="film-cap">
                {it.name}
                <small>{it.sub}</small>
              </div>
            </Link>
          ))}
        </div>
        <div className="film film-wide" role="list" aria-label={d.home.tabEnt}>
          {Array.from({ length: counts.ent }, (_, i) => (
            <Link key={i} href={`/${locale}/work?d=enterprise`} className="film-item" role="listitem">
              <BrowserFrame url="•••••••••" className="locked">
                <img src="/shots/dash-petrol.svg" alt="" width={1040} height={650} loading="lazy" decoding="async" />
                <span className="lock" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
                    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>
              </BrowserFrame>
              <div className="film-cap">
                {d.home.entLocked}
                <small>{d.home.entEyebrow}</small>
              </div>
            </Link>
          ))}
        </div>
      </StripTabs>
    </section>
  );
}
