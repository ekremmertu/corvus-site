import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/i18n/dict";
import { categories, openProjects, projects, toCards, type CategorySlug } from "@/data/projects";
import Intro from "@/components/fx/Intro";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Manifesto from "@/components/Manifesto";
import ScreenStrip, { type StripItem, type WebItem } from "@/components/ScreenStrip";
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
  // "Canlıda" = status live; kurumsal, trading ve AI otomasyonları da canlı (CEO 09.10.2026, ★4) — rozetlerle aynı kaynak
  const live = projects.filter((p) => p.status === "live").length;
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

  // Şerit = App Store vitrin görselleri, CEO seçimi 09.10.2026 (T1 · S1 · M5 · Q1 · C1). Quill'in vitrin seti yok → ham ekran.
  const strip: StripItem[] = [
    { slug: "tripwalkers", src: tr ? "/shots/vt-tw.jpg" : "/shots/vt-tw-en.jpg", alt: tr ? "TripWalkers App Store görseli: seyahat planlayıcın" : "TripWalkers App Store screenshot: your travel planner" },
    { slug: "splittable", src: "/shots/vt-st.jpg", alt: tr ? "SplitTable App Store görseli: hesap geldi, kimse hesap yapmasın" : "SplitTable App Store screenshot: the bill is here, no math needed" },
    { slug: "splittable", src: "/shots/vt-stm.jpg", alt: tr ? "SplitTable Manager App Store görseli: gün sonu raporu" : "SplitTable Manager App Store screenshot: end-of-day report", name: "SplitTable Manager" },
    { slug: "quill", src: "/shots/vt-q.jpg", alt: tr ? "Quill ana ekran: aylık gelir ve harcama" : "Quill dashboard: monthly income and spending" },
    { slug: "cvtoapply", src: tr ? "/shots/vt-cv.jpg" : "/shots/vt-cv-en.jpg", alt: tr ? "CVtoapply App Store görseli: CV'n harika görünüyor, robot katılmıyor" : "CVtoapply App Store screenshot: your CV looks great, the robot disagrees" },
  ].map((s) => {
    const p = bySlug(s.slug);
    const cat = categories.find((c) => c.slug === p.category)!;
    return { ...s, name: s.name ?? p.name, sub: cat.name[lang] };
  });

  const webStrip: WebItem[] = [
    { slug: "cvtoapply", url: "cvtoapply.co", src: tr ? "/shots/web-cv.jpg" : "/shots/web-cv-en.jpg", alt: tr ? "CVtoapply web sitesi" : "CVtoapply website" },
    { slug: "amelie-co", url: "ameliea.co", src: "/shots/web-am.jpg", alt: tr ? "Ameliea web sitesi" : "Ameliea website" },
    { slug: "splittable", url: "splittable.me", src: "/shots/web-st.jpg", alt: tr ? "SplitTable web sitesi" : "SplitTable website" },
  ].map((s) => {
    const p = bySlug(s.slug);
    return { ...s, name: p.name, sub: categories.find((c) => c.slug === p.category)!.name[lang] };
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
          { value: String(live), label: d.stats.live, star: 4 },
          { value: String(categories.length), label: d.stats.disciplines },
          { value: "2025", label: d.stats.years, static: true },
        ]}
      />
      <ScreenStrip
        locale={lang}
        d={d}
        items={strip}
        web={webStrip}
        counts={{ app: tabCounts.ios ?? 0, web: tabCounts.web ?? 0, ent: projects.filter((p) => p.category === "enterprise").length }}
      />
      <Disciplines locale={lang} d={d} counts={tabCounts} />
      <FeaturedCase
        locale={lang}
        d={d}
        hero={bySlug("tripwalkers")}
        heroShots={[
          { src: tr ? "/shots/tw-gen.jpg" : "/shots/tw-gen-en.jpg", alt: tr ? "TripWalkers Tokyo rotası hazırlanıyor" : "TripWalkers preparing a Tokyo route" },
          { src: tr ? "/shots/tw-day.jpg" : "/shots/tw-day-en.jpg", alt: tr ? "TripWalkers gün detayı" : "TripWalkers day detail" },
        ]}
        duo={[
          { project: bySlug("amelie-co"), tone: "gold", web: "ameliea.co", shot: { src: "/shots/web-am.jpg", alt: tr ? "Ameliea web sitesi" : "Ameliea website" } },
          { project: bySlug("splittable"), tone: "red", shot: { src: "/shots/st-real.jpg", alt: tr ? "SplitTable hesabı eşit bölme ekranı" : "SplitTable split-the-bill screen" } },
        ]}
        saas={{
          project: bySlug("cvtoapply"),
          url: "cvtoapply.co",
          shot: { src: tr ? "/shots/web-cv.jpg" : "/shots/web-cv-en.jpg", alt: tr ? "CVtoapply web sitesi ana sayfası" : "CVtoapply website home page" },
        }}
        entCount={projects.filter((p) => p.category === "enterprise").length}
      />
      <Process d={d} />
      <Faq d={d} />
      <Contact d={d} />
    </>
  );
}
