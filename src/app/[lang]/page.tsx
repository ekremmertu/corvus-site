import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/i18n/dict";
import { categories, openProjects, projects, toCards, type CategorySlug } from "@/data/projects";
import Intro from "@/components/fx/Intro";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Manifesto from "@/components/Manifesto";
import ScreenStrip, { type StripItem } from "@/components/ScreenStrip";
import Disciplines from "@/components/Disciplines";
import FeaturedCase from "@/components/FeaturedCase";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const tr = lang === "tr";

  // Rakamlar elle yazılmaz — veriden hesaplanır.
  const live = projects.filter((p) => p.status === "live" || p.status === "delivered").length;
  const open = openProjects();
  const bySlug = (slug: string) => {
    const p = open.find((x) => x.slug === slug);
    if (!p) throw new Error(`Açık projelerde yok: ${slug}`);
    return p;
  };

  // Disiplin sayıları İşler sekmesiyle aynı yöntemle (alsoIn kopyaları o sekmede sayılır).
  const tabCounts = toCards().reduce(
    (acc, c) => ({ ...acc, [c.category]: (acc[c.category] ?? 0) + 1 }),
    {} as Record<CategorySlug, number>
  );

  // Şeritte yalnız perdesiz ürünlerin adları, yayındakiler önde.
  const names = [...open]
    .sort((a, b) => Number(b.status === "live") - Number(a.status === "live"))
    .map((p) => p.name);

  // Ana sayfadaki telefonlar logolu açılış ekranı gösterir; gerçek ekranlar yalnız öne çıkan app'te (CEO 09.10.2026).
  const strip: StripItem[] = [
    { slug: "tripwalkers", src: "/shots/tile-tw.jpg", alt: "TripWalkers" },
    { slug: "splittable", src: "/shots/tile-st.jpg", alt: "SplitTable" },
    { slug: "amelie-co", src: "/shots/tile-am.jpg", alt: "Ameliea" },
    { slug: "quill", src: "/shots/tile-q.jpg", alt: "Quill" },
    { slug: "cvtoapply", src: "/shots/tile-cv.jpg", alt: "CVtoapply" },
  ].map((s) => {
    const p = bySlug(s.slug);
    const cat = categories.find((c) => c.slug === p.category)!;
    return { ...s, name: p.name, sub: cat.name[lang] };
  });

  return (
    <>
      <Intro skipLabel={d.home.skip} />
      <Hero locale={lang} d={d} />
      <Marquee label={d.home.trust} names={names} />
      <Manifesto
        d={d}
        stats={[
          { value: String(projects.length), label: d.stats.projects },
          { value: String(live), label: d.stats.live },
          { value: String(categories.length), label: d.stats.disciplines },
          { value: "2025", label: d.stats.years, static: true },
        ]}
      />
      <ScreenStrip locale={lang} d={d} items={strip} />
      <Disciplines locale={lang} d={d} counts={tabCounts} />
      <FeaturedCase
        locale={lang}
        d={d}
        hero={bySlug("tripwalkers")}
        heroShots={[
          { src: "/shots/tw-gen.jpg", alt: tr ? "TripWalkers Tokyo rotası hazırlanıyor" : "TripWalkers preparing a Tokyo route" },
          { src: "/shots/tw-day.jpg", alt: tr ? "TripWalkers gün detayı" : "TripWalkers day detail" },
        ]}
        duo={[
          { project: bySlug("amelie-co"), tone: "gold", shot: { src: "/shots/cover-am.jpg", alt: "Ameliea" } },
          { project: bySlug("splittable"), tone: "red", shot: { src: "/shots/cover-st.jpg", alt: "SplitTable" } },
        ]}
      />
      <Process d={d} />
      <Faq d={d} />
      <Contact d={d} />
    </>
  );
}
