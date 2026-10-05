import { notFound } from "next/navigation";
import { getList, lists } from "@/lib/liste";
import ListView, { listMetadata } from "@/components/gezi/views/ListView";

export function generateStaticParams() {
  return lists().map((l) => ({ slug: l.slugEn }));
}

export async function generateMetadata({ params }: PageProps<"/tripwalkers/plans/lists/[slug]">) {
  return listMetadata((await params).slug, "en");
}

export default async function ListPage({ params }: PageProps<"/tripwalkers/plans/lists/[slug]">) {
  const list = getList((await params).slug, "en");
  if (!list) notFound();
  return <ListView list={list} locale="en" />;
}
