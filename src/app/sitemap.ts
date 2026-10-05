import type { MetadataRoute } from "next";
import { openProjects } from "@/data/projects";
import { locales } from "@/i18n/dict";
import { SITE } from "@/lib/site";
import { cities, GEZI_UPDATED } from "@/lib/gezi";
import { ROUTES } from "@/lib/gezi-i18n";
import { allSpots, lists } from "@/lib/liste";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-29");

  const alternates = (path: string) => ({
    languages: Object.fromEntries(
      locales.map((l) => [l, `${SITE.url}/${l}${path}`])
    ),
  });

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${SITE.url}/${locale}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: alternates(""),
    });
    entries.push({
      url: `${SITE.url}/${locale}/work`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: alternates("/work"),
    });
    for (const project of openProjects()) {
      entries.push({
        url: `${SITE.url}/${locale}/work/${project.slug}`,
        lastModified,
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: alternates(`/work/${project.slug}`),
      });
    }
  }

  // Rotalar: TR /gezi + EN /trips; karşılığı olan her sayfa hreflang ile eşlenir (EN yalnız çevirisi hazır planlar).
  const geziModified = new Date(GEZI_UPDATED);
  const pair = (trPath: string | null, enPath: string | null) => ({
    languages: Object.fromEntries(
      [["tr", trPath], ["en", enPath]].filter(([, p]) => p).map(([l, p]) => [l, `${SITE.url}${p}`]),
    ),
  });
  const push = (path: string, priority: number, alt: ReturnType<typeof pair>, changeFrequency: "weekly" | "monthly" = "monthly") =>
    entries.push({ url: `${SITE.url}${path}`, lastModified: geziModified, changeFrequency, priority, alternates: alt });

  const roots = pair(ROUTES.tr.root, ROUTES.en.root);
  push(ROUTES.tr.root, 0.9, roots, "weekly");
  push(ROUTES.en.root, 0.9, roots, "weekly");
  for (const c of cities()) {
    for (const s of c.seasons) {
      const alt = pair(`${ROUTES.tr.root}/${s.slug}`, s.hasEn ? `${ROUTES.en.root}/${s.enSlug}` : null);
      push(`${ROUTES.tr.root}/${s.slug}`, 0.8, alt);
      if (s.hasEn) push(`${ROUTES.en.root}/${s.enSlug}`, 0.8, alt);
    }
  }
  for (const l of lists()) {
    const alt = pair(`${ROUTES.tr.list}/${l.slug}`, `${ROUTES.en.list}/${l.slugEn}`);
    push(`${ROUTES.tr.list}/${l.slug}`, 0.85, alt);
    push(`${ROUTES.en.list}/${l.slugEn}`, 0.85, alt);
  }
  for (const sp of allSpots()) {
    const alt = pair(`${ROUTES.tr.place}/${sp.slug}`, `${ROUTES.en.place}/${sp.slug}`);
    push(`${ROUTES.tr.place}/${sp.slug}`, 0.7, alt);
    push(`${ROUTES.en.place}/${sp.slug}`, 0.7, alt);
  }

  return entries;
}
