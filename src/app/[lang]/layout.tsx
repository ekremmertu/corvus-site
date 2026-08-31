import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDict, isLocale, locales } from "@/i18n/dict";
import { SITE } from "@/lib/site";
import { SceneProvider } from "@/components/scene/SceneProvider";
import SceneLayer from "@/components/scene/SceneLayer";
import RevealBoot from "@/components/RevealBoot";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/fx/CustomCursor";
import SweepFx from "@/components/fx/SweepFx";
import TerminalEgg from "@/components/fx/TerminalEgg";
import { openProjects, toCards } from "@/data/projects";
import Analytics from "@/components/Analytics";

const display = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    sameAs: [SITE.linkedin],
    foundingDate: SITE.founded,
    description: SITE.description[lang],
    address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: SITE.country },
  };

  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="grain relative min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[color:var(--c-live)] focus:px-4 focus:py-2 focus:text-black"
        >
          {lang === "tr" ? "İçeriğe geç" : "Skip to content"}
        </a>
        <SceneProvider>
          <SceneLayer />
          <RevealBoot />
          <Nav locale={lang} d={d} />
          <main id="main">{children}</main>
          <Footer locale={lang} d={d} />
          <CustomCursor />
          <SweepFx />
          <TerminalEgg entries={toCards(openProjects())} />
        </SceneProvider>
        <Analytics />
      </body>
    </html>
  );
}
