import type { MetadataRoute } from "next";
import { openProjects } from "@/data/projects";
import { locales } from "@/i18n/dict";
import { SITE } from "@/lib/site";

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

  return entries;
}
