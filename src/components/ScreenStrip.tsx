import Link from "next/link";
import type { Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";

export type StripItem = { slug: string; name: string; sub: string; src: string; alt: string };

/** App Store vitrin kartları — telefonsuz poster (görselin içinde telefon zaten var). Geniş ekranda tek sıra, dar ekranda yana kaydırılır. */
export default function ScreenStrip({ locale, d, items }: { locale: Locale; d: Dict; items: StripItem[] }) {
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
      <div className="film reveal" tabIndex={0} role="list" aria-label={d.home.stripTitle1}>
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
    </section>
  );
}
