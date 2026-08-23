import Link from "next/link";
import SectionLink from "@/components/SectionLink";
import { categories, type Locale } from "@/data/projects";
import type { Dict } from "@/i18n/dict";
import { SITE } from "@/lib/site";
import TerminalTrigger from "@/components/fx/TerminalTrigger";

export default function Footer({ locale, d }: { locale: Locale; d: Dict }) {
  const year = 2026;

  return (
    <footer className="relative border-t border-[color:var(--c-border)] bg-[color:var(--c-bg)]">
      <div className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="display text-lg uppercase tracking-[0.12em]">
              Corvus<span style={{ color: "var(--c-live)" }}>.</span>
            </p>
            <p className="lede mt-4 max-w-[36ch] text-[14px]">
              {SITE.description[locale]}
            </p>
          </div>

          <nav aria-label={d.footer.disciplines}>
            <p className="eyebrow">{d.footer.disciplines}</p>
            <ul className="mt-4 space-y-2.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${locale}/work?d=${c.slug}`}
                    className="text-sm text-dim transition-colors hover:text-ink"
                  >
                    {c.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={d.footer.studio}>
            <p className="eyebrow">{d.footer.studio}</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href={`/${locale}/work`} className="text-sm text-dim hover:text-ink">
                  {d.nav.work}
                </Link>
              </li>
              <li>
                <SectionLink locale={locale} id="process" className="text-sm text-dim hover:text-ink">
                  {d.nav.process}
                </SectionLink>
              </li>
              <li>
                <SectionLink locale={locale} id="faq" className="text-sm text-dim hover:text-ink">
                  FAQ
                </SectionLink>
              </li>
              <li>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-dim hover:text-ink"
                >
                  {d.nav.contact}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[color:var(--c-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-faint">
            © {year} {SITE.name}. {d.footer.rights}
          </p>
          <p className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-faint">
            {SITE.city} · {d.footer.built} <TerminalTrigger />
          </p>
        </div>
      </div>
    </footer>
  );
}
