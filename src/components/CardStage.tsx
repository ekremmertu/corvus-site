import type { Locale, Stage } from "@/data/taxonomy";

/**
 * /work kart sahnesi: gerçek ekranlar cihaz çerçevesinde, ürünün kendi renginde ışık altında.
 * Tamamen dekoratif (aria-hidden) — kart başlığı ve özeti asıl içerik.
 */
export default function CardStage({ stage, locale }: { stage: Stage; locale: Locale }) {
  const shots = (locale === "en" && stage.shotsEn) || stage.shots;
  const phone = (locale === "en" && stage.phoneEn) || stage.phone;
  const n = stage.kind === "phones" ? Math.min(shots.length, 3) : 0;

  if (stage.kind === "art") {
    return (
      <div className="cstage cstage-art" aria-hidden>
        <img src={shots[0]} alt="" width={960} height={820} loading="lazy" decoding="async" />
      </div>
    );
  }

  if (stage.kind === "poster") {
    const parts = (stage.head?.[locale] ?? "").split("*");
    return (
      <div className={`cstage cstage-poster ctone-${stage.tone ?? "dark"}`} style={{ background: stage.bg, "--hl": stage.hl ?? "currentColor" } as React.CSSProperties} aria-hidden>
        <div className="cposter-copy">
          <p className="cposter-head">{parts.map((t, i) => (i % 2 ? <em key={i}>{t}</em> : t))}</p>
          {stage.sub && <p className="cposter-sub">{stage.sub[locale]}</p>}
        </div>
        <div className="cph cph-0">
          <img src={shots[0]} alt="" width={640} height={1391} loading="lazy" decoding="async" />
        </div>
        {stage.icon && <img className="cstage-icon" src={stage.icon} alt="" width={96} height={96} loading="lazy" decoding="async" />}
      </div>
    );
  }

  return (
    <div className={`cstage cstage-${stage.kind}${n ? ` cstage-n${n}` : ""}`} style={{ "--glow": stage.glow } as React.CSSProperties} aria-hidden>
      <div className="cstage-light" />
      {stage.kind === "phones" ? (
        shots.slice(0, n).map((src, i) => (
          <div key={src} className={`cph cph-${i}`}>
            <img src={src} alt="" width={640} height={1391} loading="lazy" decoding="async" />
          </div>
        ))
      ) : (
        <>
          <div className="cbrw">
            <div className="cbrw-bar">
              <i />
              <i />
              <i />
              {stage.url && <span>{stage.url}</span>}
            </div>
            <div className="cbrw-view">
              <img src={shots[0]} alt="" width={1200} height={750} loading="lazy" decoding="async" />
            </div>
          </div>
          {phone && (
            <div className="cph cph-side">
              <img src={phone} alt="" width={640} height={1391} loading="lazy" decoding="async" />
            </div>
          )}
        </>
      )}
      {stage.icon && <img className="cstage-icon" src={stage.icon} alt="" width={96} height={96} loading="lazy" decoding="async" />}
    </div>
  );
}
