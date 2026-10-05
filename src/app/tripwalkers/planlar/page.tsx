import IndexView, { indexMetadata } from "@/components/gezi/views/IndexView";

export const metadata = indexMetadata("tr");

export default function GeziIndex() {
  return <IndexView locale="tr" />;
}
