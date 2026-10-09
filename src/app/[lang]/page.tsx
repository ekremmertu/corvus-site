import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/i18n/dict";
import { categories, countsByCategory, openProjects, projects } from "@/data/projects";
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

  // Şeritte yalnız perdesiz ürünlerin adları, yayındakiler önde.
  const names = [...open]
    .sort((a, b) => Number(b.status === "live") - Number(a.status === "live"))
    .map((p) => p.name);

  const strip: StripItem[] = [
    { slug: "tripwalkers", src: "/shots/tw-map.jpg", alt: tr ? "TripWalkers harita ekranı" : "TripWalkers map view" },
    { slug: "splittable", src: "/shots/st-kod.jpg", alt: tr ? "SplitTable masa kodu okutma ekranı" : "SplitTable table code scan" },
    { slug: "amelie-co", src: "/shots/am-tema.jpg", alt: tr ? "Ameliea davetiye teması seçimi" : "Ameliea invitation theme picker" },
    { slug: "quill", src: "/shots/q1.jpg", alt: tr ? "Quill aylık finans özeti" : "Quill monthly finance overview" },
    { slug: "cvtoapply", src: "/shots/cv-mob.jpg", alt: tr ? "CVtoapply mobil CV düzenleyici" : "CVtoapply mobile CV editor" },
    { slug: "splittable", src: "/shots/st-menu.jpg", alt: tr ? "SplitTable menü ve sepet ekranı" : "SplitTable menu and basket" },
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
          { value: "2025", label: d.stats.years },
        ]}
      />
      <ScreenStrip locale={lang} d={d} items={strip} />
      <Disciplines locale={lang} d={d} counts={countsByCategory()} />
      <FeaturedCase
        locale={lang}
        d={d}
        hero={bySlug("tripwalkers")}
        heroShots={[
          { src: "/shots/tw-home.jpg", alt: tr ? "TripWalkers ana ekran" : "TripWalkers home screen" },
          { src: "/shots/tw-day.jpg", alt: tr ? "TripWalkers gün detayı" : "TripWalkers day detail" },
        ]}
        duo={[
          { project: bySlug("amelie-co"), tone: "gold", shot: { src: "/shots/am-splash.jpg", alt: tr ? "Ameliea açılış ekranı" : "Ameliea splash screen" } },
          { project: bySlug("splittable"), tone: "red", shot: { src: "/shots/st-masa.jpg", alt: tr ? "SplitTable masa ve hesap ekranı" : "SplitTable table and bill" } },
        ]}
      />
      <Process d={d} />
      <Faq d={d} />
      <Contact d={d} />
    </>
  );
}
