import Link from "next/link";
import { localCities } from "@/lib/gezi";
import { ROUTES, t, type Locale } from "@/lib/gezi-i18n";
import HeaderCta from "@/components/gezi/HeaderCta";
import ListShelf from "@/components/gezi/ListShelf";

const POPULAR = ["istanbul", "kapadokya", "antalya", "rome", "paris", "london"];

/** Bulunamayan adres: kaybolan ziyaretçiyi popüler rotalara (yoksa listelere) ve uygulamaya yönlendirir. */
export default function NotFoundView({ locale }: { locale: Locale }) {
  const d = t(locale);
  const root = ROUTES[locale].root;
  const all = localCities(locale);
  const picks = [...POPULAR.map((k) => all.find((c) => c.destKey === k)).filter((c) => c !== undefined), ...all]
    .filter((c, i, arr) => arr.indexOf(c) === i)
    .slice(0, 6);
  return (
    <div className="gz-wrap gz-404">
      <h1 className="gz-h1 gz-display">{d.nfTitle}</h1>
      <p className="gz-sub">{d.nfSub}</p>
      <div className="gz-404__actions">
        <Link className="gz-btn gz-btn--ghost" href={root}>{d.nfAll}</Link>
        <HeaderCta locale={locale} className="gz-btn" />
      </div>
      {picks.length ? (
        <>
          <h2 className="gz-block__title gz-display">{d.nfPopular}</h2>
          <div className="gz-links">
            {picks.map((c) => {
              const s = c.seasons[0];
              return (
                <Link key={c.destKey} className="gz-link" href={`${root}/${s.slug}`}>
                  <span className="gz-mono">{c.country} · {s.label}</span>
                  <b>{c.city}</b>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <h2 className="gz-block__title gz-display">{d.indexLists}</h2>
          <ListShelf locale={locale} />
        </>
      )}
    </div>
  );
}
