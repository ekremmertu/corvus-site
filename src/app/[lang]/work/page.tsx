import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDict, isLocale, locales } from "@/i18n/dict";
import WorkExplorer from "@/components/WorkExplorer";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const d = getDict(locale);
  return {
    title: d.work.title,
    description: d.work.sub,
    alternates: {
      canonical: `/${locale}/work`,
      languages: { en: "/en/work", tr: "/tr/work" },
    },
  };
}

// ?d= filtresi client'ta okunur (useSearchParams) — sayfa böylece tamamen
// statik kalır ve CDN'den anında gelir; dynamic SSR beklenmez.
export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <>
      <header className="mx-auto w-full max-w-[1240px] px-5 pb-14 pt-[calc(var(--nav-h)+72px)] sm:px-8">
        <p className="eyebrow">{"// " + d.nav.work}</p>
        <h1 className="display mt-4" style={{ fontSize: "var(--type-display)" }}>
          {d.work.title}
        </h1>
        <p className="lede mt-5">{d.work.sub}</p>
      </header>
      <Suspense>
        <WorkExplorer locale={lang} d={d} />
      </Suspense>
    </>
  );
}
