import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/i18n/dict";
import { categories, countsByCategory, projects, toCards } from "@/data/projects";
import Hero from "@/components/Hero";
import BrandFilm from "@/components/BrandFilm";
import DisciplineStage from "@/components/DisciplineStage";
import HomeWork from "@/components/HomeWork";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  const live = projects.filter(
    (p) => p.status === "live" || p.status === "delivered"
  ).length;

  return (
    <>
      <Hero locale={lang} d={d} counts={countsByCategory()} />
      <BrandFilm locale={lang} />
      <Marquee />
      <Stats
        d={d}
        items={[
          { value: String(projects.length), label: d.stats.projects },
          { value: String(live), label: d.stats.live },
          { value: String(categories.length), label: d.stats.disciplines },
          { value: "2025", label: d.stats.years },
        ]}
      />
      <DisciplineStage locale={lang} d={d} />
      <HomeWork locale={lang} d={d} cards={toCards()} />
      <Process locale={lang} d={d} />
      <Faq d={d} />
      <Contact d={d} />
    </>
  );
}
