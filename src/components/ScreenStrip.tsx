import Link from "next/link";
import type { Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import Phone from "@/components/Phone";

export type StripItem = { slug: string; name: string; sub: string; src: string; alt: string };

/** Gerçek ekranlardan film şeridi — yana kaydırılır (dokunmatikte parmakla). */
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
            <Phone src={it.src} alt={it.alt} />
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
