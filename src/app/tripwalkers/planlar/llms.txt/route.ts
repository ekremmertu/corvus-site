import { llmsResponse } from "@/lib/gezi-llms";

export const dynamic = "force-static";

export function GET() {
  return llmsResponse("tr");
}
