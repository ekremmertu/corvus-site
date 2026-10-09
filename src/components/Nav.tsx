"use client";

import Link from "next/link";
import SectionLink from "@/components/SectionLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import { SITE } from "@/lib/site";

export default function Nav({ locale, d }: { locale: Locale; d: Dict }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const other: Locale = locale === "en" ? "tr" : "en";
  const otherPath = pathname.replace(/^\/(en|tr)/, `/${other}`) || `/${other}`;

  const links: { href?: string; section?: string; label: string }[] = [
    { href: `/${locale}/work`, label: d.nav.work },
    { section: "disciplines", label: d.nav.studio },
    { section: "process", label: d.nav.process },
    { section: "faq", label: "FAQ" },
  ];

  return (
    <>
      <nav className="nav" aria-label={d.nav.menu}>
        <Link href={`/${locale}`} className="nav-logo" aria-label={SITE.name}>
          <span className="brand-mark" data-brand-mark aria-hidden />
          CORVUS
        </Link>

        {links.map((l) =>
          l.section ? (
            <SectionLink key={l.section} locale={locale} id={l.section} className="nav-link">
              {l.label}
            </SectionLink>
          ) : (
            <Link key={l.href} href={l.href!} className="nav-link">
              {l.label}
            </Link>
          )
        )}

        <span style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
          <Link href={otherPath} hrefLang={other} className="nav-lang" aria-label={other === "tr" ? "Türkçe" : "English"}>
            {other}
          </Link>
          <SectionLink locale={locale} id="contact" className="nav-cta">
            {d.nav.cta}
          </SectionLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="nav-burger"
            aria-label={open ? d.nav.close : d.nav.menu}
          >
            <span aria-hidden style={{ position: "relative", display: "block", width: 16, height: 11 }}>
              <span style={{ position: "absolute", left: 0, top: open ? 5 : 0, width: 16, height: 1.5, background: "currentColor", transform: open ? "rotate(45deg)" : "none", transition: "all .3s" }} />
              <span style={{ position: "absolute", left: 0, top: open ? 5 : 10, width: 16, height: 1.5, background: "currentColor", transform: open ? "rotate(-45deg)" : "none", transition: "all .3s" }} />
            </span>
          </button>
        </span>
      </nav>

      <div id="mobile-menu" hidden={!open} className="nav-drawer">
        {links.map((l) =>
          l.section ? (
            <SectionLink key={l.section} locale={locale} id={l.section} onNavigate={() => setOpen(false)} className="big">
              {l.label}
            </SectionLink>
          ) : (
            <Link key={l.href} href={l.href!} className="big">
              {l.label}
            </Link>
          )
        )}
        <div style={{ marginTop: "auto", display: "grid", gap: 12 }}>
          <SectionLink locale={locale} id="contact" onNavigate={() => setOpen(false)} className="pill pill-white">
            {d.hero.ctaPrimary}
          </SectionLink>
          <a href={`mailto:${SITE.email}`} className="text-faint" style={{ textAlign: "center", fontSize: 14, padding: "12px 0" }}>
            {SITE.email}
          </a>
        </div>
      </div>
    </>
  );
}
