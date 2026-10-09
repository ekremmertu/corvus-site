import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale, locales } from "@/i18n/dict";
import { CARD } from "@/lib/card";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/kart">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const d = getDict(locale);
  return {
    title: `${CARD.fullName} · ${d.card.title}`,
    description: d.card.sub,
    // Sadece basılı kartın QR'ından ulaşılır; arama motorlarına kapalı.
    robots: { index: false, follow: false },
  };
}

export default async function CardPage({ params }: PageProps<"/[lang]/kart">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  type Row = { k: string; v: string; href?: string };
  const rows: Row[] = [
    ...(CARD.phone ? [{ k: d.card.phone, v: CARD.phone, href: `tel:${CARD.phoneDigits}` }] : []),
    { k: d.card.email, v: CARD.email, href: `mailto:${CARD.email}` },
    { k: d.card.web, v: "corvus-tech.co", href: CARD.site },
    { k: "LinkedIn", v: SITE.linkedinLabel, href: CARD.linkedin },
    { k: d.card.location, v: CARD.city },
  ];

  return (
    <section className="page-head grain" aria-labelledby="card-name"
      style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(120,110,255,.14), transparent 70%), #000", paddingBottom: 96 }}>
      <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
        <p className="eyebrow">{d.card.eyebrow}</p>

        <h1 id="card-name" className="h-display" style={{ margin: "16px 0 0", fontSize: "clamp(2.5rem, 11vw, 4.5rem)" }}>
          {CARD.firstName}
          <br />
          <span className="serif sheen">{CARD.lastName}</span>
        </h1>
        <p className="lede" style={{ marginTop: 14 }}>
          {CARD.title} · {CARD.org}
        </p>

        <a href={`/${lang}/kart/ekrem-mert-ugur.vcf`} download="ekrem-mert-ugur.vcf" className="pill pill-white"
          style={{ width: "100%", minHeight: 60, marginTop: 40, fontSize: 16 }}>
          {d.card.save}
        </a>
        <p className="text-faint" style={{ marginTop: 12, fontSize: 13 }}>
          {d.card.saveHint}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
          {CARD.phone && (
            <>
              <a href={`tel:${CARD.phoneDigits}`} className="pill pill-line">{d.card.call}</a>
              <a href={`https://wa.me/${CARD.phoneDigits}`} target="_blank" rel="noopener noreferrer" className="pill pill-line">WhatsApp</a>
            </>
          )}
          <a href={`mailto:${CARD.email}`} className="pill pill-line">{d.card.email}</a>
          <a href={CARD.linkedin} target="_blank" rel="noopener noreferrer" className="pill pill-line">LinkedIn</a>
        </div>

        <ul style={{ listStyle: "none", margin: "48px 0 0", padding: 0, border: "1px solid var(--line-2)", borderRadius: "var(--radius-lg)", background: "var(--card)" }}>
          {rows.map((r, i) => (
            <li key={r.k} style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", alignItems: "baseline", padding: "16px 20px", borderTop: i ? "1px solid var(--line-2)" : 0 }}>
              <span className="mono text-faint" style={{ width: 96, flexShrink: 0, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {r.k}
              </span>
              {r.href ? (
                <a href={r.href} style={{ fontSize: 15, wordBreak: "break-all" }} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {r.v}
                </a>
              ) : (
                <span style={{ fontSize: 15 }}>{r.v}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
