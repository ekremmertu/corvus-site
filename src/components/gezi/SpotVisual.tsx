import { spotText, type Spot } from "@/lib/liste";
import { t, type Locale } from "@/lib/gezi-i18n";

/**
 * Mekân görseli. Yalnız elle onaylanmış açık lisanslı fotoğraf gösterilir; yoksa kapak + bölge haritası.
 * Fotoğrafın ne gösterdiği (caption) ve lisans/yazar her zaman yanında — yanlış ya da kaynaksız görsel yok.
 */
export default function SpotVisual({
  spot, locale, size = "card", eager = false,
}: { spot: Spot; locale: Locale; size?: "card" | "hero"; eager?: boolean }) {
  const p = spot.photo;
  const d = t(locale);
  const x = spotText(spot, locale);
  const w = size === "hero" ? 1200 : 600;
  return (
    <figure className={`gz-vis gz-vis--${size}${p ? "" : " gz-vis--cover"}`}>
      <div className="gz-vis__frame">
        {p ? (
          <img
            src={`${p.src}-${w}.webp`}
            srcSet={`${p.src}-600.webp 600w, ${p.src}-1200.webp 1200w`}
            sizes={size === "hero" ? "(min-width: 1100px) 1100px, 100vw" : "(min-width: 1100px) 360px, (min-width: 640px) 50vw, 100vw"}
            alt={x.caption}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            width={w}
            height={Math.round(w / p.ratio)}
          />
        ) : (
          <img src={spot.map} alt={d.mapAlt(x.name, x.place)} loading={eager ? "eager" : "lazy"} decoding="async" width={640} height={400} />
        )}
        {x.ranked ? <span className="gz-vis__rank gz-display" aria-hidden="true">{spot.rank}</span> : null}
        {!p ? (
          <span className="gz-vis__poster" aria-hidden="true">
            <span className="gz-vis__pname gz-display">{x.name}</span>
            <span className="gz-vis__pmeta">{x.city} · {x.listCopy?.h1}</span>
          </span>
        ) : null}
      </div>
      {size === "hero" ? (
        <figcaption className="gz-vis__cap">
          {p ? (
            <>
              {x.caption} · {d.photoBy} {p.artist || "Wikimedia Commons"} ·{" "}
              <a href={p.pageUrl} rel="nofollow noopener" target="_blank">{p.license}</a>
            </>
          ) : (
            <>{d.mapCaption}</>
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}
