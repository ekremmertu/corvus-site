import { notFound } from "next/navigation";
import { allSlugs, getPlan } from "@/lib/gezi";
import PlanView, { planMetadata } from "@/components/gezi/views/PlanView";

// Bilinmeyen adres → notFound() → markalı not-found.tsx (dynamicParams=false olsa Next'in varsayılan 404'üne düşerdi).
export const dynamicParams = true;

export function generateStaticParams() {
  return allSlugs("tr").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/tripwalkers/planlar/[slug]">) {
  return planMetadata((await params).slug, "tr");
}

export default async function PlanPage({ params }: PageProps<"/tripwalkers/planlar/[slug]">) {
  const plan = getPlan((await params).slug, "tr");
  if (!plan) notFound();
  return <PlanView plan={plan} />;
}
