import { allSlugs } from "@/lib/gezi";
import { OG_SIZE, planOgImage } from "@/components/gezi/planOg";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "TripWalkers itinerary";

export function generateStaticParams() {
  return allSlugs("en").map((slug) => ({ slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return planOgImage(slug, "en");
}
