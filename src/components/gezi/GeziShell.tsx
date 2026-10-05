import Link from "next/link";
import "./gezi.css";
import { SITE } from "@/lib/site";
import Analytics from "@/components/Analytics";
import HeaderCta from "./HeaderCta";
import { body, display } from "./fonts";
import { HTML_LANG, ROUTES, t, type Locale } from "@/lib/gezi-i18n";

function Pin() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M12 2.5c-3.9 0-7 3-7 6.9 0 5 7 12.1 7 12.1s7-7.1 7-12.1c0-3.9-3.1-6.9-7-6.9Z" fill="var(--ember)" />
      <circle cx="12" cy="9.4" r="2.6" fill="var(--paper)" />
    </svg>
  );
}

/** /gezi (TR) ve /trips (EN) kök layout'larının ortak kabuğu: html lang, üst şerit, alt bilgi. */
export default function GeziShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const d = t(locale);
  const root = ROUTES[locale].root;
  return (
    <html lang={HTML_LANG[locale]} className={`${display.variable} ${body.variable}`}>
      <body className="gz">
        <a href="#icerik" className="gz-skip">{d.skip}</a>
        <header className="gz-top">
          <div className="gz-top__in">
            <Link href={root} className="gz-brand" aria-label={d.brandAria}>
              <Pin />
              <span className="gz-brand__word">TripWalkers</span>
              <span className="gz-brand__tag">{d.brandTag}</span>
            </Link>
            <HeaderCta locale={locale} />
          </div>
        </header>
        <main id="icerik">{children}</main>
        <footer className="gz-foot">
          <div className="gz-foot__in">
            <p className="gz-foot__lead">{d.footLead}</p>
            <nav className="gz-foot__nav" aria-label={d.footNav}>
              <Link href={root}>{d.allTrips}</Link>
              <Link href={ROUTES[locale === "tr" ? "en" : "tr"].root} hrefLang={locale === "tr" ? "en" : "tr"}>
                {d.otherLang.label}
              </Link>
              <HeaderCta locale={locale} className="">{d.ctaFoot}</HeaderCta>
              <a href={`${SITE.url}/${locale}`}>{d.studio}</a>
            </nav>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
