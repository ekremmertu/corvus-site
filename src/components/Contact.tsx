import { SITE } from "@/lib/site";
import type { Dict } from "@/i18n/dict";
import CopyEmail from "@/components/CopyEmail";

/** Kapanış — tek dönüşüm hedefi: proje anlatmak (e-posta), ikincil: LinkedIn. */
export default function Contact({ d }: { d: Dict }) {
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(d.home.mailSubject)}&body=${encodeURIComponent(d.home.mailBody)}`;
  return (
    <section id="contact" className="end grain" aria-labelledby="contact-title">
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <h2 id="contact-title" className="reveal" style={{ marginTop: 0 }}>
          {d.home.endTitle1}
          <br />
          <span className="serif sheen">{d.home.endTitle2}</span>
        </h2>
        <p className="lede end-sub reveal">{d.home.endSub}</p>
        <div className="end-acts reveal">
          <a href={mailto} className="pill pill-white">
            {d.home.endCta}
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="pill pill-line">
            {d.contact.cta}
          </a>
        </div>
        <CopyEmail email={SITE.email} label={d.home.copy} done={d.home.copied} />
        <span className="end-note" style={{ marginTop: 8 }}>
          {d.contact.based}
        </span>
      </div>
    </section>
  );
}
