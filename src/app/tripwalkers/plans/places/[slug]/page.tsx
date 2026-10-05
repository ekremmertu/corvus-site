import { notFound } from "next/navigation";
import { allSpots, getSpot } from "@/lib/liste";
import SpotView, { spotMetadata } from "@/components/gezi/views/SpotView";

export function generateStaticParams() {
  return allSpots().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tripwalkers/plans/places/[slug]">) {
  return spotMetadata((await params).slug, "en");
}

export default async function SpotPage({ params }: PageProps<"/tripwalkers/plans/places/[slug]">) {
  const spot = getSpot((await params).slug);
  if (!spot) notFound();
  return <SpotView spot={spot} locale="en" />;
}
