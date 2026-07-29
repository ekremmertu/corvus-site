import { SITE } from "@/lib/site";
import type { Dict } from "@/i18n/dict";

export default function Contact({ d }: { d: Dict }) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative bg-[color:var(--c-bg)]/86"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 py-24 sm:px-8 sm:py-36">
        <div className="reveal">
          <h2 id="contact-title" className="display" style={{ fontSize: "var(--type-display)" }}>
            <span className="block">{d.contact.title1}</span>
            <span className="display-italic block" style={{ color: "var(--c-live)" }}>
              {d.contact.title2}
            </span>
          </h2>
          <p className="lede mt-6 text-[15px]">{d.contact.sub}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href={`mailto:${SITE.email}`} className="btn btn-primary">
              {d.contact.cta}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="mono text-sm text-dim underline-offset-4 hover:text-[color:var(--c-live)] hover:underline"
            >
              {SITE.email}
            </a>
          </div>

          <p className="eyebrow mt-10">{d.contact.based}</p>
        </div>
      </div>
    </section>
  );
}
