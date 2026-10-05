import type { Metadata, Viewport } from "next";
import { SITE } from "@/lib/site";
import { t } from "@/lib/gezi-i18n";
import GeziShell from "@/components/gezi/GeziShell";

/**
 * /tripwalkers/planlar — TripWalkers planları (TR). Stüdyo sitesinden AYRI kök layout:
 * WebGL sahnesi, özel imleç ve efektler burada yüklenmez (içerik sayfaları, LCP öncelikli).
 * İngilizce karşılığı /tripwalkers/plans — aynı kabuk ve aynı sayfa görünümleri (components/gezi/views).
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: t("tr").siteTitle, template: "%s · TripWalkers" },
  verification: { google: "7adWrWQkx2UBWAsy8KvUY9kBQZam4s9f5QHIH4-fyVo" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F2EC" },
    { media: "(prefers-color-scheme: dark)", color: "#121110" },
  ],
};

export default function GeziLayout({ children }: { children: React.ReactNode }) {
  return <GeziShell locale="tr">{children}</GeziShell>;
}
