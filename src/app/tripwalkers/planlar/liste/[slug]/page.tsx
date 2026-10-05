import { notFound } from "next/navigation";
import { getList, lists } from "@/lib/liste";
import ListView, { listMetadata } from "@/components/gezi/views/ListView";

export function generateStaticParams() {
  return lists().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tripwalkers/planlar/liste/[slug]">) {
  return listMetadata((await params).slug, "tr");
}

export default async function ListPage({ params }: PageProps<"/tripwalkers/planlar/liste/[slug]">) {
  const list = getList((await params).slug, "tr");
  if (!list) notFound();
  return <ListView list={list} locale="tr" />;
}
