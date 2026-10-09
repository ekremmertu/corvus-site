import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDict, isLocale, locales } from "@/i18n/dict";
import { SITE } from "@/lib/site";
import RevealBoot from "@/components/RevealBoot";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/fx/CustomCursor";
import TerminalEgg from "@/components/fx/TerminalEgg";
import { openProjects, toCards } from "@/data/projects";
import Analytics from "@/components/Analytics";

const sans = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Vurgu kelimeleri (stüdyo., Yayınla., mi var?) — yalnız italik.
const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
});

// Yalnız ASCII kuzgun açılışı ve gizli terminal için.
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const title =
    locale === "tr"
      ? "Corvus Tech — Ürün stüdyosu"
      : "Corvus Tech — Product studio";

  return {
    metadataBase: new URL(SITE.url),
    // Google Search Console doğrulaması (URL prefix property, uekremmert@gmail.com).
    // GEO'nun 2. halkası: arama indeksine girmenin ve sitemap göndermenin ön şartı.
    // ⚠️ Doğrulama kalıcıdır — bu satır silinirse property doğrulaması DÜŞER.
    verification: { google: "7adWrWQkx2UBWAsy8KvUY9kBQZam4s9f5QHIH4-fyVo" },
    title: {
      default: title,
      template: `%s · ${SITE.name}`,
    },
    description: SITE.description[locale],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", tr: "/tr", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      title,
      description: SITE.description[locale],
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title, description: SITE.description[locale] },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  /**
   * GEO — kurum kimliği.
   *
   * ⚠️ AD ÇAKIŞMASI ÖLÇÜLDÜ (2026-08-31): "Corvus Tech" araması Corvus Energy,
   * Corvus Robotics, Corvus Systems, Corvus Technology Solutions ve Crunchbase'de
   * BAŞKA bir "Corvus Tech" getiriyor. Bir yapay zekâ asistanına "Corvus Tech kim?"
   * diye sorulduğunda büyük olasılıkla BAŞKA şirketi anlatır.
   *
   * Çözüm ad değiştirmek değil, AYIRT EDİCİ BAĞLAMI makine-okunur hâle getirmek:
   * ne yaptığımız (knowsAbout), nerede olduğumuz (address + areaServed), hangi
   * tür kuruluş olduğumuz (ProfessionalService) ve doğrulanabilir bağlantılarımız
   * (sameAs). Motor "hangi Corvus" sorusunu bu alanlardan ayırt eder.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: SITE.name,
    alternateName: `${SITE.name} — ${SITE.city}`,
    url: SITE.url,
    email: SITE.email,
    // Doğrulanabilir dış profiller: motorun kimliği eşleştirdiği çapa noktaları.
    sameAs: [SITE.linkedin],
    knowsAbout: [
      "iOS app development",
      "SwiftUI",
      "Next.js web platforms",
      "Payment integration",
      "Algorithmic trading systems",
      "AI agent infrastructure",
      "Product design",
    ],
    areaServed: { "@type": "Country", name: "Türkiye" },
    numberOfEmployees: { "@type": "QuantitativeValue", value: 1, unitText: "studio" },
    foundingDate: SITE.founded,
    description: SITE.description[lang],
    address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: SITE.country },
  };

  return (
    <html lang={lang} className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="sr-only skip-link">
          {lang === "tr" ? "İçeriğe geç" : "Skip to content"}
        </a>
        <RevealBoot />
        <Nav locale={lang} d={d} />
        <main id="main">{children}</main>
        <Footer locale={lang} d={d} />
        <CustomCursor label={d.home.view} />
        <TerminalEgg entries={toCards(openProjects())} />
        <Analytics />
      </body>
    </html>
  );
}
