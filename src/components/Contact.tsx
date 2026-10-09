import { SITE } from "@/lib/site";
import type { Dict } from "@/i18n/dict";

/** Kapanış — tek dönüşüm hedefi: proje anlatmak (e-posta), ikincil: LinkedIn. */
export default function Contact({ d }: { d: Dict }) {
  return (
    <section id="contact" className="end grain" aria-labelledby="contact-title">
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <p className="eyebrow reveal" style={{ margin: 0 }}>
          {d.home.endEyebrow}
        </p>
        <h2 id="contact-title" className="reveal">
          {d.home.endTitle1}
          <br />
          <span className="serif sheen">{d.home.endTitle2}</span>
        </h2>
        <p className="lede end-sub reveal">{d.home.endSub}</p>
        <div className="end-acts reveal">
          <a href={`mailto:${SITE.email}`} className="pill pill-white">
            {d.home.endCta}
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="pill pill-line">
            {d.contact.cta}
          </a>
        </div>
        <a href={`mailto:${SITE.email}`} className="end-note">
          {SITE.email}
        </a>
        <span className="end-note" style={{ marginTop: 8 }}>
          {d.contact.based}
        </span>
      </div>
    </section>
  );
}
