import Link from "next/link";
import { listSlug, lists, spotsOf } from "@/lib/liste";
import { LIST_COPY, ROUTES, t, type Locale } from "@/lib/gezi-i18n";

/** Üç seçki listesinin kapak kartları; kapak = listede onaylı fotoğrafı olan en üst sıradaki yer. */
export default function ListShelf({ locale }: { locale: Locale }) {
  const d = t(locale);
  return (
    <div className="gz-shelf">
      {lists().map((l) => {
        const cover = spotsOf(l).find((s) => s.photo);
        const copy = LIST_COPY[locale][l.slug];
        return (
          <Link key={l.slug} href={`${ROUTES[locale].list}/${listSlug(l, locale)}`} className="gz-shelf__card">
            {cover?.photo ? <img src={`${cover.photo.src}-600.webp`} alt="" loading="lazy" decoding="async" /> : null}
            <b>{copy.h1}</b>
            <span>{copy.tag} · {d.placesN(l.spots.length)}</span>
          </Link>
        );
      })}
    </div>
  );
}
