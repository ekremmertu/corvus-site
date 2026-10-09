import { buildVCard } from "@/lib/card";

// Statik dosya gibi davranır: build'de bir kez üretilir, CDN'den gelir.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildVCard(), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ekrem-mert-ugur.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
