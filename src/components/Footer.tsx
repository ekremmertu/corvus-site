import Link from "next/link";
import SectionLink from "@/components/SectionLink";
import { categories, type Locale } from "@/data/projects";
import type { Dict } from "@/i18n/dict";
import { SITE } from "@/lib/site";
import TerminalTrigger from "@/components/fx/TerminalTrigger";

export default function Footer({ locale, d }: { locale: Locale; d: Dict }) {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link href={`/${locale}`} className="nav-logo" style={{ color: "#fff", marginBottom: 12 }} aria-label={SITE.name}>
              <span className="brand-mark" aria-hidden />
              CORVUS
            </Link>
            <span className="t" style={{ maxWidth: 320, lineHeight: 1.6 }}>
              {SITE.description[locale]}
            </span>
          </div>
          <nav aria-label={d.footer.disciplines}>
            <b>{d.footer.disciplines}</b>
            {categories.map((c) => (
              <Link key={c.slug} href={`/${locale}/work?d=${c.slug}`}>
                {c.name[locale]}
              </Link>
            ))}
          </nav>
          <nav aria-label={d.footer.studio}>
            <b>{d.footer.studio}</b>
            <Link href={`/${locale}/work`}>{d.nav.work}</Link>
            <SectionLink locale={locale} id="process">
              {d.nav.process}
            </SectionLink>
            <SectionLink locale={locale} id="faq">
              FAQ
            </SectionLink>
          </nav>
          <div>
            <b>{d.nav.contact}</b>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>
            © 2026 {SITE.name}. {d.footer.rights}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {SITE.city} · {d.footer.built} <TerminalTrigger />
          </span>
        </div>
      </div>
    </footer>
  );
}
