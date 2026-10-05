import IndexView, { indexMetadata } from "@/components/gezi/views/IndexView";

export const metadata = indexMetadata("en");

export default function TripsIndex() {
  return <IndexView locale="en" />;
}
