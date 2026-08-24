"use client";

import Link from "next/link";
import SectionLink from "@/components/SectionLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import { SITE } from "@/lib/site";

function Wordmark({ locale }: { locale: Locale }) {
  return (
    <Link
      href={`/${locale}`}
      className="group flex items-center gap-2.5"
      aria-label={SITE.name}
    >
      <span className="brand-mark h-[21px] w-[26px]" aria-hidden />
      <span className="display text-[15px] uppercase tracking-[0.12em]">
        Corvus<span style={{ color: "var(--c-live)" }}>.</span>
      </span>
    </Link>
  );
}

export default function Nav({ locale, d }: { locale: Locale; d: Dict }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    { section: "process", label: d.nav.process },
    { section: "faq", label: "FAQ" },
    { section: "contact", label: d.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "border-b border-[color:var(--c-border)] bg-[color:var(--c-bg)]/80 backdrop-blur-md" : ""
        }`}
        style={{ height: "var(--nav-h)" }}
      >
        <nav
          className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8"
          aria-label={d.nav.menu}
        >
          <Wordmark locale={locale} />

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) =>
              l.section ? (
                <SectionLink
                  key={l.section}
                  locale={locale}
                  id={l.section}
                  className="text-sm text-dim transition-colors hover:text-ink"
                >
                  {l.label}
                </SectionLink>
              ) : (
                <Link
                  key={l.href}
                  href={l.href!}
                  className="text-sm text-dim transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={otherPath}
              hrefLang={other}
              className="mono rounded-[var(--radius-pill)] border border-[color:var(--c-border)] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-[color:var(--c-live)] hover:text-[color:var(--c-live)]"
            >
              {other}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="glass grid h-10 w-10 place-items-center rounded-full md:hidden"
              aria-label={open ? d.nav.close : d.nav.menu}
            >
              <span className="relative block h-3 w-4">
                <span
                  className="absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300"
                  style={{ top: open ? 5 : 0, transform: open ? "rotate(45deg)" : "none" }}
                />
                <span
                  className="absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300"
                  style={{ top: open ? 5 : 10, transform: open ? "rotate(-45deg)" : "none" }}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-[color:var(--c-bg)]/97 backdrop-blur-md md:hidden"
      >
        <div className="flex h-full flex-col justify-center gap-2 px-8">
          {links.map((l) =>
            l.section ? (
              <SectionLink
                key={l.section}
                locale={locale}
                id={l.section}
                onNavigate={() => setOpen(false)}
                className="display border-b border-[color:var(--c-border)] py-5 text-3xl"
              >
                {l.label}
              </SectionLink>
            ) : (
              <Link
                key={l.href}
                href={l.href!}
                className="display border-b border-[color:var(--c-border)] py-5 text-3xl"
              >
                {l.label}
              </Link>
            )
          )}
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mono mt-8 text-sm text-dim"
          >
            {SITE.linkedinLabel}
          </a>
          <a href={`mailto:${SITE.email}`} className="mono mt-3 text-sm text-dim">
            {SITE.email}
          </a>
        </div>
      </div>
    </>
  );
}
