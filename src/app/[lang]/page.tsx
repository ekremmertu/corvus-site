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

  const strip: StripItem[] = [
    { slug: "tripwalkers", src: "/shots/tw-reel.jpg", alt: tr ? "TripWalkers reel linkinden gezi planlama" : "TripWalkers trip planning from a reel link" },
    { slug: "splittable", src: "/shots/st-kim.jpg", alt: tr ? "SplitTable masada kim ne ödedi ekranı" : "SplitTable who paid what at the table" },
    { slug: "amelie-co", src: "/shots/am-tema.jpg", alt: tr ? "Ameliea davetiye teması seçimi" : "Ameliea invitation theme picker" },
    { slug: "quill", src: "/shots/q-exp.jpg", alt: tr ? "Quill gider dağılımı ekranı" : "Quill expense breakdown" },
    { slug: "cvtoapply", src: "/shots/cv-baski.jpg", alt: tr ? "CVtoapply ATS skoru 76, baskıya hazır" : "CVtoapply ATS score 76, ready to print" },
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
          { project: bySlug("amelie-co"), tone: "gold", shot: { src: "/shots/am-davet.jpg", alt: tr ? "Ameliea davetiye başlangıç ekranı" : "Ameliea invitation intro screen" } },
          { project: bySlug("splittable"), tone: "red", shot: { src: "/shots/st-logo.jpg", alt: tr ? "SplitTable logosu" : "SplitTable logo" }, logo: true },
        ]}
      />
      <Process d={d} />
      <Faq d={d} />
      <Contact d={d} />
    </>
  );
}
