import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale, locales } from "@/i18n/dict";
import { toCards } from "@/data/projects";
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

// ?d= filtresi istemcide, yüklendikten sonra okunur — sayfa tamamen statik kalır
// ve kartlar sunucu HTML'inde gelir (JS'siz ziyaretçi ve arama motoru da görür).
export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <>
      <header className="page-head grain" style={{ background: "#000" }}>
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="h-display" style={{ margin: 0 }}>
            {d.work.title}
          </h1>
          <p className="lede" style={{ maxWidth: 560, margin: "20px 0 0" }}>
            {d.work.sub}
          </p>
        </div>
      </header>
      <WorkExplorer locale={lang} d={d} cards={toCards()} />
    </>
  );
}
